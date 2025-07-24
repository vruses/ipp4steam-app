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

const tags = Array.from({ length: 3 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)
</script>

<template>
  <div class="max-w-md mx-auto mt-1 p-6 space-y-10">
    <form class="flex space-x-4">
      <!-- 左侧：label: input -->
      <div class="w-1/2">
        <label for="userInput" class="block text-sm font-bold text-gray-700 mb-1"> 间隔/ms</label>
        <NumberField id="age" :default-value="18" :min="0">
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>

      <!-- 右侧：label: button -->
      <div class="w-1/2 flex flex-col items-center">
        <label class="block text-sm font-bold text-gray-700 mb-1">监控</label>
        <Button variant="destructive" class="flex-1 w-auto">开始监控</Button>
      </div>
    </form>
    <ScrollArea class="h-50 w-auto rounded-md border">
      <div class="p-4">
        <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>

        <div v-for="tag in tags" :key="tag">
          <div class="text-sm">
            {{ tag }}
          </div>
          <Separator class="my-2" />
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
