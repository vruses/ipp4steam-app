import { defineStore } from 'pinia'
import type { Proxy } from '@renderer/types/proxy'
import { reactive } from 'vue'

export const useProxyStore = defineStore('proxy', () => {
  // 等待node读取配置文件
  const proxyList = reactive<Proxy[]>([
    { proxyLink: 'string', targetLink: 'string', proxyConfigName: 'f按速度', requestType: 'get' },
    { proxyLink: 'string', targetLink: 'string', proxyConfigName: '发发发', requestType: 'get' },
    { proxyLink: 'string', targetLink: 'string', proxyConfigName: '发顺丰', requestType: 'get' },
    { proxyLink: 'string', targetLink: 'string', proxyConfigName: 'f阿斯弗', requestType: 'get' }
  ])
  // window.api.queryProxyList().then((res) => {
  //   for (const proxy of res as Proxy[]) {
  //     proxyList.push(proxy)
  //   }
  // })
  return { proxyList }
})
