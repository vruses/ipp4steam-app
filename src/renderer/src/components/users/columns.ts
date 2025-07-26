import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import DropdownAction from './DataTableDropdown.vue'
import { ArrowUpDown } from 'lucide-vue-next'
import { Button } from '@renderer/components/ui/button'
import type { UserInfo } from '@renderer/types/user'
import { Badge } from '@renderer/components/ui/badge'

export const columns: ColumnDef<UserInfo>[] = [
  {
    accessorKey: 'nickname',
    header: '昵称',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('nickname'))
  },
  {
    accessorKey: 'proxynameList',
    header: '订阅',
    cell: ({ row }) => {
      const list = (row.getValue('proxynameList') as string[]) || []
      return h(
        'div',
        { class: 'lowercase flex flex-wrap gap-2' },
        list.map((item) => h(Badge, { variant: 'outline' }, () => item))
      )
    }
  },
  {
    accessorKey: 'loginStatus',
    header: ({ column }) => {
      return h(
        'div',
        { class: 'text-right w-full' },
        h(
          Button,
          {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
          },
          () => [h(ArrowUpDown, { class: 'h-4 w-2' }), '状态']
        )
      )
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-right font-medium' }, row.getValue('loginStatus'))
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
