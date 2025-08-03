// app/admin/shop/Order/page.js
'use client'

// ===== 依賴項匯入 =====
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/admin/app-sidebar'
import { SiteHeader } from '@/components/admin/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DataTable } from '@/components/admin/data-table'
import { orderColumns } from './columns'
import useSWR from 'swr'
import {
  fetchOrders,
  fetchOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  fetchDelivery,
  fetchPayment,
  fetchInvoice,
  fetchOrderStatus,
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
import { add } from 'date-fns'
import { se } from 'date-fns/locale'

export default function OrderPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // ===== 組件狀態管理 =====
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [delivery, setDelivery] = useState([])
  const [payment, setPayment] = useState([])
  const [invoiceTypes, setInvoiceTypes] = useState([])
  const [orderStatus, setOrderStatus] = useState([])
  const [formData, setFormData] = useState({
    memberId: '',
    total: '',
    fee: '',
    recipient: '',
    phone: '',
    address: '',
    delivery: '',
    payment: '',
    invoice: '',
    invoiceNumber: '',
    status: '',
    items: [],
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
  } = useSWR(['orders', queryParams], async ([, params]) => {
    return fetchOrders(params)
  })

  // ===== 副作用處理 =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const deliveryData = await fetchDelivery()
        setDelivery(deliveryData.data || [])

        const paymentData = await fetchPayment()
        setPayment(paymentData.data || [])

        // invoiceTypes: 只取 type 欄位
        const invoiceData = await fetchInvoice()
        // 若 API 回傳格式為 [{type: '統一發票'}, ...]
        setInvoiceTypes(invoiceData.data || [])

        const orderStatusData = await fetchOrderStatus()
        setOrderStatus(orderStatusData.data || [])
      } catch (error) {
        console.error('載入選項失敗:', error)
        toast.error('載入選項失敗')
      }
    }
    loadData()
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
    router.push('/admin/shop/order/add')
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

    try {
      // 準備提交的表單數據
      let result

      if (isEditMode && editingOrder) {
        // 編輯模式
        result = await updateOrder(editingOrder.id, submitData)
      } else {
        // 新增模式
        result = await createOrder(submitData)
      }

      console.log('API 回應:', result) // Debug 用

      if (result.success) {
        toast.success(isEditMode ? '編輯訂單成功！' : '新增訂單成功！')
        setIsSheetOpen(false)
        setFormData({
          memberId: '',
          total: '',
          fee: '',
          recipient: '',
          phone: '',
          address: '',
          delivery: '',
          payment: '',
          invoice: '',
          status: '',
          items: [],
        })
        setIsEditMode(false)
        seteditingOrder(null)
        mutate()
      }
    } catch (error) {
      // axios 400 驗證錯誤處理
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
      console.error(isEditMode ? '編輯訂單失敗:' : '新增訂單失敗:', error)
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
          (isEditMode ? '編輯訂單失敗：' : '新增訂單失敗：') +
            (error.message || '未知錯誤')
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsSheetOpen(false)
    setFormData({
      memberId: '',
      total: '',
      fee: '',
      recipient: '',
      phone: '',
      address: '',
      delivery: '',
      payment: '',
      invoice: '',
      status: '',
      items: [],
    })
    setErrors({})
    setIsEditMode(false)
    seteditingOrder(null)
  }

  const handleEdit = (order) => {
    // 跳轉到編輯頁面
    router.push(`/admin/shop/order/edit/${order.id}`)
  }

  const handleDelete = (order) => {
    console.log('準備刪除訂單- 完整資料:', order)
    setOrderToDelete(order)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!orderToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteOrder(orderToDelete.id)

      if (result.code === 200) {
        toast.success('刪除成功！')
        mutate() // 重新載入資料
        setIsDeleteDialogOpen(false)
        setOrderToDelete(null)
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
    setOrderToDelete(null)
  }

  // ===== 載入和錯誤狀態處理 =====
  if (isDataLoading) return <p>載入中...</p>
  if (error) return <p>載入錯誤：{error.message}</p>

  // ===== Debug 資料格式 =====
  /*console.log('完整資料:', data)
  console.log('資料結構:', JSON.stringify(data, null, 2))
  if (data?.rows && data.rows.length > 0) {
    console.log('第一筆資料:', data.rows[0])
    console.log('第一筆資料的 keys:', Object.keys(data.rows[0]))
  }*/

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
        <SiteHeader title="Order" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable
                data={data?.data ?? []}
                columns={orderColumns}
                totalRows={data?.totalRows}
                totalPages={data?.totalPages}
                onPaginationChange={handlePaginationChange}
                currentPage={parseInt(queryParams.page) || 1}
                pageSize={parseInt(queryParams.perPage) || 10}
                onAddNew={handleAddNew}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSearch={handleSearch}
                initialKeyword={queryParams.keyword || ''}
                onOrderBy={handleOrderBy}
                initialOrderBy={queryParams.orderby || ''}
                invoiceTypes={invoiceTypes}
                invoiceNumber={formData.invoiceNumber}
                setFormData={setFormData}
                isEditMode={isEditMode}
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
                {orderToDelete?.id}. {orderToDelete?.name}
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
    </SidebarProvider>
  )
}
