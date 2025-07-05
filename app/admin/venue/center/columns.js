// center/columns.js
import { Button } from '@/components/ui/button'
import { IconTrash, IconEdit } from '@tabler/icons-react'

export const centerColumns = [
  { accessorKey: 'id', header: '編號' },
  { accessorKey: 'name', header: '場館名稱' },
  {
    accessorKey: 'location',
    header: '地區',
    cell: ({ row }) => row.original.location?.name ?? '—',
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row, table }) => (
      <div className="flex items-center gap-2">
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
