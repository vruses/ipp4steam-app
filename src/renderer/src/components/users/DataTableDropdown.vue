<script setup lang="ts">
import { MoreHorizontal, Check, Bell, Trash2 } from 'lucide-vue-next'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem
} from '@renderer/components/ui/dropdown-menu'
import { useProxyStore } from '@renderer/stores/proxy'
import { useUserStore } from '@renderer/stores/user'
import { UserInfo } from '@renderer/types/user'
import { cn } from '@renderer/lib/utils'
import { computed, watchEffect } from 'vue'
import { toast } from 'vue-sonner'

const { proxyMap } = useProxyStore()
const proxyList = computed(() => [...proxyMap])
interface Props {
  userInfo: UserInfo // 接收行数据
  onExpand?: () => void
}
//从tanstack table传来的row.original
const props = defineProps<Props>()
const userInfo = props.userInfo
let proxynameList = userInfo.proxynameList
// 从props解构初始化当前用户的代理列表

let currentList = new Set([...proxynameList])
watchEffect(() => {
  // user更新订阅更新组件显示
  currentList = new Set([...userInfo.proxynameList])
})
// 订阅变更时重新渲染用户订阅的代理列表
const onSubscribingProxy = (proxyConfigName: string): void => {
  if (currentList.has(proxyConfigName)) {
    currentList.delete(proxyConfigName)
  } else {
    currentList.add(proxyConfigName)
  }
}
const updateSubscription = useUserStore().updateSubscription
// 关闭菜单完成最终订阅更新时触发
const onClosingMenu = (): void => {
  updateSubscription(userInfo.steamID, [...currentList])
    .then((result) => {
      result.code === 0
        ? toast.success('信息提示', {
            description: `更新订阅成功！当前用户订阅数 ${result.data.count}`
          })
        : toast.warning('信息提示', {
            description: `更新用户订阅失败！`
          })
    })
    .catch(() => {
      toast.error('信息提示', {
        description: `操作失败！`
      })
    })
}
// 删除用户
const deleteUser = useUserStore().deleteUser
const handleDeleteUser = (): void => {
  // userInfo.steamID
  deleteUser(userInfo.steamID)
    .then((result) => {
      result.code === 0
        ? toast.success('信息提示', {
            description: `删除用户 ${result.data} 成功！`
          })
        : toast.warning('信息提示', {
            description: `删除用户 ${userInfo.steamID} 失败！`
          })
    })
    .catch(() => {
      toast.error('信息提示', {
        description: `操作失败！`
      })
    })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" @pointer-down-outside="onClosingMenu">
      <DropdownMenuLabel>操作</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger class="flex items-center gap-2">
          <Bell class="w-4 h-4 text-gray-500" /><span>订阅</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <!--  -->
            <DropdownMenuCheckboxItem
              v-for="proxy in proxyList"
              :key="proxy[0]"
              class="pl-0"
              @select="(event) => event.preventDefault()"
              @click="onSubscribingProxy(proxy[0])"
            >
              <!-- 用户订阅的配置是否包含此配置名 -->
              <Check
                :class="cn('ml-2 h-4 w-4', currentList.has(proxy[0]) ? 'opacity-100' : 'opacity-0')"
              ></Check
              ><span>{{ proxy[0] }}</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuItem @click="handleDeleteUser">
        <Trash2 class="text-red-500" />

        <span class="text-red-500">删除</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
