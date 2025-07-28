import { ipcMain, BrowserWindow } from 'electron'

function registerWindowIpc(win: BrowserWindow): void {
  ipcMain.on('window-close', () => {
    win.close()
  })

  ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })

  ipcMain.on('window-minimize', () => {
    win.minimize()
  })
}

export default registerWindowIpc
