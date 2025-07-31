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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductCard } from '@/components/card/product-card'
import { PaginationDemo } from '@/components/pagination'

export default function ProductListPage() {
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  // const [isDataLoading, setIsDataLoading] = useState(mode === 'edit')
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)

  const [sportId, setSportId] = useState('')
  const [brandId, setBrandId] = useState('')
  const [sports, setSports] = useState([
    { id: '1', name: '健身訓練' },
    { id: '2', name: '籃球' },
    { id: '3', name: '羽球' },
    { id: '4', name: '足球' },
    { id: '5', name: '棒球' },
    { id: '6', name: '桌球' },
    { id: '7', name: '網球' },
    { id: '8', name: '排球' },
    { id: '9', name: '瑜珈' },
    { id: '10', name: '游泳' },
    { id: '11', name: '拳擊' },
  ])
  const [brands, setBrands] = useState([
    { id: '12', name: 'Decathlon' },
    { id: '13', name: 'Mizuno' },
    { id: '14', name: 'Butterfly' },
    { id: '15', name: 'Wilson' },
    { id: '16', name: 'Molten' },
    { id: '17', name: 'Nike' },
    { id: '18', name: 'Adidas' },
    { id: '19', name: 'Asics' },
    { id: '20', name: 'Yonex' },
    { id: '21', name: 'Spalding' },
    { id: '22', name: 'VICTOR' },
  ])

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

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <section className="py-10">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="flex flex-col items-start justify-center gap-3 mb-8">
            <p className="text-2xl font-bold text-primary">籃球</p>
            <p className="text-base font-regular text-gray-800">共有XX件商品</p>
          </div>

          {/* 搜尋和排序區域 */}
          <div className="flex justify-end items-center gap-4 mb-6">
            <div className="flex gap-4 items-center">
              <Select>
                <SelectTrigger className="bg-white !h-10 w-[200px]">
                  <SelectValue placeholder="請選擇排序" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">價格遞增排序</SelectItem>
                  <SelectItem value="price-desc">價格遞減排序</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex items-center w-[200px]">
                <Search className="absolute left-2" size={20} />
                <Input
                  type="search"
                  className="w-full bg-white !h-10 pl-8"
                  placeholder="請輸入關鍵字"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="h-10">
              搜尋
            </Button>
          </div>

          <div className="flex">
            <div className="w-64 pr-8">
              <div className="mb-8">
                <p className="text-xl font-bold mb-4 text-primary">
                  運動類型
                </p>
                <div className="space-y-2">
                  {sports.map((sport) => (
                    <label
                      key={sport.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <span className="text-base text-regular text-gray-800">
                        {sport.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xl font-bold mb-4 text-primary">
                  品牌
                </p>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <span className="text-base text-regular text-gray-800">
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
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
          </div>
        </div>
      </section>
      <section className="py-5">
        <PaginationDemo />
      </section>
      <Footer />
    </>
  )
}
