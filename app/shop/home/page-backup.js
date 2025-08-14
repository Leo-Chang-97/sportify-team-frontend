'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'
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
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner, { SearchField } from '@/components/hero-banner'
import ScrollAreaSport from '@/components/scroll-area-sport'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductCard } from '@/components/card/product-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { toast } from 'sonner'

// 定義 Brand 欄位
const brandItems = [
  { img: '/brand-pic/Anta.svg', label: 'Anta' },
  { img: '/brand-pic/Asics.svg', label: 'Asics' },
  { img: '/brand-pic/Butterfly.svg', label: 'Butterfly' },
  { img: '/brand-pic/Mizuno.svg', label: 'Mizuno' },
  { img: '/brand-pic/Molten.svg', label: 'Molten' },
  { img: '/brand-pic/Nike.svg', label: 'Nike' },
  { img: '/brand-pic/Spalding.svg', label: 'Spalding' },
  { img: '/brand-pic/VICTOR.svg', label: 'VICTOR' },
  { img: '/brand-pic/Wilson.svg', label: 'Wilson' },
  { img: '/brand-pic/Yonex.svg', label: 'Yonex' },
]

export default function ProductHomePage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // ===== 組件狀態管理 =====
  const [members, setMembers] = useState([])
  const [sportId, setSportId] = useState('')
  const [brandId, setBrandId] = useState('')
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
      setProducts(data.data.slice(0, 10))
      // console.log('Products loaded:', data.data) Debug用
    }
  }, [data])

  const handleSearch = () => {
    // 搜尋邏輯
    console.log('搜尋:', { brandId, sportId })
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

  // 定義 Hero Banner 搜尋欄位
  const searchFields = [
    {
      label: '運動',
      component: (
        <Select value={sportId} onValueChange={setSportId}>
          <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
            <SelectValue placeholder="請選擇運動" />
          </SelectTrigger>
          <SelectContent>
            {sports?.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
            ) : (
              sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id.toString()}>
                  {sport.name || sport.id}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '品牌',
      component: (
        <Select value={brandId} onValueChange={setBrandId}>
          <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
            <SelectValue placeholder="請選擇品牌" />
          </SelectTrigger>
          <SelectContent>
            {brands.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
            ) : (
              brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '關鍵字',
      component: (
        <div className="relative flex items-center">
          <Search
            className="absolute left-2 text-accent-foreground"
            size={20}
          />
          <Input
            type="search"
            className="w-full bg-accent text-accent-foreground !h-10 pl-8"
            placeholder="請輸入關鍵字"
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/shop-banner.jpg"
        title="探索您心儀的商品"
        overlayOpacity="bg-primary/50"
      >
        <SearchField
          fields={searchFields}
          onSearch={handleSearch}
          searchButtonText="搜尋"
        />
      </HeroBanner>
      <ScrollAreaSport sportItems={sports} />
      <section className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <h3 className="text-lg text-foreground text-center pb-10">
            精選商品
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="default"
                isFavorited={product?.favorited} // 從後端資料中取出是否已收藏
                onAddToWishlist={() => handleAddToWishlist(product.id)}
                onAddToCart={() => handleAddToCart(product.id, 1)}
              />
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="w-full bg-background px-4 md:px-6">
          <div className="container mx-auto flex flex-col max-w-screen-xl items-center justify-between pt-10">
            <h3 className="text-lg text-foreground text-center">探索品牌</h3>
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full sm:max-w-xs md:max-w-md lg:max-w-2xl mx-auto"
            >
              <CarouselContent>
                {brandItems.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/3 md:basis-1/5 flex flex-col items-center"
                  >
                    <div className="p-1 py-10 w-full h-full max-w-[200px] max-h-[200px]">
                      <Image
                        src={item.img}
                        alt={item.label}
                        width={200}
                        height={200}
                        className="w-auto h-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
