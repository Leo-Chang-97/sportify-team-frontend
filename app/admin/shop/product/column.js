import { Button } from '@/components/ui/button'
import { IconTrash, IconEdit, CiHeart } from '@tabler/icons-react'
import { Checkbox } from '@/components/ui/checkbox'

export const productColumns = [
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
  { accessorKey: 'id', header: '商品編號', sortable: true },
  {
    accessorKey: 'name',
    header: '商品名稱',
    cell: ({ row, table }) => {
      const value = row.original.name
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    accessorKey: 'sport',
    header: '運動種類',
    cell: ({ row, table }) => {
      const value = row.original.sport?.name ?? '—'
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    accessorKey: 'brand',
    header: '品牌',
    cell: ({ row, table }) => {
      const value = row.original.brand?.name ?? '—'
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    accessorKey: 'style',
    header: '款式',
    cell: ({ row, table }) => {
      const value = row.original.style ?? '—'
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    accessorKey: 'price',
    header: '單價',
    cell: ({ row, table }) => {
      const value = row.original.price ?? '—'
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    accessorKey: 'stock',
    header: '庫存',
    cell: ({ row, table }) => {
      const value = row.original.stock ?? '—'
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    accessorKey: 'createdAt',
    header: '創建時間',
    cell: ({ row, table }) => {
      const value = row.original.createdAt ?? '—'
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    accessorKey: 'updatedAt',
    header: '更新時間',
    cell: ({ row, table }) => {
      const value = row.original.updatedAt ?? '—'
      const highlightKeyword = table.options.meta?.highlightKeyword
      return highlightKeyword ? highlightKeyword(value) : value
    },
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row, table }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.options.meta?.onToggleLike?.(row.original.id)}
          className="h-8 w-8"
        >
          {row.original.isLiked ? (
            <CiHeart className="h-5 w-5 text-red-500" fill="currentColor" />
          ) : (
            <CiHeart className="h-5 w-5 text-gray-400" />
          )}
        </Button>
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
