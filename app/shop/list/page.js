'use client'

import { Search, AlignLeft, Funnel } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { fetchMemberOptions, fetchSportOptions, fetchBrandOptions } from '@/api'
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
import { PaginationDemo } from '@/components/pagination'
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
import products from '../datas.json'

const MobileSidebar = ({ open, onClose, sports, brands }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64">
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
  const [members, setMembers] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

        const brandData = await fetchBrandOptions()
        setBrands(brandData.rows || [])
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
      <section className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <div className="flex flex-col items-start justify-center gap-3 mb-8">
            <p className="text-2xl font-bold text-foreground">籃球</p>
            <p className="text-base font-regular text-foreground">
              共有16筆商品
            </p>
          </div>
          {/* 搜尋和排序區域 */}
          <div className="flex justify-center lg:justify-end items-center gap-4 mb-6 min-w-[300px] overflow-x-auto">
            <div className="flex gap-4 items-center md:justify-end justify-between w-full">
              {/* 手機側邊欄開啟按鈕*/}
              <div className="block md:hidden flex items-center">
                <Button
                  variant="secondary"
                  onClick={() => setSidebarOpen(true)}
                  className="!h-10"
                >
                  <AlignLeft size={20} />
                </Button>
              </div>
              <div className="relative flex items-center w-[180px]">
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
              <div className="hidden md:block">
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
              <div className="block md:hidden flex items-center">
                <Button
                  variant="secondary"
                  onClick={() => setSidebarOpen(true)}
                  className="!h-10"
                >
                  <Funnel size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex">
            {/* 桌機側邊欄 */}
            <div className="w-64 pr-8 hidden md:block">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          </div>
          <PaginationDemo />
        </div>
      </section>
      <Footer />
    </>
  )
}
