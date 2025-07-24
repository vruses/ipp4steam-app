<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@renderer/components/ui/tags-input'
import ProxyDrawer from './ProxyDrawer.vue'
import { useForm } from 'vee-validate'

const formSchema = toTypedSchema(
  z.object({
    proxyname: z.array(z.string()).min(1).max(3)
  })
)
useForm({
  validationSchema: formSchema,
  initialValues: {
    proxyname: ['Apple', 'Banana']
  }
})
// 处理从 ProxyDrawer 添加新的代理配置
const handleAddProxy = (newProxy: string): void => {
  // 这里您可以添加逻辑来更新 proxyname 数组
  console.log('Adding new proxy:', newProxy)
}
</script>

<template>
  <div class="max-w-4xl mx-auto mt-1 p-2">
    <form class="w-2/3 space-y-6">
      <FormField v-slot="{ componentField }" name="proxyname">
        <FormItem>
          <FormLabel>
            <h1 class="text-2xl font-bold text-gray-800 mb-2 pl-2">代理配置</h1>
          </FormLabel>
          <FormControl>
            <TagsInput
              :model-value="componentField.modelValue"
              class="cursor-not-allowed opacity-75"
              @update:model-value="componentField['onUpdate:modelValue']"
            >
              <TagsInputItem v-for="item in componentField.modelValue" :key="item" :value="item">
                <TagsInputItemText />
                <TagsInputItemDelete />
              </TagsInputItem>

              <!-- 禁用输入框 -->
              <TagsInputInput
                placeholder="配置名..."
                disabled
                readonly
                class="cursor-not-allowed"
              />
            </TagsInput>
          </FormControl>
          <FormDescription> 配置你的代理，使用下方按钮添加新配置 </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <ProxyDrawer @add-proxy="handleAddProxy">
        <template #trigger>
          <Button variant="outline"> 添加配置</Button>
        </template>
      </ProxyDrawer>
    </form>
  </div>
</template>
