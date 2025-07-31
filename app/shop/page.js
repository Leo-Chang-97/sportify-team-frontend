'use client'

import { Search } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchMemberOptions, fetchSportOptions, fetchBrandData } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Navbar } from '@/components/ui/shadcn-io/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner, { SearchField } from '@/components/hero-banner'
import ScrollAreaSport from '@/components/scroll-area-sport'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  // const [isDataLoading, setIsDataLoading] = useState(mode === 'edit')
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)

  const [sportId, setSportId] = useState('')
  const [brandId, setBrandId] = useState('')
  const [sports, setSports] = useState([])
  const [brands, setBrands] = useState([])

  // ===== 載入下拉選單選項 =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const memberData = await fetchMemberOptions()
        setMembers(memberData.rows || [])

        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])

        const brandData = await fetchBrandData()
        setBrands(brandData.data || [])
      } catch (error) {
        console.error('載入失敗:', error)
        toast.error('載入失敗')
      }
    }
    loadData()
  }, [])

  const handleSearch = () => {
    // 搜尋邏輯
    console.log('搜尋:', { brandId, sportId })
  }

  // 定義 Hero Banner 搜尋欄位
  const searchFields = [
    {
      label: '運動',
      component: (
        <Select value={sportId} onValueChange={setSportId}>
          <SelectTrigger className="w-full bg-white !h-10">
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
          <SelectTrigger className="w-full bg-white !h-10">
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
          <Search className="absolute left-2" size={20} />
          <Input
            type="search"
            className="w-full bg-white !h-10 pl-8"
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
      <ScrollAreaSport />
      <section className="py-10">
        <div className="container mx-auto max-w-screen-xl px-4">
          <h3 className="text-lg text-primary text-center">精選商品</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
        </div>
      </section>
      <section>
        <div className="w-full bg-primary px-4 md:px-6">
          <div className="container mx-auto flex flex-col max-w-screen-xl items-center justify-between pt-10">
            <h3 className="text-lg text-white">探索品牌</h3>
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
                    className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5 flex flex-col items-center"
                  >
                    <div className="p-1 py-10 w-[200px] h-[200px]">
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-full h-full object-contain"
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
