<script setup lang="ts">
import DataTable from '@renderer/components/users/DataTable.vue'
import Monitor from './left/Monitor.vue'
import Proxy from './left/Proxy.vue'
import Logger from './right/Logger.vue'
</script>

<template>
  <!-- 内容部分，考虑 header 高度 -->
  <div class="flex-1 pt-10 overflow-hidden">
    <div class="flex h-full gap-4 px-4 pb-4">
      <!-- 左边区域 -->
      <div class="w-1/2 flex-col gap-4 h-full">
        <div class="h-1/4 rounded-xl bg-muted/50 shadow-sm mb-4">
          <Proxy />
        </div>
        <div class="h-3/4 rounded-xl bg-muted/50 shadow-sm">
          <DataTable />
        </div>
      </div>
      <!-- 右边区域 -->
      <div class="w-1/2 h-full flex flex-col gap-4">
        <div class="flex-1 rounded-xl bg-muted/50 shadow-sm">
          <Monitor />
        </div>
        <div class="flex-2 rounded-xl bg-muted/50 p-4 overflow-y-auto shadow-sm">
          <div class="h-full whitespace-pre-wrap font-mono text-sm">
            <Logger />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
