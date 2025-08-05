'use client'

import { Search, AlignLeft, Funnel } from 'lucide-react'
import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import {
  getProducts,
  fetchMemberOptions,
  fetchSportOptions,
  fetchBrandOptions,
  toggleFavorite,
  addProductCart,
} from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductCard } from '@/components/card/product-card'
import { PaginationBar } from '@/components/pagination-bar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
// import products from '../datas.json'
import { toast } from 'sonner'

const MobileSidebar = ({ open, onClose, sports, brands }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-50">
        <SheetHeader>
          <SheetTitle>商品分類</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <Accordion
            type="multiple"
            defaultValue={['sport-type']}
            className="w-full"
          >
            {/* 運動類型 */}
            <AccordionItem value="sport-type" className="border-b-0">
              <AccordionTrigger className="text-lg font-bold text-foreground">
                運動類型
              </AccordionTrigger>
              <AccordionContent className="p-2 space-y-2">
                {sports.map((sport) => (
                  <Label
                    key={sport.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <span className="text-base font-regular text-foreground hover:text-foreground hover:border-b hover:border-muted">
                      {sport.name}
                    </span>
                  </Label>
                ))}
              </AccordionContent>
            </AccordionItem>
            {/* 品牌 */}
            <AccordionItem value="brand">
              <AccordionTrigger className="text-lg font-bold text-foreground">
                品牌
              </AccordionTrigger>
              <AccordionContent className="p-2 space-y-2">
                {brands.map((brand) => (
                  <Label
                    key={brand.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <span className="text-base font-regular text-foreground hover:text-foreground hover:border-b hover:border-muted">
                      {brand.name}
                    </span>
                  </Label>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function ProductListPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // ===== 組件狀態管理 =====
  const [members, setMembers] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sports, setSports] = useState([])
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])

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
    getProducts(params)
  )

  // ===== 載入下拉選單選項 =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const memberData = await fetchMemberOptions()
        setMembers(memberData.rows || [])

        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])

        const brandData = await fetchBrandOptions()
        setBrands(brandData.rows || [])
      } catch (error) {
        console.error('載入失敗:', error)
        toast.error('載入失敗')
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (data && data.data) {
      setProducts(data.data)
      console.log('Products loaded:', data.data)
    }
  }, [data])

  // ===== 事件處理函數 =====
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

  const handlePagination = (targetPage) => {
    const perPage = data?.perPage || 8
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('page', String(targetPage))
    newParams.set('perPage', String(perPage))
    router.push(`?${newParams.toString()}`)
  }

  const handleAddToWishlist = async (productId) => {
    const result = await toggleFavorite(productId)
    mutate()
    if (result?.favorited) {
      toast('已加入我的收藏', {
        style: { backgroundColor: '#ff671e', color: '#fff', border: 'none' },
      })
    } else {
      toast('已從我的收藏移除', {
        style: { backgroundColor: '#ff671e', color: '#fff', border: 'none' },
      })
    }
    return result
  }

  const handleAddToCart = async (productId, quantity) => {
    const result = await addProductCart(productId, quantity)
    mutate()
    if (result?.success) {
      toast('已加入購物車', {
        style: { backgroundColor: '#ff671e', color: '#fff', border: 'none' },
      })
      return result
    }
  }

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <section className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          {/* 桌面版：標題和搜尋排序在同一行，使用 space-between */}
          <div className="hidden md:flex justify-between items-end mb-8">
            <div className="flex flex-col items-start justify-center gap-3">
              <p className="text-2xl font-bold text-foreground">籃球</p>
              <p className="text-base font-regular text-foreground">
                共有16筆商品
              </p>
            </div>
            {/* 桌面版搜尋和排序區域 */}
            <div className="flex items-center gap-4">
              <div className="relative flex items-center w-[200px]">
                <Input
                  type="search"
                  className="w-full bg-accent text-accent-foreground !h-10 pr-10"
                  placeholder="請輸入關鍵字"
                />
                <Button
                  variant={'outline'}
                  onClick={handleSearch}
                  className="h-8 w-8 absolute right-2 flex items-center justify-center"
                >
                  <Search size={20} />
                </Button>
              </div>
              <Select>
                <SelectTrigger className="bg-accent text-accent-foreground !h-10 w-[150px]">
                  <SelectValue placeholder="請選擇排序" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">價格遞增排序</SelectItem>
                  <SelectItem value="price-desc">價格遞減排序</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 手機版：分層布局 */}
          <div className="block md:hidden space-y-4 mb-8">
            {/* 標題區域 */}
            <div className="flex flex-col items-start justify-center gap-3">
              <p className="text-2xl font-bold text-foreground">籃球</p>
              <p className="text-base font-regular text-foreground">
                共有16筆商品
              </p>
            </div>

            {/* 功能按鈕區域 */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                onClick={() => setSidebarOpen(true)}
                className="!h-10 flex items-center gap-2"
              >
                <AlignLeft size={16} />
              </Button>

              <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                <div className="relative flex items-center flex-1">
                  <Input
                    type="search"
                    className="w-full bg-accent text-accent-foreground !h-10 pr-10 text-sm"
                    placeholder="請輸入關鍵字"
                  />
                  <Button
                    variant={'outline'}
                    onClick={handleSearch}
                    className="h-7 w-7 absolute right-1 flex items-center justify-center"
                  >
                    <Search size={16} />
                  </Button>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={() => setSidebarOpen(true)}
                className="!h-10 flex items-center gap-2"
              >
                <Funnel size={16} />
              </Button>
            </div>
          </div>
          <div className="flex">
            {/* 桌機側邊欄 */}
            <div className="w-50 pr-8 hidden md:block">
              <div className="mb-8">
                <p className="text-xl font-bold mb-4 text-foreground">
                  運動類型
                </p>
                <div className="space-y-2">
                  {sports.map((sport) => (
                    <label
                      key={sport.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <span className="text-base font-regular text-foreground hover:text-foreground hover:border-b hover:border-muted">
                        {sport.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <p className="text-xl font-bold mb-4 text-foreground">品牌</p>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <span className="text-base font-regular text-foreground hover:text-foreground hover:border-b hover:border-muted">
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <MobileSidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              sports={sports}
              brands={brands}
            />

            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="compact"
                    isFavorited={product?.favorited} // 從後端資料中取出是否已收藏
                    onAddToWishlist={() => handleAddToWishlist(product.id)}
                    onAddToCart={() => handleAddToCart(product.id, 1)}
                  />
                ))}
              </div>
            </div>
          </div>
          {data && (
            <PaginationBar
              page={data.page}
              totalPages={data.totalPages}
              perPage={data.perPage}
              onPageChange={(targetPage) => {
                handlePagination(targetPage)
              }}
            />
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
