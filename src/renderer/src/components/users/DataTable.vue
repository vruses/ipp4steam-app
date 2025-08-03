<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'

import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent
} from '@renderer/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { columns } from './columns'
import { Loader2, Clipboard, UserCheck } from 'lucide-vue-next'
import { onMounted, reactive, shallowRef, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useUserStore } from '@renderer/stores/user'
import { UserInfo } from '@renderer/types/user'

// 组件全局变量
const store = useUserStore()
const userManager = store.userManager
const userList = userManager.userList
const data = shallowRef<UserInfo[]>([])
const getUserList = store.getUserList
watch(
  () => userManager,
  () => {
    data.value = [...userList]
  },
  { deep: true }
)

let table = useVueTable(
  reactive({
    data, // 注意这里要用 .value
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  })
)

// 一键粘贴凭证调用的登录函数
const login = useUserStore().login
const requestLogin = async (): Promise<void> => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      userManager.btnStatus = 'pending'
      const userInfo = await login(text)
      toast.success('信息提示', {
        description: `${userInfo.nickname} 登录成功！`
      })
    }
  } catch {
    toast.warning('错误提示', { description: '登录失败！' })
  } finally {
    userManager.btnStatus = 'idle'
  }
}
const hasAllCookiesExpired = useUserStore().hasAllCookiesExpired
const connectingTest = (): void => {
  hasAllCookiesExpired()
    .then((nicknameList) => {
      nicknameList.length
        ? toast.warning('信息提示', {
            description: `${nicknameList.join(',')} 登录状态已失效！`
          })
        : toast.success('信息提示', {
            description: `登录状态全有效！`
          })
    })
    .catch(() => {
      toast.warning('错误提示', { description: '检查状态出现错误！' })
    })
}
onMounted(() => {
  getUserList()
})
</script>

<template>
  <div class="w-full p-2">
    <div class="flex justify-between items-center py-4">
      <!-- 左侧标题 -->
      <h1 class="text-2xl font-bold text-gray-800 mb-2 pl-2">用户管理</h1>
      <!-- 右侧按钮组 -->
      <div class="flex gap-2 items-center">
        <Button
          class="cursor-pointer"
          variant="outline"
          :disabled="userManager.btnStatus === 'pending'"
          @click="requestLogin"
        >
          <Loader2 v-if="userManager.btnStatus === 'pending'" class="w-4 h-4 animate-spin" />
          <Clipboard v-if="userManager.btnStatus === 'idle'" />
          <span v-if="userManager.btnStatus === 'idle'">粘贴凭证</span>
          <span v-else-if="userManager.btnStatus === 'pending'">登录中</span>
        </Button>
        <Button @click="connectingTest">
          <UserCheck />
          检查登录状态
        </Button>
        <DropdownMenu>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
              :key="column.id"
              class="capitalize"
              :model-value="column.getIsVisible()"
              @update:model-value="
                (value) => {
                  column.toggleVisibility(!!value)
                }
              "
            >
              {{ column.id }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredRowModel().rows.length }} row(s).
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          下一页
        </Button>
      </div>
    </div>
  </div>
</template>
