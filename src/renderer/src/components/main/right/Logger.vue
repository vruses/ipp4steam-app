<script lang="ts" setup>
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Separator } from '@renderer/components/ui/separator'
import { useMonitorStore } from '@renderer/stores/monitor'
import { storeToRefs } from 'pinia'

const { logs } = storeToRefs(useMonitorStore())
</script>
<template>
  <h1 class="text-2xl font-bold text-gray-800 mb-2 pl-2">输出日志</h1>
  <ScrollArea class="h-150 w-auto rounded-md border">
    <div class="p-4">
      <div v-for="(log, index) in logs" :key="index">
        <div class="text-sm">
          {{ log }}
        </div>
        <Separator class="my-2" />
      </div>
    </div>
  </ScrollArea>
</template>
