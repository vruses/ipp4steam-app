import { ipcMain } from 'electron'
import {
  handleDeleteUser,
  handleHasAllCookiesExpired,
  handleQueryUserList,
  handleRequestUserLogin,
  handleUpdateUserSubs
} from '@main/service/userService'
function registerUserIpc(): void {
  ipcMain.handle('query-user-list', async () => {
    return await handleQueryUserList()
  })
  ipcMain.handle('request-user-login', async (_event, cookie: string) => {
    return await handleRequestUserLogin(cookie)
  })
  ipcMain.handle('has-all-cookies-expired', async () => {
    return await handleHasAllCookiesExpired()
  })
  ipcMain.handle('update-user-subs', async (_event, steamID: number, proxynameList: string[]) => {
    return await handleUpdateUserSubs(steamID, proxynameList)
  })
  ipcMain.handle('delete-user', async (_event, steamID: number) => {
    return await handleDeleteUser(steamID)
  })
}

export default registerUserIpc
