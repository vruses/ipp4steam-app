<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@renderer/components/ui/number-field'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Separator } from '@renderer/components/ui/separator'
import { useMonitorStore } from '@renderer/stores/monitor'
import { debounce } from 'lodash-es'
import { computed } from 'vue'
import { MonitorPause, MonitorPlay } from 'lucide-vue-next'

const store = useMonitorStore()
const monitoringActive = computed(() => store.monitoringActive)
const updateInterval = store.updateInterval
const updateMonitorStatus = store.updateMonitorStatus
const debounceUpdateInterval = debounce(updateInterval, 1000)
// 更新监控频率
const handleInput = (queryInterval: number): void => {
  debounceUpdateInterval(queryInterval)
}
// 更新监控状态
const handleMonitorClick = (): void => {
  updateMonitorStatus()
}
const tags = Array.from({ length: 3 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)
</script>

<template>
  <div class="max-w-4xl mx-auto mt-1 p-2">
    <!-- 标题 -->
    <h1 class="text-2xl font-bold text-gray-800 mb-2 pl-2">监控面板</h1>
    <div class="flex space-x-6">
      <!-- 左侧：间隔和按钮垂直排列，占30% -->
      <div class="w-3/10 space-y-5">
        <!-- 间隔输入 -->
        <div>
          <label for="userInput" class="block text-sm font-bold text-gray-700 mb-1">间隔/ms</label>
          <NumberField id="age" :default-value="18" :min="0" @update:model-value="handleInput">
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <!-- 监控按钮 -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">监控</label>
          <Button
            :variant="monitoringActive ? 'destructive' : 'default'"
            class="w-full"
            @click="handleMonitorClick"
          >
            <MonitorPause v-if="monitoringActive" class="w-4 h-4" />
            <MonitorPlay v-else class="w-4 h-4" />
            {{ monitoringActive ? '停止监控' : '开始监控' }}</Button
          >
        </div>
      </div>

      <!-- 右侧：ScrollArea，占70% -->
      <div class="w-7/10">
        <ScrollArea class="h-50 w-full rounded-md border">
          <div class="p-4">
            <h4 class="mb-4 text-sm font-medium leading-none">当前订阅信息</h4>

            <div v-for="tag in tags" :key="tag">
              <div class="text-sm">
                {{ tag }}
              </div>
              <Separator class="my-2" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>
