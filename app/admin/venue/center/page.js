// app/admin/venue/center/page.js
'use client'

// ===== 依賴項匯入 =====
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DataTable } from '@/components/admin/data-table'
import { centerColumns } from './columns'
import useSWR from 'swr'
import {
  fetchCenters,
  createCenter,
  updateCenter,
  deleteCenter,
  deleteMultipleCenters,
  fetchLocation,
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

export default function CenterPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // ===== 組件狀態管理 =====
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState([])
  const [errors, setErrors] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCenter, setEditingCenter] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [centerToDelete, setCenterToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [centersToDelete, setCentersToDelete] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    locationId: '',
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
  } = useSWR(['centers', queryParams], async ([, params]) =>
    fetchCenters(params)
  )

  // ===== 副作用處理 =====
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchLocation()
        setLocations(data.rows || [])
      } catch (error) {
        console.error('載入地點失敗:', error)
        toast.error('載入地點失敗')
      }
    }
    loadLocations()
  }, [])

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

    // 清除之前的錯誤訊息
    setErrors({})

    setIsLoading(true)

    try {
      let result

      if (isEditMode && editingCenter) {
        // 編輯模式
        result = await updateCenter(editingCenter.id, formData)
      } else {
        // 新增模式
        result = await createCenter(formData)
      }

      console.log('API 回應:', result) // Debug 用

      if (result.success) {
        toast.success(isEditMode ? '編輯中心成功！' : '新增中心成功！')
        setIsSheetOpen(false)
        setFormData({ name: '', locationId: '' })
        setIsEditMode(false)
        setEditingCenter(null)
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
                ? '編輯中心失敗，請稍後再試'
                : '新增中心失敗，請稍後再試')
          )
        }
      }
    } catch (error) {
      console.error(isEditMode ? '編輯中心失敗:' : '新增中心失敗:', error)
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
          (isEditMode ? '編輯中心失敗：' : '新增中心失敗：') +
            (error.message || '未知錯誤')
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsSheetOpen(false)
    setFormData({ name: '', locationId: '' })
    setErrors({}) // 清除錯誤訊息
    setIsEditMode(false)
    setEditingCenter(null)
  }

  const handleEdit = (center) => {
    console.log('編輯中心 - 完整資料:', center)
    setIsEditMode(true)
    setEditingCenter(center)
    setFormData({
      name: center.name,
      locationId:
        center.location?.id?.toString() || center.locationId?.toString() || '',
    })
    setIsSheetOpen(true)
  }

  const handleDelete = (center) => {
    console.log('準備刪除中心 - 完整資料:', center)
    setCenterToDelete(center)
    setIsDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedData) => {
    setCentersToDelete(selectedData)
    setIsBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    setIsDeleting(true)
    try {
      const checkedItems = centersToDelete.map((item) => item.id)
      const result = await deleteMultipleCenters(checkedItems)

      if (result.success) {
        toast.success(`成功刪除 ${centersToDelete.length} 個中心！`)
        mutate() // 重新載入資料
        setIsBulkDeleteDialogOpen(false)
        setCentersToDelete([])
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
    setCentersToDelete([])
  }

  const confirmDelete = async () => {
    if (!centerToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteCenter(centerToDelete.id)

      if (result.success) {
        toast.success('刪除成功！')
        mutate() // 重新載入資料
        setIsDeleteDialogOpen(false)
        setCenterToDelete(null)
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
    setCenterToDelete(null)
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
        <SiteHeader title="Center" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable
                data={data?.rows ?? []}
                columns={centerColumns}
                totalRows={data?.totalRows}
                totalPages={data?.totalPages}
                onPaginationChange={handlePaginationChange}
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

      {/* ===== 新增/編輯中心表單 ===== */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-xl text-primary">
              {isEditMode ? '編輯運動中心' : '新增運動中心'}
            </SheetTitle>
            <SheetDescription className="text-gray-500">
              請填寫以下資訊
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-1 px-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  中心名稱
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="請輸入中心名稱"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationId">
                  地點
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) =>
                    handleInputChange('locationId', value)
                  }
                >
                  <SelectTrigger
                    className={errors.locationId ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="請選擇地點" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.id.toString()}
                      >
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.locationId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.locationId}
                  </p>
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
                    ? '編輯中心'
                    : '新增中心'}
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
              <IconTrash className="h-6 w-6 text-red-600 translate-y-0.5" />
              確認刪除
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-gray-600">
              您確定要刪除
              <strong className="text-red-600">"{centerToDelete?.name}"</strong>
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
              className="bg-red-600 hover:bg-red-700 text-base"
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
              <IconTrash className="h-6 w-6 text-red-600 translate-y-0.5" />
              確認批量刪除
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-gray-600">
              您確定要刪除以下
              <strong className="text-red-600">
                {centersToDelete.length} 項資料
              </strong>
              嗎？
            </AlertDialogDescription>
            <div className="mt-3 max-h-32 overflow-y-auto">
              {centersToDelete.map((center, index) => (
                <div key={center.id} className="text-sm text-gray-700 py-1">
                  {index + 1}. {center.name}
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
              className="bg-red-600 hover:bg-red-700 text-base"
            >
              {isDeleting ? '刪除中...' : '確定刪除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}
