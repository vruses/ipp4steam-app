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
            添加配置
          </Button>
        </template>
      </ProxyDrawer>
    </div>

    <!-- 标签输入 -->
    <div class="mb-2">
      <label class="block text-sm font-medium text-gray-700 mb-2">配置名称列表</label>
      <TagsInput
        v-model="proxyList"
        class="bg-background border border-border rounded-md px-4 py-3 flex flex-wrap gap-2 cursor-not-allowed opacity-75"
      >
        <TagsInputItem
          v-for="item in proxyList"
          :key="item.proxyConfigName"
          :value="item.proxyConfigName"
          class="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-3 text-sm text-foreground backdrop-blur-sm shadow hover:shadow-md transition-all duration-200"
        >
          <!-- 标签文本 -->
          <TagsInputItemText class="mr-1 font-medium" />

          <!-- 删除按钮 -->
          <TagsInputItemDelete
            class="text-muted-foreground hover:text-red-500 hover:scale-110 transition duration-150 cursor-pointer"
            @click="onDelItem(item.proxyConfigName)"
          >
            ✕
          </TagsInputItemDelete>
        </TagsInputItem>

        <TagsInputInput disabled readonly placeholder="配置名..." />
      </TagsInput>
    </div>

    <!-- 描述 -->
    <p class="text-sm text-gray-500 mt-2">请使用「添加配置」按钮管理列表</p>
  </div>
</template>
