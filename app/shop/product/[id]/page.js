'use client'

import { Search, AlignLeft, Funnel } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchMemberOptions, fetchSportOptions, fetchBrandOptions } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
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

export default function ProductListPage() {
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)
  const [members, setMembers] = useState([])
  // 新增：目前選中的大圖 index
  const [selectedIndex, setSelectedIndex] = useState(0)

  // ===== 載入下拉選單選項 =====
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const memberData = await fetchMemberOptions()
  //       setMembers(memberData.rows || [])

  //       const sportData = await fetchSportOptions()
  //       setSports(sportData.rows || [])

  //       const brandData = await fetchBrandOptions()
  //       setBrands(brandData.rows || [])
  //     } catch (error) {
  //       console.error('載入失敗:', error)
  //       toast.error('載入失敗')
  //     }
  //   }
  //   loadData()
  // }, [])

  const handleSearch = () => {
    // 搜尋邏輯
    console.log('搜尋:', { brandId, sportId })
  }

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <section className="flex w-full px-4 md:px-6 max-w-screen-xl mx-auto pt-10">
        {/* 左側商品圖片區塊 */}
        <div className="w-[400px] flex-shrink-0 flex flex-col items-center justify-start">
          {/* 上方大圖 */}
          <div className="w-[350px] h-[350px] bg-white flex items-center justify-center mb-4">
            <img
              src={brandItems[selectedIndex].img}
              alt={brandItems[selectedIndex].label}
              className="w-full h-full object-contain"
            />
          </div>
          {/* 下方小圖輪播 */}
          <div className="w-full">
            <Carousel opts={{ align: 'start' }} className="w-full">
              <CarouselContent>
                {brandItems.map((item, idx) => (
                  <CarouselItem
                    key={idx}
                    className="basis-1/5 flex justify-center"
                  >
                    <button
                      onClick={() => setSelectedIndex(idx)}
                      style={{
                        outline:
                          selectedIndex === idx ? '1px solid gray' : 'none',
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-[60px] h-[60px] object-contain"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
        {/* 右側商品資訊區（可自行填入內容） */}
        <div className="flex-1 pl-8 flex flex-col justify-start">
          {/* 這裡放商品資訊內容 */}
        </div>
      </section>
      <Footer />
    </>
  )
}
