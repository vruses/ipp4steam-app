import { ipcRenderer } from 'electron/renderer'
import type { IProxy } from '@preload/types/api'

export const proxyApi: IProxy = {
  queryProxyList: () => {
    const channelName = 'query-proxy-list'
    return ipcRenderer.invoke(channelName)
  },
  deleteProxy: (proxyName) => {
    const channelName = 'delete-proxy'
    return ipcRenderer.invoke(channelName, proxyName)
  },
  addProxy: (proxy) => {
    const channelName = 'add-proxy'
    return ipcRenderer.invoke(channelName, proxy)
  }
}
