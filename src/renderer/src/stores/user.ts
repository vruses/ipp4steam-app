import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { UserInfo } from '@renderer/types/user'

type UserManager = {
  btnStatus: string
  userList: UserInfo[]
}
export const useUserStore = defineStore('user', () => {
  const userManager = reactive<UserManager>({
    btnStatus: 'idle',
    userList: [
      {
        steamID: 123,
        nickname: 'a',
        loginStatus: 'success',
        proxynameList: ['a', 'b', 'c', '创建购买单']
      },
      {
        steamID: 456,
        nickname: 'b',
        loginStatus: 'failed',
        proxynameList: ['a', 'b', 'c', '创建购买单']
      }
    ]
  })
  // cookie传给preload,将返回的userinfo传给组件进行信息展示
  const login = async (cookie: string): Promise<UserInfo> => {
    // 调用window.api.requestUserLogin(cookie)返回userinfo
    console.log(cookie)
    // document.querySelector('a[data-miniprofile]').href.split('/')[4] steamid
    // document.querySelector('a[data-miniprofile]').textContent nickname
    const id = 123
    // 检查id是否重复，重复则更新id对应对象
    const index = userManager.userList.findIndex((value) => {
      return value.steamID === id
    })
    index !== -1
      ? Object.assign(userManager.userList[index], {
          steamID: 123,
          nickname: 'a',
          loginStatus: 'success',
          proxynameList: ['a', 'b', 'c', '创建购买单']
        })
      : userManager.userList.push({
          steamID: 123,
          nickname: 'a',
          loginStatus: 'success',
          proxynameList: ['a', 'b', 'c', '创建购买单']
        })
    return {
      steamID: 123,
      nickname: 'a',
      loginStatus: 'success',
      proxynameList: ['a', 'b', 'c', '创建购买单']
    }
    // 初始化，返回{data:[{username,loginStatus,proxynameList}]}
    // window.api.queryUserList()
  }
  // preload返回登录失败的userid列表，更新对应账号数据，将账号昵称传给组件进行信息展示
  const hasAllCookiesExpired = async (): Promise<string[]> => {
    // 调用await window.api.hasAllCookiesExpired()返回ExpiredAccounts
    return ['a', 'b', 'c']
  }
  // 更新用户订阅
  const updateSubscription = (steamID: number, currentList: string[]): void => {
    const index = userManager.userList.findIndex((value) => {
      return value.steamID === steamID
    })
    // 注意副作用，会使得其它解构变量丢失引
    userManager.userList[index].proxynameList = currentList
  }
  // 删除用户
  const deleteUser = (steamID: number): void => {
    const index = userManager.userList.findIndex((value) => {
      return value.steamID === steamID
    })
    userManager.userList.splice(index, 1)
  }
  return { login, hasAllCookiesExpired, updateSubscription, deleteUser, userManager }
})
