import { ElectronAPI } from '@electron-toolkit/preload'
import { Proxy } from '@renderer/types/proxy'
import { UserInfo, ExpiredAccounts } from '@renderer/types/user'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      /** 应用窗口初始化调用，初始化页面配置 */

      queryProxyList: () => Promise<Proxy[]>
      queryUserList: () => Promise<UserInfo[]>

      /** 应用运行时可能会调用 */

      //增加，删除代理时调用(数据量较少，变更一个更新全部)
      updateProxyList: (proxyList: Proxy[]) => Promise<Proxy[]>
      // 单用户登录时调用
      requestUserLogin: (cookie: string) => Promise<UserInfo>
      // 检查所有用户是否处于登录状态
      hasAllCookiesExpired: () => Promise<ExpiredAccounts>
    }
  }
}
