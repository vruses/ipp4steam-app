import { ResultType } from '@renderer/types/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMonitorStore = defineStore('monitor', () => {
  const queryInterval = ref(1000)
  const monitoringActive = ref(false)

  const updateInterval = (interval: number): Promise<ResultType<number>> => {
    return window.monitorApi.updateInterval(interval).then((result) => {
      if (result.code === 0) {
        queryInterval.value = interval
      }
      return result
    })
  }

  const updateMonitorStatus = (): Promise<ResultType<boolean>> => {
    return window.monitorApi.updateMonitorStatus(!monitoringActive.value).then((result) => {
      if (result.code === 0) {
        monitoringActive.value = !monitoringActive.value
      }
      return result
    })
  }
  // const ReceiveNews = (): void => {}
  return { queryInterval, monitoringActive, updateInterval, updateMonitorStatus }
})
