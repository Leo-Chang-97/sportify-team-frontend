// time-slot/columns.js
import { Button } from '@/components/ui/button'
import { IconTrash, IconEdit } from '@tabler/icons-react'
import { Checkbox } from '@/components/ui/checkbox'

export const timeSlotColumns = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="pl-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="pl-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: 'id', header: '編號', sortable: true },
  {
    accessorKey: 'startTime',
    header: '開始時間',
    cell: ({ row, table }) => {
      const value = row.original.startTime
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    accessorKey: 'endTime',
    header: '結束時間',
    cell: ({ row, table }) => {
      const value = row.original.endTime
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    accessorKey: 'timePeriod',
    header: '時間區段',
    cell: ({ row, table }) => {
      const value = row.original.timePeriod ?? '—'
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row, table }) => (
      <div className="flex items-timeSlot gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.options.meta?.onEdit?.(row.original)}
          className="h-8 text-blue-500 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
        >
          <IconEdit />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.options.meta?.onDelete?.(row.original)}
          className="h-8 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
        >
          <IconTrash />
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
