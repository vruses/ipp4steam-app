import type { ResultType } from '@preload/types/api'
import type { ExpiredAccounts, LoginRes, UserInfo } from '@preload/types/user'
import {
  deleteUser,
  queryAllUserInfo,
  updateUserSubs,
  upsertUserStatus
} from '@main/mapper/userMapper'
import { queryProxyByType } from '@main/mapper/proxyMapper'
import { createHttpClient } from '@main/service/request/client'
import { commonHeaders, setWebTradeEligibilityCookie } from '@main/service/request/requestConfig'
import { requestLogin } from '@main/service/request/requestService'
import { cloneDeep } from 'lodash-es'

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
  // cookie，查询一个post或者get proxy,返回用户响应信息
  const headers = cloneDeep(commonHeaders)
  headers.cookie = setWebTradeEligibilityCookie(cookie)
  const client = await queryProxyByType('post')
    .then((result) => {
      if (!result) {
        return createHttpClient('', headers)
      } else {
        return createHttpClient(result.proxyLink, headers)
      }
    })
    .catch(() => {
      return createHttpClient('', headers)
    })
  // 等待用户数据入库后返回响应
  const result = await requestLogin(client)
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

const handleHasAllCookiesExpired = async (): Promise<ResultType<ExpiredAccounts>> => {
  throw new Error('Function not implemented.')
}

const handleUpdateUserSubs = async (
  steamID: string,
  proxynameList: string[]
): Promise<ResultType<{ count: number }>> => {
  return updateUserSubs(steamID, proxynameList)
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
        msg: 'fail',
        data: {
          count: 0
        }
      }
    })
}

const handleDeleteUser = async (steamID: string): Promise<ResultType<string>> => {
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
