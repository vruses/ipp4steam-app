import { defineStore } from 'pinia'
import type { Proxy } from '@renderer/types/proxy'
import { reactive } from 'vue'

export const useProxyStore = defineStore('proxy', () => {
  // 等待node读取配置文件
  const proxyList = reactive<Proxy[]>([])
  // window.api.queryProxyList().then((res) => {
  //   for (const proxy of res as Proxy[]) {
  //     proxyList.push(proxy)
  //   }
  // })
  return { proxyList }
})
