import type { IUser } from '@preload/types/api'
import { ipcRenderer } from 'electron/renderer'

export const userApi: IUser = {
  queryUserList: () => {
    const channelName = 'query-user-list'
    return ipcRenderer.invoke(channelName)
  },
  requestUserLogin: (cookie: string) => {
    const channelName = 'request-user-login'
    return ipcRenderer.invoke(channelName, cookie)
  },
  hasAllCookiesExpired: () => {
    const channelName = 'has-all-cookies-expired'
    return ipcRenderer.invoke(channelName)
  },
  updateUserSubs: (steamID: string, proxynameList: string[]) => {
    const channelName = 'update-user-subs'
    return ipcRenderer.invoke(channelName, steamID, proxynameList)
  },
  deleteUser: (steamID: string) => {
    const channelName = 'delete-user'
    return ipcRenderer.invoke(channelName, steamID)
  }
}
