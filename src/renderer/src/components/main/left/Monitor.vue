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
import { computed, onMounted } from 'vue'
import { MonitorPause, MonitorPlay } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { storeToRefs } from 'pinia'

const store = useMonitorStore()
const monitoringActive = computed(() => store.monitoringActive)

const { updateInterval, updateMonitorStatus, updatePrice, getMonitorConfig } = useMonitorStore()

const { news, expectedPrice, queryInterval } = storeToRefs(useMonitorStore())

// 更新监控频率
const handleIntervalInput = (queryInterval: number): void => {
  updateInterval(queryInterval)
    ?.then((result) => {
      result.code === 0
        ? toast.success('信息提示', {
            description: `修改间隔 ${result.data}ms 成功！`
          })
        : toast.warning('信息提示', {
            description: `修改间隔 ${result.data}ms 失败！`
          })
    })
    .catch(() => {
      toast.error('信息提示', {
        description: `操作失败！`
      })
    })
}

// 更新出价
const handlePriceInput = (price: number): void => {
  updatePrice(price)
    ?.then((result) => {
      result.code === 0
        ? toast.success('信息提示', {
            description: `修改价格 €${result.data} 成功！`
          })
        : toast.warning('信息提示', {
            description: `修改价格 €${result.data} 失败！`
          })
    })
    .catch(() => {
      toast.error('信息提示', {
        description: `操作失败！`
      })
    })
}

const debounceHandleIntervalInput = debounce(handleIntervalInput, 1000, {
  leading: true // 立即执行
})
const debounceHandlePriceInput = debounce(handlePriceInput, 1000, {
  leading: true // 立即执行
})

// 更新监控状态
const handleMonitorClick = (): void => {
  updateMonitorStatus()
    .then((result) => {
      result.code === 0
        ? toast.success('信息提示', {
            description: `监控成功${monitoringActive.value ? '开启' : '关闭'},当前任务数为: ${result.data}`
          })
        : toast.warning('信息提示', {
            description: `操作监控失败！`
          })
    })
    .catch(() => {
      toast.error('信息提示', {
        description: `操作失败！`
      })
    })
}

onMounted(() => {
  getMonitorConfig()
})
</script>

<template>
  <div class="max-w-4xl mx-auto mt-1 p-2">
    <!-- 标题 -->
    <h1 class="text-2xl font-bold text-gray-800 mb-2 pl-2">监控面板</h1>
    <div class="flex space-x-6">
      <!-- 左侧：间隔和按钮垂直排列，占30% -->
      <div class="w-3/10 space-y-5">
        <!-- 间隔/出价输入 -->
        <div>
          <label for="userInput" class="block text-sm font-bold text-gray-700 mb-1"
            >间隔/出价</label
          >
          <NumberField
            id="interval"
            v-model="queryInterval"
            :min="0"
            :format-options="{
              style: 'unit',
              unit: 'millisecond',
              unitDisplay: 'short'
            }"
            @update:model-value="debounceHandleIntervalInput"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
        <div>
          <NumberField
            id="price"
            v-model="expectedPrice"
            :min="0"
            :step="0.01"
            :format-options="{
              style: 'currency',
              currency: 'EUR',
              currencyDisplay: 'symbol',
              currencySign: 'accounting'
            }"
            @update:model-value="debounceHandlePriceInput"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <!-- 监控按钮 -->
        <div>
          <Button
            :variant="monitoringActive ? 'destructive' : 'default'"
            size="sm"
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
        <ScrollArea class="h-50 w-full rounded-md border font-mono">
          <div class="p-4">
            <h4 class="mb-4 text-sm font-medium leading-none">当前订阅信息</h4>

            <div v-for="(_new, index) in news" :key="index">
              <div class="text-sm">
                {{ _new }}
              </div>
              <Separator class="my-2" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>
