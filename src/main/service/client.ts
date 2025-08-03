import HttpClient from '@main/utils/http'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { queryProxiesWithUserProxies } from '@main/mapper/proxyMapper'
import type { UserAuthAndProxies, ExtendedFlatProxy } from '@preload/types/user-proxy'
import type { AxiosHeaders } from 'axios'
import type { ItemInfoLog, ItemOrdersInfo } from '@main/service/order'
import { notifyNews } from '@main/service/monitorService'
import { getPrice, setPrice } from '@main/service/store'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
// 创建请求客户端
const createHttpClient = (proxy_url: string, headers?: DeepPartial<AxiosHeaders>): HttpClient => {
  try {
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
  } catch (error) {
    console.log(error)
    return new HttpClient({
      headers
    })
  }
}

// 扩展proxy，将代理客户端添加至代理对象身上,以及代理对象订阅用户对象上
type ProxyType = ExtendedFlatProxy<'client', HttpClient>
type ProxyUsersTreeX = ProxyType & {
  users: UserAuthAndProxies<ProxyType>[]
}
// 构建代理客户端与用户关系树
const useHttpClientFactory = async (): Promise<ProxyUsersTreeX[]> => {
  const proxies = (await queryProxiesWithUserProxies()) as ProxyUsersTreeX[]
  // 实时获取数据的代理客户端
  for (const proxy of proxies) {
    proxy.client = createHttpClient(proxy.proxyLink)
    for (const user of proxy.users) {
      // 创建用户购买订单的代理客户端
      for (const proxy2 of user.proxies) {
        proxy2.client = createHttpClient(proxy.proxyLink, {
          Cookie: user.cookie,
          Referer: 'https://steamcommunity.com/market',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
      }
    }
  }
  return proxies
}

// 提取目标url的查询参数
const extractQueryParam = (url: string, key: string): string => {
  const parsedUrl = new URL(url)
  const queryParams = Object.fromEntries(parsedUrl.searchParams.entries())
  return queryParams[key]
}

// 提取cookie字段
const extractCookieValue = (cookie: string, name: string): string => {
  const cookies = cookie.split('; ')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === name) {
      return decodeURIComponent(value)
    }
  }
  return ''
}

// itemid与itemname的映射
const marketHashNameMap = {
  176003279: 'Reaper Mask',
  176003275: 'Survivalist Slacks',
  // 测试链接
  175882811: 'Combat Pants (Blue)'
}

let price_total = getPrice()

// 查询订单列表：实时记录与更新列表信息，在获取到关键信息时发送创建订单请求
const getOrderList = async (proxy: ProxyUsersTreeX): Promise<void> => {
  proxy.client
    .get<ItemOrdersInfo>(proxy.targetLink)
    .then((res) => {
      // 解析target_url里的item_nameid
      const itemID = extractQueryParam(proxy.targetLink, 'item_nameid')
      // 如果不为null，则说明当前有售卖单
      if (res.lowest_sell_order) {
        // 通过itemID拿到商品名
        const hashName = marketHashNameMap[itemID]
        for (const user of proxy.users) {
          for (const proxy of user.proxies) {
            const sessionid = extractCookieValue(user.cookie, 'sessionid')
            // 创建订单需要cookie里的sessionid和商品名
            postOrder(proxy, sessionid, hashName)
          }
        }
        // 用于发送给客户端的对象
        const itemInfo: ItemInfoLog = {
          itemID,
          itemName: marketHashNameMap[itemID],
          orderGraph: res.sell_order_graph[0]
        }
        notifyNews(itemInfo)
      } else {
        // 检查是否有订购单
        if (!res.highest_buy_order) return
        // 用于购买单日志记录
        // 筛选最接近1800的订单数量信息
        const filtered = res.buy_order_graph.filter((item) => item[0] >= 1800)
        const targetCell = filtered[filtered.length - 1]
        const itemInfoLog: ItemInfoLog = {
          itemID,
          itemName: marketHashNameMap[itemID],
          orderGraph: targetCell ?? res.buy_order_graph[0]
        }
        notifyNews(itemInfoLog)
      }
    })
    .catch((err) => {
      // empty
      console.log(err)
    })
}

// 创建订单请求: 请求成功后移除客户端
const postOrder = async (proxy: ProxyType, sessionid: string, hashName: string): Promise<void> => {
  if (!proxy.client) {
    return
  }
  proxy.client
    .post(proxy.targetLink, {
      sessionid,
      currency: 3,
      // PUBG game的appid
      appid: 578080,
      market_hash_name: hashName,
      price_total: price_total * 100,
      tradefee_tax: 0,
      quantity: 1,
      billing_state: '',
      save_my_address: 0,
      first_name: '1',
      last_name: '1',
      billing_address: '1',
      billing_address_two: '1',
      billing_country: '1',
      billing_city: '1',
      billing_postal_code: '1',
      confirmation: 1
    })
    .then((res) => {
      console.log(res)
      // @ts-ignore 在成功创建订单后移除client防止重复发送订单请求
      proxy.client = null
      // 发送客户端信息
      // console.log(res)
    })
    .catch((err) => {
      // 发送客户端信息
      console.log(err)
    })
}

// TODO:登录检测，持续上报请求心跳
const heartbeat = (proxy: ProxyType): void => {
  // console.log(proxy)
}

const setExpectedPrice = (price: number): number => {
  price_total = price
  setPrice(price)
  return price_total
}

export {
  useHttpClientFactory,
  getOrderList,
  postOrder,
  heartbeat,
  setExpectedPrice,
  type ProxyUsersTreeX
}
