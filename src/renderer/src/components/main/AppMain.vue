<script setup lang="ts">
import DataTable from '@renderer/components/users/DataTable.vue'
import Monitor from './left/Monitor.vue'
</script>

<template>
  <div class="flex h-screen p-4 gap-4">
    <!-- 左边区域，占一半，3行视频框 -->
    <div class="flex w-1/2 flex-col gap-4">
      <div class="aspect-video rounded-xl bg-muted/50"></div>
      <div class="aspect-video rounded-xl bg-muted/50"><DataTable></DataTable></div>
      <div class="aspect-video rounded-xl bg-muted/50"><Monitor></Monitor></div>
    </div>

    <!-- 右边区域，占一半，用于日志输出 -->
    <div class="w-1/2 rounded-xl bg-muted/50 p-4 overflow-auto">
      <!-- 这里可以填日志内容 -->
      <div class="h-full whitespace-pre-wrap font-mono text-sm">输出日志区域...</div>
    </div>
  </div>
</template>
