<script setup lang="ts">
import DataTable from '@renderer/components/users/DataTable.vue'
import Monitor from './left/Monitor.vue'
import Proxy from './left/Proxy.vue'
import Logger from './right/Logger.vue'
</script>

<template>
  <div class="flex h-screen p-4 gap-4">
    <!-- 左边区域，占一半，3行视频框 -->
    <div class="flex w-1/2 flex-col gap-4 h-full">
      <div class="flex-1 rounded-xl bg-muted/50"><Proxy></Proxy></div>
      <div class="flex-2 rounded-xl bg-muted/50"><DataTable></DataTable></div>
      <div class="flex-2 rounded-xl bg-muted/50"><Monitor></Monitor></div>
    </div>

    <!-- 右边区域，占一半，用于日志输出 -->
    <div class="w-1/2 h-full rounded-xl bg-muted/50 p-4 overflow-auto">
      <!-- 这里可以填日志内容 -->
      <div class="h-full whitespace-pre-wrap font-mono text-sm">
        <Logger></Logger>
      </div>
    </div>
  </div>
</template>
