import { BrowserWindow, ipcMain } from 'electron'
import { updateIntreval, updateMonitorStatus } from '@main/service/monitor'

function registerMonitorIpc(win: BrowserWindow): void {
  ipcMain.handle('update-intreval', (_event, intreval: number) => {
    return updateIntreval(intreval)
  })
  ipcMain.handle('update-monitor-status', (_event, status: boolean) => {
    return updateMonitorStatus(status)
  })
  // TODO:实现主进程消息推送
  // win.webContents.send('receive-news', false)
}
export default registerMonitorIpc
