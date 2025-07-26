<script setup lang="ts">
import { MoreHorizontal, Check } from 'lucide-vue-next'
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
import { reactive } from 'vue'

const { proxyList } = useProxyStore()
interface Props {
  userInfo: UserInfo // 接收行数据
  onExpand?: () => void
}
//从tanstack table传来的row.original
const props = defineProps<Props>()
const userInfo = props.userInfo
let proxynameList = userInfo.proxynameList
// 从props解构初始化当前用户的代理列表
const currentList = reactive([...proxynameList])
// 订阅变更时重新渲染用户订阅的代理列表
const onSubscribingProxy = (proxyConfigName: string): void => {
  if (currentList.includes(proxyConfigName)) {
    currentList.splice(currentList.indexOf(proxyConfigName), 1)
  } else {
    currentList.push(proxyConfigName)
  }
}
// 完成最终订阅更新时触发
const updateSubscription = (): void => {
  const store = useUserStore()
  const userList = store.userManager.userList
  const index = userList.findIndex((value) => {
    return value.steamID === userInfo.steamID
  })
  userList[index].proxynameList = currentList
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
    <DropdownMenuContent align="end" @pointer-down-outside="updateSubscription">
      <DropdownMenuLabel>操作</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <span>订阅</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <!--  -->
            <DropdownMenuCheckboxItem
              v-for="proxy in proxyList"
              :key="proxy.proxyConfigName"
              class="pl-0"
              @select="(event) => event.preventDefault()"
              @click="onSubscribingProxy(proxy.proxyConfigName)"
            >
              <!-- 用户订阅的配置是否包含此配置名 -->
              <Check
                :class="
                  cn(
                    'ml-2 h-4 w-4',
                    currentList.includes(proxy.proxyConfigName) ? 'opacity-100' : 'opacity-0'
                  )
                "
              ></Check
              ><span>{{ proxy.proxyConfigName }}</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuItem>删除</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
