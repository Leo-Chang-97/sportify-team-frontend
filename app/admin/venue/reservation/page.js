// app/admin/venue/reservation/page.js
'use client'

// ===== 依賴項匯入 =====
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/admin/app-sidebar'
import { SiteHeader } from '@/components/admin/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DataTable } from '@/components/admin/data-table'
import { reservationColumns } from './columns'
import useSWR from 'swr'
import {
  fetchReservations,
  deleteReservation,
  deleteMultipleReservations,
} from '@/api'
import { Button } from '@/components/ui/button'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'

export default function ReservationPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // ===== 組件狀態管理 =====
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [reservationsToDelete, setReservationsToDelete] = useState([])

  // ===== URL 參數處理 =====
  const queryParams = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries())
    return entries
  }, [searchParams])

  // ===== 數據獲取 =====
  const {
    data,
    isLoading: isDataLoading,
    error,
    mutate,
  } = useSWR(['reservations', queryParams], async ([, params]) =>
    fetchReservations(params)
  )

  // ===== 事件處理函數 =====
  const handlePaginationChange = (paginationState) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('page', String(paginationState.pageIndex + 1))
    newParams.set('perPage', String(paginationState.pageSize))
    router.push(`?${newParams.toString()}`)
  }

  const handleSearch = (keyword) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (keyword) {
      newParams.set('keyword', keyword)
      newParams.set('page', '1')
    } else {
      newParams.delete('keyword')
      newParams.set('page', '1')
    }
    router.push(`?${newParams.toString()}`)
  }

  const handleOrderBy = (orderby) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (orderby) {
      newParams.set('orderby', orderby)
    } else {
      newParams.delete('orderby')
    }
    newParams.set('page', '1') // 排序時回到第一頁
    router.push(`?${newParams.toString()}`)
  }

  const handleAddNew = () => {
    router.push('/admin/venue/reservation/add')
  }

  const handleEdit = (reservation) => {
    router.push(`/admin/venue/reservation/edit/${reservation.id}`)
  }

  const handleDelete = (reservation) => {
    setReservationToDelete(reservation)
    setIsDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedData) => {
    setReservationsToDelete(selectedData)
    setIsBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    setIsDeleting(true)
    try {
      const checkedItems = reservationsToDelete.map((item) => item.id)
      const result = await deleteMultipleReservations(checkedItems)
      if (result.success) {
        toast.success(`成功刪除 ${reservationsToDelete.length} 筆預約！`)
        mutate()
        setIsBulkDeleteDialogOpen(false)
        setReservationsToDelete([])
      } else {
        toast.error(result.message || '批量刪除失敗')
      }
    } catch (error) {
      toast.error('批量刪除失敗：' + (error.message || '未知錯誤'))
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
    setReservationsToDelete([])
  }

  const confirmDelete = async () => {
    if (!reservationToDelete) return
    setIsDeleting(true)
    try {
      const result = await deleteReservation(reservationToDelete.id)
      if (result.success) {
        toast.success('刪除成功！')
        mutate()
        setIsDeleteDialogOpen(false)
        setReservationToDelete(null)
      } else {
        toast.error(result.message || '刪除失敗')
      }
    } catch (error) {
      toast.error('刪除失敗：' + (error.message || '未知錯誤'))
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setReservationToDelete(null)
  }

  // ===== 載入和錯誤狀態處理 =====
  if (isDataLoading) return <p>載入中...</p>
  if (error) return <p>載入錯誤：{error.message}</p>

  // ===== Debug 資料格式 =====
  /* console.log('完整資料:', data)
  console.log('資料結構:', JSON.stringify(data, null, 2))
  if (data?.rows && data.rows.length > 0) {
    console.log('第一筆資料:', data.rows[0])
    console.log('第一筆資料的 keys:', Object.keys(data.rows[0]))
  } */

  // ===== 頁面渲染 =====
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="訂單管理" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable
                data={data?.rows ?? []}
                columns={reservationColumns}
                totalRows={data?.totalRows}
                totalPages={data?.totalPages}
                onPaginationChange={handlePaginationChange}
                currentPage={parseInt(queryParams.page) || 1}
                pageSize={parseInt(queryParams.perPage) || 10}
                onAddNew={handleAddNew}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBulkDelete={handleBulkDelete}
                onSearch={handleSearch}
                initialKeyword={queryParams.keyword || ''}
                onOrderBy={handleOrderBy}
                initialOrderBy={queryParams.orderby || ''}
              />
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* ===== 刪除確認對話框 ===== */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold my-2 flex items-baseline gap-2">
              <IconTrash className="h-6 w-6 text-red-500 translate-y-0.5" />
              確認刪除
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-gray-600">
              您確定要刪除
              <strong className="text-red-500">
                {reservationToDelete?.id}
              </strong>
              嗎？
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                此操作無法復原。
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel onClick={cancelDelete} className="text-base">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-700 text-base"
            >
              {isDeleting ? '刪除中...' : '確定刪除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== 批量刪除確認對話框 ===== */}
      <AlertDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold my-2 flex items-baseline gap-2">
              <IconTrash className="h-6 w-6 text-red-500 translate-y-0.5" />
              確認批量刪除
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-gray-600">
              您確定要刪除以下
              <strong className="text-red-500">
                {reservationsToDelete.length} 筆預約
              </strong>
              嗎？
            </AlertDialogDescription>
            <div className="mt-3 max-h-32 overflow-y-auto">
              {reservationsToDelete.map((reservation, index) => (
                <div
                  key={reservation.id}
                  className="text-sm text-gray-700 py-1"
                >
                  {reservation.id}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">此操作無法復原。</p>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel onClick={cancelBulkDelete} className="text-base">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-700 text-base"
            >
              {isDeleting ? '刪除中...' : '確定刪除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}
