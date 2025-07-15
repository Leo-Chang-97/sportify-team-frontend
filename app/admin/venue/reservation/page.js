// app/admin/venue/reservation/page.js
'use client'

// ===== 依賴項匯入 =====
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DataTable } from '@/components/admin/data-table'
import { reservationColumns } from './columns'
import useSWR from 'swr'
import {
  fetchReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  deleteMultipleReservations,
} from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
import { useAuth } from '@/contexts/auth-context'

export default function ReservationPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // ===== 組件狀態管理 =====
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [reservationsToDelete, setReservationsToDelete] = useState([])
  const [formData, setFormData] = useState({
    userId: '',
    courtId: '',
    date: '',
    timeSlotId: '',
    status: '',
  })

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

  // ===== 副作用處理 =====
  // 若有需要載入其他選項資料，請於此 useEffect 補充

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
    setIsEditMode(false)
    setEditingReservation(null)
    setFormData({
      userId: '',
      courtId: '',
      date: '',
      timeSlotId: '',
      status: '',
    })
    setErrors({})
    setIsSheetOpen(true)
  }

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)
    try {
      let result
      if (isEditMode && editingReservation) {
        result = await updateReservation(editingReservation.id, formData)
      } else {
        result = await createReservation(formData)
      }
      if (result.success) {
        toast.success(isEditMode ? '編輯預約成功！' : '新增預約成功！')
        setIsSheetOpen(false)
        setFormData({
          userId: '',
          courtId: '',
          date: '',
          timeSlotId: '',
          status: '',
        })
        setIsEditMode(false)
        setEditingReservation(null)
        mutate()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data
      ) {
        const result = error.response.data
        const errs = {}
        const shown = {}
        result.issues?.forEach((issue) => {
          const field = issue.path[0]
          if (shown[field]) return
          errs[field] = issue.message
          shown[field] = true
        })
        setErrors(errs)
        if (Object.keys(errs).length === 0) {
          toast.error(result.message || '輸入資料有誤')
        }
        return
      }
      toast.error(
        (isEditMode ? '編輯預約失敗：' : '新增預約失敗：') +
          (error.message || '未知錯誤')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsSheetOpen(false)
    setFormData({
      userId: '',
      courtId: '',
      date: '',
      timeSlotId: '',
      status: '',
    })
    setErrors({})
    setIsEditMode(false)
    setEditingReservation(null)
  }

  const handleEdit = (reservation) => {
    setIsEditMode(true)
    setEditingReservation(reservation)
    setFormData({
      userId: reservation.userId?.toString() || '',
      courtId: reservation.courtId?.toString() || '',
      date: reservation.date || '',
      timeSlotId: reservation.timeSlotId?.toString() || '',
      status: reservation.status || '',
    })
    setIsSheetOpen(true)
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
        <SiteHeader title="Reservation" />
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

      {/* ===== 新增/編輯預約表單 ===== */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-xl text-primary">
              {isEditMode ? '編輯預約' : '新增預約'}
            </SheetTitle>
            <SheetDescription className="text-gray-500">
              請填寫以下資訊
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-1 px-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">
                  使用者ID
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userId"
                  type="text"
                  value={formData.userId}
                  onChange={(e) => handleInputChange('userId', e.target.value)}
                  placeholder="請輸入使用者ID"
                  className={errors.userId ? 'border-red-500' : ''}
                />
                {errors.userId && (
                  <p className="text-sm text-red-500 mt-1">{errors.userId}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="courtId">
                  球場ID
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="courtId"
                  type="text"
                  value={formData.courtId}
                  onChange={(e) => handleInputChange('courtId', e.target.value)}
                  placeholder="請輸入球場ID"
                  className={errors.courtId ? 'border-red-500' : ''}
                />
                {errors.courtId && (
                  <p className="text-sm text-red-500 mt-1">{errors.courtId}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">
                  日期
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeSlotId">
                  時段ID
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="timeSlotId"
                  type="text"
                  value={formData.timeSlotId}
                  onChange={(e) =>
                    handleInputChange('timeSlotId', e.target.value)
                  }
                  placeholder="請輸入時段ID"
                  className={errors.timeSlotId ? 'border-red-500' : ''}
                />
                {errors.timeSlotId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.timeSlotId}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">
                  狀態
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="status"
                  type="text"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  placeholder="請輸入狀態"
                  className={errors.status ? 'border-red-500' : ''}
                />
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                取消
              </Button>
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading
                  ? isEditMode
                    ? '編輯中...'
                    : '新增中...'
                  : isEditMode
                    ? '編輯預約'
                    : '新增預約'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

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
