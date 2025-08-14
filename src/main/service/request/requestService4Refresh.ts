import { useHeaders } from '@main/service/request/requestConfig'
import {
  type ProxyUsersTreeX,
  type ProxyType,
  createHttpClient
} from '@main/service/request/client'
import { parseUserInfo } from '@main/service/request/htmlParser'
import { observer } from '@main/ipc/monitor'
import type { LoginRes } from '@preload/types/user'
import type { ResultType } from '@preload/types/api'
import getAccessCookie from '@main/service/request/cookie'
import { upsertUserStatus } from '@main/mapper/userMapper'
import { queryProxyByType } from '@main/mapper/proxyMapper'
import { queryRefreshTokenById } from '@main/mapper/userMapper'
import { debounceUpdateAllJobs } from '@main/service/schedule'

// 登录检测的请求客户端单例
const clientInstance = queryProxyByType('post')
  .then((result) => {
    if (result) {
      return createHttpClient(result.proxyLink)
    }
    throw new Error('代理不存在')
  })
  .catch(() => {
    return createHttpClient('')
  })

// 登录检测，持续上报请求心跳
// 登录失败则重新登录，有可能重新登录失败
// 重新登录后需要更新任务里用户的的cookie，同时防抖确保不同时更新多次(更新多次可能造成循环)
type User = ProxyUsersTreeX['users'][number]
const heartbeat = (user: User, proxy: ProxyType): void => {
  const headers = useHeaders('community', user.cookie)
  proxy.client
    .get('https://steamcommunity.com/market', { headers })
    .then((res) => {
      const info = parseUserInfo(res as string)
      //当未登录时推送渲染进程消息
      if (info.steamID) {
        // 登录成功
        observer.notify('notify:heartbeat-logs', {
          code: 0,
          msg: 'success',
          data: `用户${user.nickname}登录成功！`
        })
      } else {
        throw new Error('用户登录过期!')
      }
    })
    .catch((error: { status: number; message: string }) => {
      // 尝试重新登录
      queryRefreshTokenById(user.steamID)
        .then(async (result) => {
          if (result) {
            // 登录并更新数据库
            requestLogin(result.refreshToken).then(() => {
              // 由于心跳依赖于任务调度器的执行，选择事件循环尾部更新任务，同时防抖
              queueMicrotask(() => {
                debounceUpdateAllJobs()
              })
              observer.notify('notify:heartbeat-logs', {
                code: 2,
                msg: 'success',
                data: `刷新用户${user.nickname}登录状态成功！`
              })
            })
            throw new Error('用户尝试重新登录失败!')
          }
        })
        .catch(() => {
          // 可能刷新token后仍然登录失败
          observer.notify('notify:heartbeat-logs', {
            code: -2,
            msg: 'fail',
            data: `刷新用户${user.nickname}登录状态失败！`
          })
        })
      // 可能429请求频繁
      observer.notify('notify:heartbeat-logs', {
        code: error.status ?? -1,
        msg: error.message,
        data: `用户${user.nickname}登录过期。。。`
      })
    })
}

// 通过refreshToken获取用户cookie并返回用户信息
const requestLogin = (refreshToken: string): Promise<{ loginRes: LoginRes; cookie: string }> => {
  return getAccessCookie(refreshToken).then(async (res) => {
    // 登录成功
    if (res.user.steamID) {
      const loginRes: LoginRes = {
        steamID: res.user.steamID,
        nickname: res.user.nickname,
        loginStatus: 'succeed'
      }
      // 存入accessCookie和refreshToken
      await upsertUserStatus(loginRes, res.cookie, refreshToken)
      // 登录成功
      return {
        loginRes,
        cookie: res.cookie
      }
    }
    throw new Error('用户登录失败')
  })
}

// cookie是否过期
const validateCookie = async (cookie: string): Promise<ResultType<LoginRes>> => {
  const headers = useHeaders('community', cookie)
  const client = await clientInstance
  return client.get<string>('https://steamcommunity.com/market', { headers }).then((res) => {
    const info = parseUserInfo(res)
    // 登录成功
    if (info.steamID) {
      return {
        code: 0,
        msg: 'cookie未过期',
        data: {
          steamID: info.steamID,
          nickname: info.nickname,
          loginStatus: 'succeed'
        } as LoginRes
      }
    }
    throw new Error('cookie已失效')
  })
}
export { requestLogin, heartbeat, validateCookie }
