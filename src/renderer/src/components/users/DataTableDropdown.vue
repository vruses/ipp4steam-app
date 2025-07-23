<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>操作</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>修改</DropdownMenuItem>
      <DropdownMenuItem>删除</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
