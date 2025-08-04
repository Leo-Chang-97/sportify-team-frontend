'use client'

import { Search } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { fetchMemberOptions, fetchSportOptions, fetchBrandOptions } from '@/api'
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

const products = [
  {
    id: 1,
    name: '極限飛馳籃球鞋',
    brand_name: 'Anta',
    sport_name: '籃球',
    price: 880,
    stock: 50,
    specs: {
      商品名稱: '極限飛馳籃球鞋',
      品牌: 'Anta',
      運動種類: '籃球',
      材質: '透氣網布與耐磨橡膠',
      尺寸: '27',
      重量: 380,
      產地: '越南',
    },
    img: 'spec01.jpeg',
  },
  {
    id: 2,
    name: '標準七號籃球',
    brand_name: 'Spalding',
    sport_name: '籃球',
    price: 650,
    stock: 100,
    specs: {
      商品名稱: '標準七號籃球',
      品牌: 'Spalding',
      運動種類: '籃球',
      材質: '高級合成皮革',
      尺寸: '24',
      重量: 600,
      產地: '泰國',
    },
    img: 'spec02.jpeg',
  },
  {
    id: 3,
    name: '7號籃球',
    brand_name: 'Spalding',
    sport_name: '籃球',
    price: 720,
    stock: 14,
    specs: {
      商品名稱: '7號籃球',
      品牌: 'Spalding',
      運動種類: '籃球',
      材質: '合成皮',
      尺寸: '24.5',
      重量: 600,
      產地: '中國',
    },
    img: 'spec03.jpeg',
  },
  {
    id: 4,
    name: '訓練背心',
    brand_name: 'Nike',
    sport_name: '籃球',
    price: 950,
    stock: 15,
    specs: {
      商品名稱: '訓練背心',
      品牌: 'Nike',
      運動種類: '籃球',
      材質: '速乾滌綸',
      尺寸: '1',
      重量: 181,
      產地: '越南',
    },
    img: 'spec04.jpeg',
  },
  {
    id: 5,
    name: '運動長襪',
    brand_name: 'Nike',
    sport_name: '籃球',
    price: 750,
    stock: 18,
    specs: {
      商品名稱: '運動長襪',
      品牌: 'Nike',
      運動種類: '籃球',
      材質: '運動棉',
      尺寸: '25-27',
      重量: 97,
      產地: '台灣',
    },
    img: 'spec05.jpeg',
  },
  {
    id: 6,
    name: '經典運動短褲',
    brand_name: 'Nike',
    sport_name: '籃球',
    price: 890,
    stock: 20,
    specs: {
      商品名稱: '經典運動短褲',
      品牌: 'Nike',
      運動種類: '籃球',
      材質: '皮革與氣墊科技',
      尺寸: '45',
      重量: 463,
      產地: '印尼',
    },
    img: 'spec06.jpeg',
  },
  {
    id: 7,
    name: '攻擊型碳素羽球拍',
    brand_name: 'Yonex',
    sport_name: '羽球',
    price: 820,
    stock: 30,
    specs: {
      商品名稱: '攻擊型碳素羽球拍',
      品牌: 'Yonex',
      運動種類: '羽球',
      材質: '高剛性碳纖維',
      尺寸: '67',
      重量: 83,
      產地: '日本',
    },
    img: 'spec07.jpeg',
  },
  {
    id: 8,
    name: '比賽級鵝毛羽球',
    brand_name: 'VICTOR',
    sport_name: '羽球',
    price: 750,
    stock: 150,
    specs: {
      商品名稱: '比賽級鵝毛羽球',
      品牌: 'VICTOR',
      運動種類: '羽球',
      材質: '天然鵝毛',
      尺寸: '8',
      重量: 60,
      產地: '中國',
    },
    img: 'spec08.jpeg',
  },
]

export default function ProductHomePage() {
  const [members, setMembers] = useState([])
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
      <ScrollAreaSport />
      <section className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <h3 className="text-lg text-foreground text-center pb-10">
            精選商品
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="default"
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
