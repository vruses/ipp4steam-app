<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot name="trigger"></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-2xl"> 登录 </DialogTitle>
        <DialogDescription> 输入用户名登录steam账户 </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">用户名</Label>
          <Input id="email" type="email" placeholder="" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">密码</Label>
            <a href="#" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" class="w-full"> 登录 </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        <a href="#" class="underline"> 改为输入代码 </a>
      </div>
    </DialogContent>
  </Dialog>
</template>
