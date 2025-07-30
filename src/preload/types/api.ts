import type { UserInfo, ExpiredAccounts } from './user'
import type { Proxy } from './proxy'

export interface ResultType<T> {
  code: number
  msg: string
  data: T
}
export interface IUser {
  //查询用户列表
  queryUserList: () => Promise<ResultType<UserInfo[]>>
  // 单用户登录时调用，返回用户信息
  requestUserLogin: (cookie: string) => Promise<ResultType<UserInfo>>
  // 检查所有用户是否处于登录状态，返回过期的id列表
  hasAllCookiesExpired: () => Promise<ResultType<ExpiredAccounts>>
  // 更新用户订阅，返回当前用户的订阅列表
  updateUserSubs: (steamID: number, proxynameList: string[]) => Promise<ResultType<string[]>>
  // 删除用户,返回用户名
  deleteUser: (steamID: number) => Promise<ResultType<string>>
}
export interface IProxy {
  // 查询所有的代理
  queryProxyList: () => Promise<ResultType<Proxy[]>>
  //增加，删除代理，返回更改后的所有代理
  deleteProxy: (proxyName: string) => Promise<ResultType<Proxy[]>>
  addProxy: (proxy: Proxy) => Promise<ResultType<Proxy[]>>
}
export interface IMonitor {
  // 更新查询间隔
  updateInterval: (interval: number) => Promise<ResultType<string>>
  // 启动或关闭监听
  updateMonitorStatus: () => Promise<ResultType<string>>
  // 获取新消息
  ReceiveNews: () => Promise<ResultType<string>>
}
export interface IWindow {
  requestWindowClose: () => void
  requestWindowMaximize: () => void
  requestWindowMinimize: () => void
  onUpdateWindowStatus: (callback: (value: boolean) => void) => void
}
