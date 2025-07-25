import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      /** 应用窗口初始化调用，初始化页面配置 */

      queryProxyList: () => Promise<unknown>
      queryUserList: () => Promise<unknown>

      /** 应用运行时可能会调用 */

      //增加，删除代理时调用
      updateProxyList: (proxyList: unknown) => Promise<unknown>
      // 单用户登录时调用
      requestUserLogin: (LoginPayload: unknown) => Promise<unknown>
      //
    }
  }
}
