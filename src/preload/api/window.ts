import { ipcRenderer } from 'electron/renderer'

export const windowApi = {
  requestWindowClose: () => {
    const channelName = 'window-close'
    ipcRenderer.send(channelName)
  },
  requestWindowMaximize: () => {
    const channelName = 'window-maximize'
    ipcRenderer.send(channelName)
  },
  requestWindowMinimize: () => {
    const channelName = 'window-minimize'
    ipcRenderer.send(channelName)
  }
}
