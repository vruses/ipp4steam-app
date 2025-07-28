<script lang="ts" setup>
import { X, Maximize, Minus, Minimize } from 'lucide-vue-next'
import Button from '@renderer/components/ui/button/Button.vue'
import { useWindowStore } from '@renderer/stores/window'
import { storeToRefs } from 'pinia'

const { isMax } = storeToRefs(useWindowStore())
const minimizeWindow = (): void => {
  window.windowApi.requestWindowMinimize()
}
const closeWindow = (): void => {
  window.windowApi.requestWindowClose()
}
const maxmizeWindow = (): void => {
  isMax.value = !isMax.value
  window.windowApi.requestWindowMaximize()
}
</script>

<template>
  <!-- 头部 -->
  <header class="fixed top-0 left-0 right-0 z-10">
    <!-- 自定义标题栏 -->
    <div
      class="h-auto bg-white flex items-center justify-between select-none"
      style="-webkit-app-region: drag"
    >
      <!-- 左侧：应用信息 -->
      <div class="flex items-center gap-2 pl-2">
        <!-- 应用图标 -->
        <div class="w-5 h-5 text-gray-600">
          <img src="@renderer/assets/steam_icon.svg" />
        </div>
        <!-- 应用标题 -->
        <span class="text-sm font-medium text-gray-700 tracking-tight">Steam市场交易</span>
      </div>

      <!-- 右侧：窗口控制按钮 -->
      <div class="flex items-center" style="-webkit-app-region: no-drag">
        <Button variant="ghost" size="icon" @click="minimizeWindow">
          <Minus></Minus>
        </Button>
        <Button variant="ghost" size="icon" @click="maxmizeWindow">
          <Maximize v-show="!isMax"></Maximize>
          <Minimize v-show="isMax"></Minimize>
        </Button>
        <Button variant="ghost" size="icon" @click="closeWindow">
          <X />
        </Button>
      </div>
    </div>
  </header>
</template>
