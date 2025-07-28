import { ElectronAPI } from '@electron-toolkit/preload'
import { IMonitor, IProxy, IUser, IWindow } from './types/api'

declare global {
  interface Window {
    electron: ElectronAPI
    userApi: IUser
    proxyApi: IProxy
    monitorApi: IMonitor
    windowApi: IWindow
  }
}
