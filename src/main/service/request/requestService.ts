import type { ItemInfoLog, ItemOrdersInfo } from '@main/service/request/order'
import { notifyNews } from '@main/service/monitorService'
import { getPrice, setPrice } from '@main/service/store'
import {
  extractCookieValue,
  marketHashNameMap,
  useHeaders
} from '@main/service/request/requestConfig'
import type { ProxyUsersTreeX, ProxyType } from '@main/service/request/client'
import { observer } from '@main/ipc/monitor'

import type { AxiosRequestHeaders } from 'axios'

let price_total = getPrice()

// 提取目标url的查询参数
const extractQueryParam = (url: string, key: string): string => {
  const parsedUrl = new URL(url)
  const queryParams = Object.fromEntries(parsedUrl.searchParams.entries())
  return queryParams[key]
}

type CbType = () => Promise<void>
// 提前计算创建订单的回调
const orderCallbacksFactory = (proxy: ProxyUsersTreeX): CbType[] => {
  const itemID = extractQueryParam(proxy.targetLink, 'item_nameid')
  const hashName = marketHashNameMap[itemID]
  const callbackList: CbType[] = []
  for (const user of proxy.users) {
    for (const proxy2 of user.proxies) {
      const headers = useHeaders('order', user.cookie, hashName)
      const sessionid = extractCookieValue(user.cookie, 'sessionid')
      // 创建订单需要cookie里的sessionid和商品名，传入计算后的用户header
      callbackList.push(() =>
        postOrder(proxy2, sessionid, hashName, user, headers as AxiosRequestHeaders)
      )
    }
  }
  return callbackList
}

// 查询订单列表：实时记录与更新列表信息，在获取到关键信息时发送创建订单请求
const getOrderList = async (proxy: ProxyUsersTreeX, cbList: CbType[]): Promise<void> => {
  proxy.client
    .get<ItemOrdersInfo>(proxy.targetLink)
    .then((res) => {
      // 解析target_url里的item_nameid
      const itemID = extractQueryParam(proxy.targetLink, 'item_nameid')
      // 如果不为null，则说明当前有售卖单
      if (res.lowest_sell_order) {
        // 执行此商品订阅用户的创建订单回调
        for (const cb of cbList) {
          cb()
        }
        // 用于发送给客户端的对象
        const itemInfo: ItemInfoLog = {
          itemID,
          itemName: marketHashNameMap[itemID],
          orderGraph: res.sell_order_graph[0]
        }
        notifyNews(itemInfo)
        observer.notify('notify:heartbeat-logs', {
          code: 0,
          msg: 'success',
          data: `检测到商品售卖单=>${itemInfo.itemName}：${itemInfo.orderGraph}`
        })
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
const postOrder = async (
  proxy: ProxyType,
  sessionid: string,
  hashName: string,
  user: ProxyUsersTreeX['users'][number],
  headers: AxiosRequestHeaders
): Promise<void> => {
  proxy.client
    .post(
      proxy.targetLink,
      {
        sessionid,
        currency: 3,
        // PUBG game的appid
        appid: 578080,
        market_hash_name: hashName,
        price_total: price_total * 100,
        tradefee_tax: 0,
        quantity: 1,
        billing_state: '',
        save_my_address: 1,
        first_name: '1',
        last_name: '1',
        billing_address: '1',
        billing_address_two: '1',
        billing_country: 'ES',
        billing_city: '1',
        billing_postal_code: '1'
      },
      { headers }
    )
    .then((res) => {
      observer.notify('notify:heartbeat-logs', {
        code: 0,
        msg: 'success',
        data: { ...(res as Record<string, string>), nickname: user.nickname }
      })
    })
    .catch((err) => {
      // 发送客户端信息
      observer.notify('notify:heartbeat-logs', {
        code: -1,
        msg: 'fail',
        data: { ...(err as Record<string, string>), nickname: user.nickname }
      })
    })
}

const setExpectedPrice = (price: number): number => {
  price_total = price
  setPrice(price)
  return price_total
}

export { getOrderList, postOrder, setExpectedPrice, orderCallbacksFactory }
