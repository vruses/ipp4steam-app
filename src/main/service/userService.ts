import type { ResultType } from '@preload/types/api'
import type { ExpiredAccounts, LoginRes, UserInfo } from '@preload/types/user'
import {
  deleteUser,
  queryAllCookies,
  queryAllUserInfo,
  updateAllUserStatus,
  updateUserSubs,
  upsertUserStatus
} from '@main/mapper/userMapper'
import { queryProxyByType } from '@main/mapper/proxyMapper'
import { createHttpClient } from '@main/service/request/client'
import { requestLogin } from '@main/service/request/requestService'
import { updateAllJobs } from '@main/service/schedule'

// 登录检测的请求客户端单例
const client = await queryProxyByType('post')
  .then((result) => {
    if (!result) {
      return createHttpClient('')
    } else {
      return createHttpClient(result.proxyLink)
    }
  })
  .catch(() => {
    return createHttpClient('')
  })

const handleQueryUserList = async (): Promise<ResultType<UserInfo[]>> => {
  return queryAllUserInfo()
    .then((result) => {
      return {
        code: 0,
        msg: 'success',
        data: result
      }
    })
    .catch(() => {
      return {
        code: -1,
        msg: 'fail',
        data: []
      }
    })
}

// 用户登录信息
const handleRequestUserLogin = async (cookie: string): Promise<ResultType<LoginRes>> => {
  // 等待用户数据入库后返回响应
  const result = await requestLogin(client, cookie)
  if (result.code === 0) {
    return await upsertUserStatus(result.data, cookie)
      .then(() => result)
      .catch((error) => {
        console.log(error)
        return { code: -2, msg: '用户登录成功但信息存储失败', data: result.data }
      })
  }
  return result
}

// 检查所有用户登录是否过期
const handleHasAllCookiesExpired = async (): Promise<ResultType<ExpiredAccounts>> => {
  // 查询所有cookie
  const userCookieList = await queryAllCookies()

  // 登录结果
  const loginResultList = await Promise.all(
    userCookieList.map((value) => {
      const steamID = value.steamID
      const cookie = value.cookie
      const loginRes = requestLogin(client, cookie).then((result): LoginRes => {
        if (result.code === -1) {
          // 注意：nickname不会被updateAllUserStatus更新
          return { steamID, loginStatus: 'failed', nickname: '' }
        } else if (result.code === 1) {
          return result.data
        } else {
          // 网络错误时先置为登录
          return { steamID, loginStatus: 'succeed', nickname: '' }
        }
      })
      return loginRes
    })
  )
  // 更新数据库
  updateAllUserStatus(loginResultList).catch()

  const expiredAccounts = loginResultList
    .filter((item) => {
      return item.loginStatus === 'failed'
    })
    .map((value) => value.steamID)

  return { code: 0, msg: 'success', data: { failedSteamIDList: expiredAccounts } }
}

const handleUpdateUserSubs = async (
  steamID: string,
  proxynameList: string[]
): Promise<ResultType<{ count: number }>> => {
  return updateUserSubs(steamID, proxynameList)
    .then((result) => {
      updateAllJobs()
      return {
        code: 0,
        msg: 'success',
        data: result
      }
    })
    .catch(() => {
      return {
        code: 0,
        msg: 'fail',
        data: {
          count: 0
        }
      }
    })
}

const handleDeleteUser = async (steamID: string): Promise<ResultType<string>> => {
  updateAllJobs()
  return deleteUser(steamID)
    .then((result) => {
      return {
        code: 0,
        msg: 'success',
        data: result
      }
    })
    .catch(() => {
      return {
        code: 0,
        msg: 'success',
        data: ''
      }
    })
}

export {
  handleDeleteUser,
  handleHasAllCookiesExpired,
  handleQueryUserList,
  handleRequestUserLogin,
  handleUpdateUserSubs
}
