// app/admin/shop/product/page.js
'use client'

// ===== 依賴項匯入 =====
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DataTable } from '@/components/admin/data-table'
import { productColumns } from './columns'
import useSWR from 'swr'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchSportOptions,
  fetchBrandOptions,
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

export default function ProductPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // ===== 組件狀態管理 =====
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [brands, setBrands] = useState([])
  const [sports, setSports] = useState([])
  const [errors, setErrors] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sport_id: '',
    brand_id: '',
    price: '',
    stock: '',
    material: '',
    size: '',
    weight: '',
    origin: '',
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
  } = useSWR(['products', queryParams], async ([, params]) => {
    return fetchProducts(params)
  })

  // ===== 副作用處理 =====
  useEffect(() => {
    const loadSportOptions = async () => {
      try {
        const data = await fetchSportOptions()
        setSports(data.rows || [])
      } catch (error) {
        console.error('載入運動類別失敗:', error)
        toast.error('載入運動類別失敗')
      }
    }
    loadSportOptions()
  }, [])
  useEffect(() => {
    const loadBrandOptions = async () => {
      try {
        const data = await fetchBrandOptions()
        setBrands(data.rows || [])
      } catch (error) {
        console.error('載入品牌失敗:', error)
        toast.error('載入品牌失敗')
      }
    }
    loadBrandOptions()
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
    setIsEditMode(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      sport_id: '',
      brand_id: '',
      price: '',
      stock: '',
      material: '',
      size: '',
      weight: '',
      origin: '',
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

    // Debug: 送出前 log formData
    console.log('送出前 formData:', formData)

    // 清除之前的錯誤訊息
    setErrors({})

    setIsLoading(true)

    try {
      let result

      if (isEditMode && editingProduct) {
        // 編輯模式
        result = await updateProduct(editingProduct.id, formData)
      } else {
        // 新增模式
        result = await createProduct(formData)
      }

      console.log('API 回應:', result) // Debug 用

      if (result.success) {
        toast.success(isEditMode ? '編輯商品成功！' : '新增商品成功！')
        setIsSheetOpen(false)
        setFormData({
          name: '',
          sport_id: '',
          brand_id: '',
          price: '',
          stock: '',
          material: '',
          size: '',
          weight: '',
          origin: '',
        })
        setIsEditMode(false)
        setEditingProduct(null)
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
      console.error(isEditMode ? '編輯商品失敗:' : '新增商品失敗:', error)
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
          (isEditMode ? '編輯商品失敗：' : '新增商品失敗：') +
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
      name: '',
      sport_id: '',
      brand_id: '',
      price: '',
      stock: '',
      material: '',
      size: '',
      weight: '',
      origin: '',
    })
    setErrors({}) // 清除錯誤訊息
    setIsEditMode(false)
    setEditingProduct(null)
  }

  const handleEdit = (product) => {
    console.log('編輯商品 - 完整資料:', product)
    setIsEditMode(true)
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sport_id:
        product.sport?.id?.toString() || product.sport_id?.toString() || '',
      brand_id:
        product.brand?.id?.toString() || product.brand_id?.toString() || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      material: product.material || '',
      size: product.size || '',
      weight: product.weight?.toString() || '',
      origin: product.origin || '',
    })
    setIsSheetOpen(true)
  }

  const handleDelete = (product) => {
    console.log('準備刪除商品 - 完整資料:', product)
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteProduct(productToDelete.id)

      if (result.success) {
        toast.success('刪除成功！')
        mutate() // 重新載入資料
        setIsDeleteDialogOpen(false)
        setProductToDelete(null)
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
    setProductToDelete(null)
  }

  // ===== 載入和錯誤狀態處理 =====
  if (isDataLoading) return <p>載入中...</p>
  if (error) return <p>載入錯誤：{error.message}</p>

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
        <SiteHeader title="Product" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable
                data={data?.data ?? []}
                columns={productColumns}
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
              />
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* ===== 新增/編輯商品表單 ===== */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-xl text-primary">
              {isEditMode ? '編輯商品' : '新增商品'}
            </SheetTitle>
            <SheetDescription className="text-gray-500">
              請填寫以下資訊
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-1 px-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  商品名稱
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="請輸入商品名稱"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sport_id">
                  運動種類
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.sport_id}
                  onValueChange={(value) =>
                    handleInputChange('sport_id', value)
                  }
                >
                  <SelectTrigger
                    className={errors.sport_id ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="請選擇運動種類" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id.toString()}>
                        {sport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sport_id && (
                  <p className="text-sm text-red-500 mt-1">{errors.sport_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_id">
                  品牌
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.brand_id}
                  onValueChange={(value) =>
                    handleInputChange('brand_id', value)
                  }
                >
                  <SelectTrigger
                    className={errors.brand_id ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="請選擇品牌" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brand_id && (
                  <p className="text-sm text-red-500 mt-1">{errors.brand_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  單價
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="請輸入單價"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  庫存
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="請輸入庫存"
                  className={errors.stock ? 'border-red-500' : ''}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">材質</Label>
                <Input
                  id="material"
                  type="text"
                  value={formData.material}
                  onChange={(e) =>
                    handleInputChange('material', e.target.value)
                  }
                  placeholder="請輸入材質"
                  className={errors.material ? 'border-red-500' : ''}
                />
                {errors.material && (
                  <p className="text-sm text-red-500 mt-1">{errors.material}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">尺寸</Label>
                <Input
                  id="size"
                  type="text"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  placeholder="請輸入尺寸"
                  className={errors.size ? 'border-red-500' : ''}
                />
                {errors.size && (
                  <p className="text-sm text-red-500 mt-1">{errors.size}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">重量</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="請輸入重量"
                  className={errors.weight ? 'border-red-500' : ''}
                />
                {errors.weight && (
                  <p className="text-sm text-red-500 mt-1">{errors.weight}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">產地</Label>
                <Input
                  id="origin"
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="請輸入產地"
                  className={errors.origin ? 'border-red-500' : ''}
                />
                {errors.origin && (
                  <p className="text-sm text-red-500 mt-1">{errors.origin}</p>
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
                    ? '編輯商品'
                    : '新增商品'}
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
                {productToDelete?.id}. {productToDelete?.name}
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
