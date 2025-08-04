import type { ItemInfoLog, ItemOrdersInfo } from '@main/service/request/order'
import { notifyNews } from '@main/service/monitorService'
import { getPrice, setPrice } from '@main/service/store'
import { extractCookieValue, marketHashNameMap } from '@main/service/request/requestConfig'
import type { ProxyUsersTreeX, ProxyType } from '@main/service/request/client'
import { parseUserInfo } from '@main/service/request/htmlParser'
import { observer } from '@main/ipc/monitor'
import type HttpClient from '@main/utils/http'
import type { LoginRes } from '@preload/types/user'
import type { ResultType } from '@preload/types/api'

let price_total = getPrice()

// 提取目标url的查询参数
const extractQueryParam = (url: string, key: string): string => {
  const parsedUrl = new URL(url)
  const queryParams = Object.fromEntries(parsedUrl.searchParams.entries())
  return queryParams[key]
}

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
      observer.notify('notify:heartbeat-logs', {
        code: 0,
        msg: 'success',
        data: res
      })
    })
    .catch((err) => {
      // 发送客户端信息
      observer.notify('notify:heartbeat-logs', {
        code: -1,
        msg: 'fail',
        data: err
      })
    })
}

// 登录检测，持续上报请求心跳
type User = ProxyUsersTreeX['users'][number]
const heartbeat = (user: User, proxy: ProxyType): void => {
  proxy.client
    .get('https://steamcommunity.com/market')
    .then((res) => {
      const info = parseUserInfo(res as string)

      //当未登录时推送渲染进程消息
      if (!info.steamID) {
        // 登录失效
        observer.notify('notify:heartbeat-logs', {
          code: -1,
          msg: 'fail',
          data: { steamID: user.steamID, nickname: user.nickname, loginStatus: 'failed' }
        })
      } else {
        // 登录成功
        observer.notify('notify:heartbeat-logs', {
          code: 0,
          msg: 'success',
          data: { steamID: info.steamID, nickname: info.nickname, loginStatus: 'succeed' }
        })
      }
    })
    .catch((error: { status: number; message: string }) => {
      // 可能429请求频繁
      observer.notify('notify:heartbeat-logs', {
        code: error.status,
        msg: error.message,
        data: { steamID: user.steamID, nickname: user.nickname, loginStatus: 'failed' }
      })
    })
}

// 查看登录的用户信息
const requestLogin = (client: HttpClient): Promise<ResultType<LoginRes>> => {
  return client
    .get<string>('https://steamcommunity.com/market')
    .then((res) => {
      const info = parseUserInfo(res)
      // 登录失效
      if (!info.steamID) {
        return {
          code: -1,
          msg: '用户登录失败',
          data: {} as LoginRes
        }
      } else {
        // 登录成功
        return {
          code: 0,
          msg: '用户登录成功',
          data: {
            steamID: info.steamID,
            nickname: info.nickname,
            loginStatus: 'succeed'
          } as LoginRes
        }
      }
    })
    .catch((error: { status: number; message: string }) => {
      // 可能429请求频繁,也可能用户输入了错误的请求信息
      return {
        code: error.status,
        msg: error.message,
        data: {} as LoginRes
      }
    })
}

const setExpectedPrice = (price: number): number => {
  price_total = price
  setPrice(price)
  return price_total
}

export { requestLogin, getOrderList, postOrder, heartbeat, setExpectedPrice }
