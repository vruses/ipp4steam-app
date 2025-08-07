import { ResultType } from '@renderer/types/api'
import { throttle } from 'lodash-es'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useMonitorStore = defineStore('monitor', () => {
  const queryInterval = ref(1000)
  const monitoringActive = ref(false)
  const expectedPrice = ref(1800)
  const news = reactive<string[]>([])
  const logs = reactive<string[]>([])

  // 更新监控间隔
  const updateInterval = (interval: number): Promise<ResultType<number>> => {
    return window.monitorApi.updateInterval(interval).then((result) => {
      if (result.code === 0) {
        queryInterval.value = interval
      }
      return result
    })
  }

  // 设置新的出价
  const updatePrice = (price: number): Promise<ResultType<number>> => {
    return window.monitorApi.updatePrice(price).then((result) => {
      if (result.code === 0) {
        expectedPrice.value = price
      }
      return result
    })
  }

  // 监控开启与关闭
  const updateMonitorStatus = (): Promise<ResultType<number>> => {
    return window.monitorApi.updateMonitorStatus(!monitoringActive.value).then((result) => {
      if (result.code === 0) {
        monitoringActive.value = !monitoringActive.value
      }
      return result
    })
  }

  type Config = {
    queryInterval: number
    expectedPrice: number
  }
  // 从配置文件里读取间隔，出价
  const getMonitorConfig = (): Promise<ResultType<Config>> => {
    return window.monitorApi.getMonitorConfig().then((result) => {
      if (result.code === 0) {
        queryInterval.value = result.data.queryInterval
        expectedPrice.value = result.data.expectedPrice
      }
      return result
    })
  }

  const throttleReceive = throttle((value) => news.push(JSON.stringify(value)), 3000, {
    leading: true
  })
  // 实时更新最新消息
  window.monitorApi.ReceiveNews((value) => {
    throttleReceive(value)
    if (news.length > 5) {
      news.shift() // 删除最早的一项
    }
  })
  // 实时日志
  window.monitorApi.heartbeatLogs((value) => {
    logs.push(JSON.stringify(value))
    if (logs.length > 50) {
      logs.shift() // 删除最早的一项
    }
  })
  return {
    monitoringActive,
    news,
    logs,
    queryInterval,
    expectedPrice,
    updateInterval,
    updateMonitorStatus,
    getMonitorConfig,
    updatePrice
  }
})
