import { ipcMain } from 'electron'
import {
  updateIntreval,
  updateMonitorStatus,
  updatePrice,
  getConfig
} from '@main/service/monitorService'
import type { ResultType } from '@preload/types/api'

function registerMonitorIpc(): void {
  ipcMain.handle('update-intreval', (_event, intreval: number) => {
    return updateIntreval(intreval)
  })
  ipcMain.handle('update-monitor-status', (_event, status: boolean) => {
    return updateMonitorStatus(status)
  })
  ipcMain.handle('update-price', (_event, price: number) => {
    return updatePrice(price)
  })
  // 初始化配置
  ipcMain.handle('get-config', () => {
    return getConfig()
  })
}

type Callback<T> = (data: T) => void

class Observer<T> {
  private subscribers: Map<string, Callback<T>[]>

  constructor() {
    this.subscribers = new Map()
  }

  subscribe(event: string, callback: Callback<T>): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }
    this.subscribers.get(event)!.push(callback)
  }

  unsubscribe(event: string, callback: Callback<T>): void {
    if (this.subscribers.has(event)) {
      const callbacks = this.subscribers.get(event)!
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  notify(event: string, data: T): void {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event)!.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error('Observer callback error:', error)
        }
      })
    }
  }
}

const observer = new Observer<ResultType<unknown>>()
export { observer, registerMonitorIpc }
