import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWindowStore = defineStore('window', () => {
  const isMax = ref(false)

  window.windowApi.onUpdateWindowStatus((value) => {
    isMax.value = value
  })
  return { isMax }
})
