import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      queryProxyList: () => Promise<unknown>
      updateProxyList: (proxyList: unknown) => Promise<unknown>
    }
  }
}
