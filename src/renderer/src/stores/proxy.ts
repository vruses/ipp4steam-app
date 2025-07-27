import { defineStore } from 'pinia'
import type { Proxy, ProxyMap } from '@renderer/types/proxy'
import { reactive } from 'vue'

export const useProxyStore = defineStore('proxy', () => {
  // 等待node读取配置文件
  const data: Array<Proxy> = [
    {
      proxyConfigName: 'f按速度',
      proxyData: {
        proxyLink: 'string',
        targetLink: 'string',
        requestType: 'get'
      }
    },
    {
      proxyConfigName: '拉拉肥',
      proxyData: {
        proxyLink: 'string',
        targetLink: 'string',
        requestType: 'get'
      }
    },
    {
      proxyConfigName: '纪律链接',
      proxyData: {
        proxyLink: 'string',
        targetLink: 'string',
        requestType: 'get'
      }
    }
  ]
  const proxyMap = reactive<ProxyMap>(new Map())
  for (const d of data) {
    proxyMap.set(d.proxyConfigName, d.proxyData)
  }
  // window.api.queryProxyList().then((res) => {
  //   for (const proxy of res as Proxy[]) {
  //     proxyList.push(proxy)
  //   }
  // })
  return { proxyMap }
})
