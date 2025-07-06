// components/data-table.jsx
'use client'

import React from 'react'

// ===== 依賴項匯入 =====
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SearchForm from '@/components/search-form'

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconPlus,
  IconLayoutColumns,
  IconTrash,
} from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ===== 組件參數定義 =====
export function DataTable({
  data,
  columns,
  totalRows,
  totalPages,
  onPaginationChange,
  onAddNew,
  onEdit,
  onDelete,
  onBulkDelete,
  onSearch, // 新增搜尋事件
  initialKeyword = '', // 可選，初始搜尋字
}) {
  // ===== 狀態管理 =====
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [rowSelection, setRowSelection] = React.useState({})
  const [keyword, setKeyword] = React.useState(initialKeyword)

  // ===== 事件處理函數 =====
  const handlePaginationChange = (updater) => {
    const newPagination =
      typeof updater === 'function' ? updater(pagination) : updater
    setPagination(newPagination)

    if (onPaginationChange) {
      onPaginationChange(newPagination)
    }
  }

  // 新增搜尋提交事件
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(keyword)
    }
  }

  // ===== 高亮關鍵字函式 =====
  function highlightKeyword(text) {
    if (!keyword || typeof text !== 'string') return text
    const regex = new RegExp(
      `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    )
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-red-600 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  // ===== TanStack Table 配置 =====
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      rowSelection,
    },
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    getRowId: (row, index) => row.id || index,
    meta: {
      onEdit,
      onDelete,
      highlightKeyword,
    },

    ...(totalRows !== undefined && {
      pageCount: totalPages || Math.ceil(totalRows / pagination.pageSize),
      manualPagination: true,
    }),
  })

  return (
    <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
      {/* ===== 搜尋框區域 ===== */}
      <SearchForm
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSubmit={handleSearchSubmit}
      />
      {/* ===== 按鈕區域 ===== */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().rows
              const selectedData = selectedRows.map((row) => row.original)
              onBulkDelete?.(selectedData)
              setRowSelection({})
            }}
            disabled={Object.keys(rowSelection).length === 0}
            className="h-8 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
          >
            <IconTrash />
            Delete {Object.keys(rowSelection).length}
          </Button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={onAddNew}>
            <IconPlus />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>

      {/* ===== 表格主體區域 ===== */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.getValue() === 'string'
                        ? highlightKeyword(cell.getValue())
                        : flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ===== 分頁控制區域 ===== */}
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredRowModel().rows.length} row(s) total.
        </div>

        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>

            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>

            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>

            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
