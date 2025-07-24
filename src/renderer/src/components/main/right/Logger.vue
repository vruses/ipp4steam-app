<script lang="ts" setup>
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Separator } from '@renderer/components/ui/separator'

const tags = Array.from({ length: 3 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)
</script>
<template>
  <ScrollArea class="h-50 w-auto rounded-md border">
    <div class="p-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-2 pl-2">输出日志</h1>

      <div v-for="tag in tags" :key="tag">
        <div class="text-sm">
          {{ tag }}
        </div>
        <Separator class="my-2" />
      </div>
    </div>
  </ScrollArea>
</template>
