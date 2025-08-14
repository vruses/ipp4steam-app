import type { ResultType } from '@preload/types/api'
import type { ExpiredAccounts, LoginRes, UserInfo } from '@preload/types/user'
import {
  deleteUser,
  queryAllCookies,
  queryAllUserInfo,
  updateUserSubs
} from '@main/mapper/userMapper'
import { requestLogin, validateCookie } from '@main/service/request/requestService4Refresh'
import { updateAllJobs } from '@main/service/schedule'

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
const handleRequestUserLogin = async (refreshToken: string): Promise<ResultType<LoginRes>> => {
  const result = await requestLogin(refreshToken)
  return {
    code: 0,
    msg: '用户登录成功',
    data: result.loginRes
  }
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
      const loginRes = validateCookie(cookie)
        .then((result): LoginRes => {
          return result.data
        })
        .catch(() => {
          return { steamID, loginStatus: 'failed', nickname: '' } as LoginRes
        })
      return loginRes
    })
  )

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
