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
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllProductsBasic,
  fetchProductSpecs,
  deleteProductSpec,
  deleteProductImage,
  fetchBrandOptions,
  fetchSportOptions,
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

export default function CenterPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // 表單初始狀態
  const firstFormData = {
    name: '',
    sport_id: '',
    brand_id: '',
    style: '',
    price: '',
    stock: '',
    material: '',
    size: '',
    weight: '',
    origin: '',
    images: [],
  }
  // ===== 組件狀態管理 =====
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState(firstFormData)
  const [imagePreviews, setImagePreviews] = useState([])
  const [brands, setBrands] = useState([])
  const [sports, setSports] = useState([])

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
  } = useSWR(['products', queryParams], async ([, params]) =>
    fetchProducts(params)
  )
}
