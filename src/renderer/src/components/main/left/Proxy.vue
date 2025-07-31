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
import { computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'

const proxyMap = useProxyStore().proxyMap
const fetchProxyList = useProxyStore().fetchProxyList
const addProxy = useProxyStore().addProxy
const deleteProxy = useProxyStore().deleteProxy
const proxyList = computed(() => [...proxyMap])
// 处理从 ProxyDrawer 添加新的代理配置
const handleAddProxy = (newProxy: Proxy): void => {
  addProxy(newProxy)
    .then((result) => {
      result.code === 0
        ? toast.success('信息提示', {
            description: `添加订阅 ${result.data} 成功！`
          })
        : toast.warning('信息提示', {
            description: `添加订阅 ${result.data} 失败！`
          })
    })
    .catch(() => {
      toast.error('信息提示', {
        description: `操作失败！`
      })
    })
}

// 删除指定name的proxy
const onDelItem = async (name: string): Promise<void> => {
  deleteProxy(name)
    .then((result) => {
      result.code === 0
        ? toast.success('信息提示', {
            description: `删除订阅 ${result.data} 成功！`
          })
        : toast.warning('信息提示', {
            description: `删除订阅 ${result.data} 失败！`
          })
    })
    .catch(() => {
      toast.error('信息提示', {
        description: `操作失败！`
      })
    })
}

onMounted(() => {
  fetchProxyList()
})
</script>

<template>
  <div class="max-w-4xl mx-auto mt-1 p-2 rounded-lg">
    <!-- 标题 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2 pl-2">代理配置</h1>
      <ProxyDrawer @add-proxy="handleAddProxy">
        <template #trigger>
          <Button variant="outline"> <Plus />添加配置 </Button>
        </template>
      </ProxyDrawer>
    </div>

    <!-- 标签输入 -->
    <div class="mb-2">
      <label class="block text-sm font-medium text-gray-700 mb-2">配置名称列表</label>
      <TagsInput
        v-model="proxyList"
        class="flex flex-wrap gap-2 p-2 border border-gray-300 dark:bg-gray-800 rounded-[10px]"
      >
        <TagsInputItem
          v-for="item in proxyList"
          :key="item[0]"
          :value="item[0]"
          class="flex items-center px-1 py-1 bg-gray-100 rounded-[7px] text-sm"
        >
          <!-- 标签文本 -->
          <TagsInputItemText />

          <!-- 删除按钮 -->
          <TagsInputItemDelete
            class="cursor-pointer hover:text-destructive transition duration-200"
            @click="onDelItem(item[0])"
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
