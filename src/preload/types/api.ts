import type { UserInfo, ExpiredAccounts, LoginRes } from './user'
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
  requestUserLogin: (cookie: string) => Promise<ResultType<LoginRes>>
  // 检查所有用户是否处于登录状态，返回过期的id列表
  hasAllCookiesExpired: () => Promise<ResultType<ExpiredAccounts>>
  // 更新用户订阅，返回当前用户的订阅列表
  updateUserSubs: (
    steamID: string,
    proxynameList: string[]
  ) => Promise<ResultType<{ count: number }>>
  // 删除用户,返回用户名
  deleteUser: (steamID: string) => Promise<ResultType<string>>
}
export interface IProxy {
  // 查询所有的代理
  queryProxyList: () => Promise<ResultType<Proxy[]>>
  //增加，删除代理，返回更改后的所有代理
  deleteProxy: (proxyName: string) => Promise<ResultType<string>>
  addProxy: (proxy: Proxy) => Promise<ResultType<string>>
}
export interface IMonitor {
  // 更新查询间隔
  updateInterval: (interval: number) => Promise<ResultType<number>>
  // 启动或关闭监听,返回当前任务数
  updateMonitorStatus: (status: boolean) => Promise<ResultType<number>>
  // 获取新消息
  ReceiveNews: (callback: (value: unknown) => void) => void
  // 获取登录心跳
  heartbeatLogs: (callback: (value: unknown) => void) => void
  // 更新出价
  updatePrice: (price: number) => Promise<ResultType<number>>
  // 读取配置文件
  getMonitorConfig: () => Promise<ResultType<{ queryInterval: number; expectedPrice: number }>>
}
export interface IWindow {
  requestWindowClose: () => void
  requestWindowMaximize: () => void
  requestWindowMinimize: () => void
  onUpdateWindowStatus: (callback: (value: boolean) => void) => void
}
