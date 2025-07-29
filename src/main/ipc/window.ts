import { ipcMain, BrowserWindow } from 'electron'
import { main } from '@main/script'

function registerWindowIpc(win: BrowserWindow): void {
  ipcMain.on('window-close', () => {
    win.close()
  })

  ipcMain.on('window-maximize', () => {
    main()
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })

  ipcMain.on('window-minimize', () => {
    win.minimize()
  })

  win.on('maximize', () => {
    win.webContents.send('update-window-status', true)
  })

  win.on('unmaximize', () => {
    win.webContents.send('update-window-status', false)
  })
}

export default registerWindowIpc
