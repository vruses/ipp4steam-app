<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'

import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@renderer/components/ui/tags-input'
import ProxyDrawer from './ProxyDrawer.vue'
import type { Proxy } from '@renderer/types/proxy'
import { useProxyStore } from '@renderer/stores/proxy'
import { BadgeX, Plus } from 'lucide-vue-next'

const proxyList = useProxyStore().proxyList

// 替换已经有的对象
const pushOrReplace = (arr: Proxy[], newItem: Proxy): void => {
  const index = arr.findIndex((item) => item.proxyConfigName === newItem.proxyConfigName)
  if (index !== -1) {
    arr[index] = newItem
  } else {
    arr.push(newItem)
  }
}

// 处理从 ProxyDrawer 添加新的代理配置
const handleAddProxy = (newProxy: Proxy): void => {
  pushOrReplace(proxyList, newProxy)
}

// 删除指定name的proxy
const onDelItem = (name: string): void => {
  proxyList.map((value, index) => {
    if (value.proxyConfigName === name) {
      proxyList.splice(index, 1)
    }
  })
}
</script>

<template>
  <div class="max-w-4xl mx-auto mt-1 p-2 bg-white shadow-md rounded-lg">
    <!-- 标题 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2 pl-2">代理配置</h1>
      <ProxyDrawer @add-proxy="handleAddProxy">
        <template #trigger>
          <Button
            variant="outline"
            class="border-gray-300 text-gray-700 hover:border-gray-500 hover:text-black"
          >
            <Plus />添加配置
          </Button>
        </template>
      </ProxyDrawer>
    </div>

    <!-- 标签输入 -->
    <div class="mb-2">
      <label class="block text-sm font-medium text-gray-700 mb-2">配置名称列表</label>
      <TagsInput
        v-model="proxyList"
        class="flex flex-wrap gap-2 p-2 border border-gray-300 bg-white dark:bg-gray-800 rounded-[10px]"
      >
        <TagsInputItem
          v-for="item in proxyList"
          :key="item.proxyConfigName"
          :value="item.proxyConfigName"
          class="flex items-center px-1 py-1 bg-gray-100 rounded-[7px] text-sm"
        >
          <!-- 标签文本 -->
          <TagsInputItemText />

          <!-- 删除按钮 -->
          <TagsInputItemDelete
            class="cursor-pointer hover:text-red-500 transition duration-200"
            @click="onDelItem(item.proxyConfigName)"
          >
            <BadgeX class="w-3 h-3" />
          </TagsInputItemDelete>
        </TagsInputItem>

        <TagsInputInput
          disabled
          readonly
          placeholder="配置名..."
          class="text-gray-400 dark:text-gray-500 placeholder:text-sm bg-transparent outline-none"
        />
      </TagsInput>
    </div>

    <!-- 描述 -->
    <p class="text-sm text-gray-500 mt-2">请使用「添加配置」按钮管理列表</p>
  </div>
</template>
