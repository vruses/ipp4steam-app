import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { UserInfo } from '@renderer/types/user'
import { ResultType } from '@renderer/types/api'

type UserManager = {
  btnStatus: string
  userList: UserInfo[]
}
export const useUserStore = defineStore('user', () => {
  const userManager = reactive<UserManager>({
    btnStatus: 'idle',
    userList: []
  })
  // cookie传给preload,将返回的userinfo传给组件进行信息展示
  const login = async (cookie: string): Promise<ResultType<UserInfo>> => {
    return window.userApi.requestUserLogin(cookie).then((result) => {
      // -2为登录成功，但数据存储失败
      if (result.code === 0 || result.code === -2) {
        // 检查id是否重复，重复则更新id对应对象
        const index = userManager.userList.findIndex((value) => {
          return value.steamID === result.data.steamID
        })
        index !== -1
          ? Object.assign(userManager.userList[index], result.data)
          : userManager.userList.push({ ...result.data, proxynameList: [] }) //保持类型一致
      }
      return result as ResultType<UserInfo>
    })
  }

  //返回登录过期的账号昵称
  const hasAllCookiesExpired = async (): Promise<string[]> => {
    return window.userApi.hasAllCookiesExpired().then((res) => {
      return userManager.userList
        .filter((user) => {
          if (res.data.failedSteamIDList.includes(user.steamID)) {
            user.loginStatus = 'failed'
            return true
          } else {
            user.loginStatus = 'succeed'
            return false
          }
        })
        .map((value) => value.nickname)
    })
  }

  // 更新用户订阅
  const updateSubscription = (
    steamID: string,
    currentList: string[]
  ): Promise<ResultType<{ count: number }>> => {
    const index = userManager.userList.findIndex((value) => {
      return value.steamID === steamID
    })
    return window.userApi.updateUserSubs(steamID, currentList).then((result) => {
      if (result.code === 0) {
        // 注意副作用，会使得其它解构变量丢失引
        userManager.userList[index].proxynameList = currentList
      }
      return result
    })
  }

  // 删除用户
  const deleteUser = (steamID: string): Promise<ResultType<string>> => {
    return window.userApi.deleteUser(steamID).then((result) => {
      if (result.code === 0) {
        const index = userManager.userList.findIndex((value) => {
          return value.steamID === steamID
        })
        userManager.userList.splice(index, 1)
      }
      return result
    })
  }

  // 查询用户数据
  const getUserList = (): void => {
    window.userApi
      .queryUserList()
      .then((res) => {
        if (res.code === 0) {
          userManager.userList.splice(0, userManager.userList.length, ...res.data)
        }
      })
      .catch(() => {})
  }
  return { login, hasAllCookiesExpired, updateSubscription, deleteUser, getUserList, userManager }
})
