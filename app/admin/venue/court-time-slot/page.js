// app/admin/venue/center/page.js
'use client'

// ===== 依賴項匯入 =====
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DataTable } from '@/components/admin/data-table'
import { courtTimeSlotColumns } from './columns'
import useSWR from 'swr'

import {
  fetchCourtTimeSlots,
  fetchCourtTimeSlot,
  createCourtTimeSlot,
  updateCourtTimeSlot,
  deleteCourtTimeSlot,
  deleteMultipleCourtTimeSlots,
  fetchCourtOptions,
  fetchTimeSlotOptions,
} from '@/lib/api'
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

export default function CourtTimeSlotPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // ===== 組件狀態管理 =====
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [courts, setCourts] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [errors, setErrors] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [itemsToDelete, setItemsToDelete] = useState([])
  const [formData, setFormData] = useState({
    courtId: '',
    timeSlotId: '',
    price: '',
  })

  // ===== URL 參數處理 =====
  const queryParams = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries())
    return entries
  }, [searchParams])

  // ===== 數據獲取 =====
  const { getAuthHeader } = useAuth()
  const {
    data,
    isLoading: isDataLoading,
    error,
    mutate,
  } = useSWR(['courtTimeSlots', queryParams], async ([, params]) =>
    fetchCourtTimeSlots(params, { headers: { ...getAuthHeader() } })
  )

  // ===== 副作用處理 =====
  useEffect(() => {
    const loadCourtsAndTimeSlots = async () => {
      try {
        const courtData = await fetchCourtOptions({
          headers: { ...getAuthHeader() },
        })
        setCourts(courtData.rows || [])
        const timeSlotData = await fetchTimeSlotOptions({
          headers: { ...getAuthHeader() },
        })
        setTimeSlots(timeSlotData.rows || [])
      } catch (error) {
        console.error('載入球場/時段失敗:', error)
        toast.error('載入球場/時段失敗')
      }
    }
    loadCourtsAndTimeSlots()
  }, [getAuthHeader])

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

    // Debug: 送出前 log formData
    console.log('送出前 formData:', formData)

    // 清除之前的錯誤訊息
    setErrors({})

    setIsLoading(true)

    // 將 price 轉為數字，若為空字串則設 undefined
    const submitData = {
      ...formData,
      price: formData.price === '' ? undefined : Number(formData.price),
    }

    try {
      let result

      if (isEditMode && editingItem) {
        // 編輯模式
        result = await updateCourtTimeSlot(editingItem.id, submitData, {
          headers: { ...getAuthHeader() },
        })
      } else {
        // 新增模式
        result = await createCourtTimeSlot(submitData, {
          headers: { ...getAuthHeader() },
        })
      }

      console.log('API 回應:', result) // Debug 用

      if (result.success) {
        toast.success(isEditMode ? '編輯時段成功！' : '新增時段成功！')
        setIsSheetOpen(false)
        setFormData({ courtId: '', timeSlotId: '', price: '' })
        setIsEditMode(false)
        setEditingItem(null)
        mutate()
      } else {
        // 處理 zod 驗證錯誤
        const errs = {}
        const shown = {}

        result.issues?.forEach((issue) => {
          const field = issue.path[0]
          if (shown[field]) return // 避免重複顯示同欄位錯誤
          errs[field] = issue.message
          shown[field] = true
        })

        setErrors(errs)

        // 如果沒有特定欄位錯誤，則顯示一般錯誤訊息
        if (Object.keys(errs).length === 0) {
          toast.error(
            result.message ||
              (isEditMode
                ? '編輯場地失敗，請稍後再試'
                : '新增場地失敗，請稍後再試')
          )
        }
      }
    } catch (error) {
      console.error(isEditMode ? '編輯場地失敗:' : '新增場地失敗:', error)
      // 根據不同的錯誤類型顯示不同的訊息
      if (
        error.message.includes('network') ||
        error.message.includes('fetch')
      ) {
        toast.error('網路連線錯誤，請檢查網路狀態')
      } else if (error.message.includes('400')) {
        toast.error('輸入資料有誤，請檢查後重試')
      } else if (error.message.includes('500')) {
        toast.error('伺服器錯誤，請稍後再試')
      } else {
        toast.error(
          (isEditMode ? '編輯時段失敗：' : '新增時段失敗：') +
            (error.message || '未知錯誤')
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsSheetOpen(false)
    setFormData({ courtId: '', timeSlotId: '', price: '' })
    setErrors({}) // 清除錯誤訊息
    setIsEditMode(false)
    setEditingItem(null)
  }

  const handleEdit = (item) => {
    setIsEditMode(true)
    setEditingItem(item)
    setFormData({
      courtId: item.court?.id?.toString() || item.courtId?.toString() || '',
      timeSlotId:
        item.timeSlot?.id?.toString() || item.timeSlotId?.toString() || '',
      price: item.price?.toString() || '',
    })
    setIsSheetOpen(true)
  }

  const handleDelete = (item) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedData) => {
    setItemsToDelete(selectedData)
    setIsBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    setIsDeleting(true)
    try {
      const checkedItems = itemsToDelete.map((item) => item.id)
      const result = await deleteMultipleCourtTimeSlots(checkedItems, {
        headers: { ...getAuthHeader() },
      })

      if (result.success) {
        toast.success(`成功刪除 ${itemsToDelete.length} 筆時段！`)
        mutate() // 重新載入資料
        setIsBulkDeleteDialogOpen(false)
        setItemsToDelete([])
      } else {
        toast.error(result.message || '批量刪除失敗')
      }
    } catch (error) {
      console.error('批量刪除失敗:', error)
      toast.error('批量刪除失敗：' + (error.message || '未知錯誤'))
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
    setItemsToDelete([])
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteCourtTimeSlot(itemToDelete.id, {
        headers: { ...getAuthHeader() },
      })

      if (result.success) {
        toast.success('刪除成功！')
        mutate() // 重新載入資料
        setIsDeleteDialogOpen(false)
        setItemToDelete(null)
      } else {
        toast.error(result.message || '刪除失敗')
      }
    } catch (error) {
      console.error('刪除失敗:', error)
      toast.error('刪除失敗：' + (error.message || '未知錯誤'))
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setItemToDelete(null)
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
        <SiteHeader title="Court Time Slot" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable
                data={data?.rows ?? []}
                columns={courtTimeSlotColumns}
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

      {/* ===== 新增/編輯時段表單 ===== */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-xl text-primary">
              {isEditMode ? '編輯時段' : '新增時段'}
            </SheetTitle>
            <SheetDescription className="text-gray-500">
              請填寫以下資訊
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-1 px-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courtId">
                  球場
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.courtId}
                  onValueChange={(value) => handleInputChange('courtId', value)}
                >
                  <SelectTrigger
                    className={errors.courtId ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="請選擇球場" />
                  </SelectTrigger>
                  <SelectContent>
                    {courts.map((court) => (
                      <SelectItem key={court.id} value={court.id.toString()}>
                        {court.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.courtId && (
                  <p className="text-sm text-red-500 mt-1">{errors.courtId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlotId">
                  時段
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.timeSlotId}
                  onValueChange={(value) =>
                    handleInputChange('timeSlotId', value)
                  }
                >
                  <SelectTrigger
                    className={errors.timeSlotId ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="請選擇時段" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id.toString()}>
                        {slot.startTime}~{slot.endTime}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timeSlotId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.timeSlotId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlotId">
                  價格
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price === undefined ? '' : formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="請輸入價格"
                  className={errors.price ? 'border-red-500' : ''}
                  min="0"
                  step="1"
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
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
                    ? '編輯時段'
                    : '新增時段'}
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
                {itemToDelete?.id}. {itemToDelete?.name}
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
                {itemsToDelete.length} 項資料
              </strong>
              嗎？
            </AlertDialogDescription>
            <div className="mt-3 max-h-32 overflow-y-auto">
              {itemsToDelete.map((court, index) => (
                <div key={court.id} className="text-sm text-gray-700 py-1">
                  {court.id}. {court.name}
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
