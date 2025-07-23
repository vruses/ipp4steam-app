import type { ColumnDef } from '@tanstack/vue-table'
import { h, shallowRef } from 'vue'
import DropdownAction from './DataTableDropdown.vue'
import { ArrowUpDown } from 'lucide-vue-next'
import { Button } from '@renderer/components/ui/button'
export interface UserInfo {
  nickname: string
  ordername: number
  status: 'pending' | 'success' | 'failed'
  password: string
}

export const data = shallowRef<UserInfo[]>([
  {
    nickname: 'm5gr84i9',
    ordername: 316,
    status: 'success',
    password: 'ken99@yahoo.com'
  },
  {
    nickname: '5kma53ae',
    ordername: 874,
    status: 'success',
    password: 'Silas22@gmail.com'
  },
  {
    nickname: 'bhqecj4p',
    ordername: 721,
    status: 'failed',
    password: 'carmella@hotmail.com'
  }
])

export const columns: ColumnDef<UserInfo>[] = [
  {
    accessorKey: 'nickname',
    header: '昵称',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('nickname'))
  },
  {
    accessorKey: 'ordername',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        },
        () => ['物品', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      )
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('ordername'))
  },
  {
    accessorKey: 'status',
    header: () => h('div', { class: 'text-right' }, '状态'),
    cell: ({ row }) => {
      return h('div', { class: 'text-right font-medium' }, row.getValue('status'))
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return h(
        'div',
        { class: 'relative' },
        h(DropdownAction, {
          payment,
          onExpand: row.toggleExpanded
        })
      )
    }
  }
]
