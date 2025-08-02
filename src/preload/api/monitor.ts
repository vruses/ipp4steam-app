import type { IMonitor } from '@preload/types/api'
import { ipcRenderer } from 'electron/renderer'

export const monitorApi: IMonitor = {
  // 更新查询间隔
  updateInterval: (interval: number) => {
    const channelName = 'update-intreval'
    return ipcRenderer.invoke(channelName, interval)
  },
  // 启动或关闭监听
  updateMonitorStatus: (status: boolean) => {
    const channelName = 'update-monitor-status'
    return ipcRenderer.invoke(channelName, status)
  },
  // 获取新消息
  ReceiveNews: (callback) => {
    const channelName = 'receive-news'
    ipcRenderer.on(channelName, (_event, value: boolean) => callback(value))
  },
  updatePrice: (price) => {
    const channelName = 'update-price'
    return ipcRenderer.invoke(channelName, price)
  },
  getMonitorConfig: () => {
    const channelName = 'get-config'
    return ipcRenderer.invoke(channelName)
  }
}
