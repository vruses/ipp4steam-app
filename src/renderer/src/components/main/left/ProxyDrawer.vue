<script setup lang="ts">
import { ref } from 'vue'
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

// 表单数据
const proxyLink = ref('')
const targetLink = ref('')
const proxyConfigName = ref('')
// get用于请求价格列表，post用于创建订单
const requestType = ref('get')
const postFormData = ref('')

// Carousel API ref
const carouselApi = ref()

// 监听 requestType 变化，如果选择 POST 则切换到第二个表单
const handleRequestTypeChange = (value: string): void => {
  requestType.value = value
}

// 提交表单
const handleSubmit = (): void => {
  const formData = {
    proxyLink: proxyLink.value,
    targetLink: targetLink.value,
    proxyConfigName: proxyConfigName.value,
    requestType: requestType.value,
    postFormData: requestType.value === 'post' ? postFormData.value : null
  }

  console.log('提交数据:', formData)
  // 这里可以 emit 事件给父组件
  // emit('add-proxy', formData)
}

// 重置表单
const resetForm = (): void => {
  proxyLink.value = ''
  targetLink.value = ''
  proxyConfigName.value = ''
  requestType.value = 'get'
  postFormData.value = ''
  if (carouselApi.value) {
    carouselApi.value.scrollTo(0)
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
              <Input id="config-name" v-model="proxyConfigName" placeholder="输入配置名称..." />
            </div>

            <!-- 代理链接 -->
            <div class="space-y-2">
              <Label for="proxy-link">代理链接</Label>
              <Input id="proxy-link" v-model="proxyLink" placeholder="输入代理链接..." type="url" />
            </div>

            <!-- 目标拦截 -->
            <div class="space-y-2">
              <Label for="target-link">目标链接</Label>
              <Input id="target-link" v-model="targetLink" placeholder="输入目标链接.." />
            </div>

            <!-- 请求类型选择 -->
            <div class="space-y-3">
              <Label>目标链接类型</Label>
              <RadioGroup
                :model-value="requestType"
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
          <Button @click="handleSubmit">提交</Button>
          <DrawerClose as-child>
            <Button variant="outline" @click="resetForm">取消</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
