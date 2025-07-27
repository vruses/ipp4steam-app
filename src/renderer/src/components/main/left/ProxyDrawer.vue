<script setup lang="ts">
import { reactive, toRaw } from 'vue'
import { Button } from '@renderer/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@renderer/components/ui/drawer'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@renderer/components/ui/radio-group'
import { proxySchema, Proxy } from '@renderer/types/proxy'
import { cloneDeep } from 'lodash-es'

// 表单数据
const proxyForm = reactive<Proxy>({
  proxyConfigName: '',
  proxyData: {
    proxyLink: '',
    targetLink: '',
    // get用于请求价格列表，post用于创建订单
    requestType: 'get'
  }
})

// 监听 requestType 变化
const handleRequestTypeChange = (value: string): void => {
  if (value === 'get' || value === 'post') {
    proxyForm.proxyData.requestType = value
  }
}

const emit = defineEmits<{ (e: 'add-proxy', value: Proxy): void }>()

// 重置表单
const resetForm = (): void => {
  proxyForm.proxyData.proxyLink = ''
  proxyForm.proxyData.targetLink = ''
  proxyForm.proxyConfigName = ''
  proxyForm.proxyData.requestType = 'get'
}
// 提交表单
const handleSubmit = (): void => {
  // 验证表单
  if (proxySchema.safeParse(toRaw(proxyForm)).success) {
    emit('add-proxy', cloneDeep(toRaw(proxyForm)))
    resetForm()
  }
}
</script>

<template>
  <Drawer>
    <DrawerTrigger as-child>
      <slot name="trigger"> </slot>
    </DrawerTrigger>
    <DrawerContent>
      <div class="mx-auto w-full max-w-lg">
        <DrawerHeader>
          <DrawerTitle>添加你的代理</DrawerTitle>
          <DrawerDescription>Set your proxy configuration</DrawerDescription>
        </DrawerHeader>

        <div class="p-4 pb-0">
          <div class="space-y-4">
            <!-- 代理配置名 -->
            <div class="space-y-2">
              <Label for="config-name">代理配置名</Label>
              <Input
                id="config-name"
                v-model="proxyForm.proxyConfigName"
                placeholder="输入配置名称..."
              />
            </div>

            <!-- 代理链接 -->
            <div class="space-y-2">
              <Label for="proxy-link">代理链接</Label>
              <Input
                id="proxy-link"
                v-model="proxyForm.proxyData.proxyLink"
                placeholder="输入代理链接..."
                type="url"
              />
            </div>

            <!-- 目标拦截 -->
            <div class="space-y-2">
              <Label for="target-link">目标链接</Label>
              <Input
                id="target-link"
                v-model="proxyForm.proxyData.targetLink"
                placeholder="输入目标链接.."
              />
            </div>

            <!-- 请求类型选择 -->
            <div class="space-y-3">
              <Label>目标链接类型</Label>
              <RadioGroup
                :model-value="proxyForm.proxyData.requestType"
                class="flex flex-row space-x-6"
                @update:model-value="handleRequestTypeChange"
              >
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="get" value="get" />
                  <Label for="get">监听价格列表</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="post" value="post" />
                  <Label for="post">创建订单</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose as-child>
            <Button @click="handleSubmit">提交</Button>
          </DrawerClose>
          <DrawerClose as-child>
            <Button variant="outline" @click="resetForm">取消</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
