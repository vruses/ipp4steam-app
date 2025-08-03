import type { ResultType } from '@preload/types/api'
import type { ExpiredAccounts, UserInfo } from '@preload/types/user'
import { deleteUser, queryAllUserInfo, updateUserSubs } from '@main/mapper/userMapper'

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

const handleRequestUserLogin = async (cookie: string): Promise<ResultType<UserInfo>> => {
  throw new Error('Function not implemented.')
}

const handleHasAllCookiesExpired = async (): Promise<ResultType<ExpiredAccounts>> => {
  throw new Error('Function not implemented.')
}

const handleUpdateUserSubs = async (
  steamID: number,
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

const handleDeleteUser = async (steamID: number): Promise<ResultType<string>> => {
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
