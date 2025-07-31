import { defineStore } from 'pinia'
import type { Proxy, ProxyMap } from '@renderer/types/proxy'
import type { ResultType } from '@renderer/types/api'
import { reactive } from 'vue'

export const useProxyStore = defineStore('proxy', () => {
  const proxyMap = reactive<ProxyMap>(new Map())
  // 页面挂载时请求数据
  const fetchProxyList = (): void => {
    window.proxyApi.queryProxyList().then((res) => {
      for (const d of res.data) {
        proxyMap.set(d.proxyConfigName, d.proxyData)
      }
    })
  }
  // 添加新的代理
  const addProxy = (proxy: Proxy): Promise<ResultType<string>> => {
    // 数据写入成功时返回proxy名称
    return window.proxyApi.addProxy(proxy).then((res) => {
      if (res.code === 0) {
        proxyMap.set(proxy.proxyConfigName, proxy.proxyData)
      }
      return res
    })
  }
  // 删除代理
  const deleteProxy = (proxyName: string): Promise<ResultType<string>> => {
    // 数据删除成功时返回被删除proxy名称
    return window.proxyApi.deleteProxy(proxyName).then((res) => {
      if (res.code === 0) {
        proxyMap.delete(proxyName)
      }
      return res
    })
  }
  return { proxyMap, fetchProxyList, addProxy, deleteProxy }
})
