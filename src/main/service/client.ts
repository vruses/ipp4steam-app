import HttpClient from '@main/utils/http'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { queryProxiesWithUserProxies } from '@main/mapper/proxyMapper'
import type { UserAuthAndProxies, ExtendedFlatProxy } from '@preload/types/user-proxy'
import type { AxiosHeaders } from 'axios'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
// 创建请求客户端
const createHttpClient = (proxy_url: string, headers?: DeepPartial<AxiosHeaders>): HttpClient => {
  // 只有当proxy_url存在时才创建代理
  const proxyAgent = proxy_url
    ? new HttpsProxyAgent(proxy_url, {
        keepAlive: true
      })
    : null
  const httpClient = new HttpClient({
    httpsAgent: proxyAgent,
    headers
  })
  return httpClient
}

// 扩展proxy，将代理客户端添加至代理对象身上,以及代理对象订阅用户对象上
type ProxyType = ExtendedFlatProxy<'client', HttpClient>
type ProxyUsersTreeX = ProxyType & {
  users: UserAuthAndProxies<ProxyType>[]
}
// 构建代理客户端与用户关系树
const useHttpClientFactory = async (): Promise<ProxyUsersTreeX[]> => {
  const proxies = (await queryProxiesWithUserProxies()) as ProxyUsersTreeX[]
  // 查询代理客户端
  for (const proxy of proxies) {
    proxy.client = createHttpClient(proxy.proxyLink)
    for (const user of proxy.users) {
      // 上报代理客户端
      for (const proxy2 of user.proxies) {
        proxy2.client = createHttpClient(proxy.proxyLink, {
          Cookie: user.cookie,
          Referer: proxy2.targetLink
        })
      }
    }
  }
  return proxies
}

// 查询订单列表
const getOrderList = async (proxy: ProxyUsersTreeX): Promise<void> => {
  proxy.client.get(proxy.targetLink).then().catch()
}
// 创建订单请求
const postOrder = async (proxy: ProxyType): Promise<void> => {
  proxy.client.post(proxy.targetLink, {}).then().catch()
}

export { useHttpClientFactory, getOrderList, postOrder, type ProxyUsersTreeX }
