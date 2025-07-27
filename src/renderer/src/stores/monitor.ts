import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMonitorStore = defineStore('monitor', () => {
  const queryInterval = ref(1000)
  const monitoringActive = ref(false)
  const updateInterval = (interval: number): void => {
    queryInterval.value = interval
  }
  const updateMonitorStatus = (): void => {
    monitoringActive.value = !monitoringActive.value
    console.log(monitoringActive)
  }
  const ReceiveNews = (): void => {}
  return { queryInterval, monitoringActive, updateInterval, updateMonitorStatus }
})
