'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  createReservation,
  fetchReservation,
  updateReservation,
  fetchMemberOptions,
  fetchLocationOptions,
  fetchTimePeriodOptions,
  fetchCenterOptions,
  fetchSportOptions,
  fetchCourtOptions,
  fetchTimeSlotOptions,
  fetchCourtTimeSlotOptions,
  fetchStatusOptions,
} from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
// import HeroBanner, { SearchField } from '@/components/hero-banner'
import HeroBannerMember from '@/components/hero-banner-member'
import ScrollAreaMember from '@/components/scroll-area-member'
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
import { CenterCard } from '@/components/card/center-card'
import { ChevronDownIcon, ArrowRight } from 'lucide-react'
import FormCard from '@/components/card/member-form-card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ProductListPage() {
  const [quantity, setQuantity] = React.useState(1)
  const [isSuccess, setIsSuccess] = useState(true)
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  // const [isDataLoading, setIsDataLoading] = useState(mode === 'edit')
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)

  const [memberId, setMemberId] = useState('')

  const [members, setMembers] = useState([])

  // ===== 載入下拉選單選項 =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const memberData = await fetchMemberOptions()
        setMembers(memberData.rows || [])

        const locationData = await fetchLocationOptions()
        setLocations(locationData.rows || [])

        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])

        const timePeriodData = await fetchTimePeriodOptions()
        setTimePeriods(timePeriodData.rows || [])

        const statusData = await fetchStatusOptions()
        setStatus(statusData.rows || [])
      } catch (error) {
        console.error('載入球場/時段失敗:', error)
        toast.error('載入球場/時段失敗')
      }
    }
    loadData()
  }, [])

  const order = [
    {
      id: 1,
      item: {
        訂單編號: 1,
        收件人: '王淑華',
        手機號碼: '0945678901',
        收件地址: '台南市中西區民族路二段77號',
        物流方式: '7-11取貨',
        付款方式: 'Line Pay',
        發票類型: '統一編號',
        訂單金額: 4680,
      },
    },
  ]

  const products = [
    {
      category: 'Audio',
      id: '1',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Premium Wireless Headphones',
      originalPrice: 249.99,
      price: 199.99,
      rating: 4.5,
    },
    {
      category: 'Wearables',
      id: '2',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Smart Watch Series 5',
      originalPrice: 349.99,
      price: 299.99,
      rating: 4.2,
    },
    {
      category: 'Photography',
      id: '3',
      image:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Professional Camera Kit',
      originalPrice: 1499.99,
      price: 1299.99,
      rating: 4.8,
    },
    {
      category: 'Furniture',
      id: '4',
      image:
        'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Ergonomic Office Chair',
      originalPrice: 299.99,
      price: 249.99,
      rating: 4.6,
    },
    {
      category: 'Electronics',
      id: '5',
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Smartphone Pro Max',
      originalPrice: 1099.99,
      price: 999.99,
      rating: 4.9,
    },
    {
      category: 'Electronics',
      id: '6',
      image:
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Ultra HD Smart TV 55"',
      originalPrice: 899.99,
      price: 799.99,
      rating: 4.7,
    },
  ]

  const handleSearch = () => {
    // 搜尋邏輯
    console.log('搜尋:', { locationId, sportId, date })
  }

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBannerMember
        backgroundImage="/banner/member-banner.jpg"
        title="會員中心"
        overlayOpacity="bg-primary/50"
      ></HeroBannerMember>
      <ScrollAreaMember />
      <section className="py-10">
        <div className="container flex justify-center mx-auto max-w-screen-xl px-4">
          <div className="bg-card rounded-lg p-6 w-full">
            {/* 桌面版表格 */}
            <div className="hidden md:block">
              <Table className="w-full table-fixed">
                <TableHeader className="border-b-2 border-card-foreground">
                  <TableRow className="text-lg">
                    <TableHead className="font-bold w-1/2 text-accent-foreground">
                      訂單編號
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-accent-foreground">
                      進度
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-accent-foreground text-center">
                      訂單金額
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-accent-foreground text-center">
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-foreground">
                  {order.map((orderItem) => {
                    const filteredData = {
                      訂單編號: orderItem.item.訂單編號,
                      進度: '處理中',
                      訂單金額: orderItem.item.訂單金額,
                    }

                    return (
                      <TableRow
                        key={orderItem.id}
                        className="border-b border-card-foreground"
                      >
                        <TableCell className="font-bold text-base py-2 text-accent-foreground align-top">
                          {filteredData.訂單編號}
                        </TableCell>
                        <TableCell className="text-base py-2 text-accent-foreground align-top">
                          {filteredData.進度}
                        </TableCell>
                        <TableCell className="text-base py-2 text-accent-foreground align-top text-center">
                          NTD${filteredData.訂單金額}
                        </TableCell>
                        <TableCell className="py-2 align-top justify-center text-center flex gap-2">
                          <Button className="w-[80px] bg-transparent border border-primary text-primary hover:bg-transparent hover:text-primary">
                            取消
                          </Button>
                          <Button variant="outline" className="w-[80px]">
                            詳細
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* 手機版垂直佈局 */}
            <div className="md:hidden">
              {order.map((orderItem) => {
                const filteredData = {
                  訂單編號: orderItem.item.訂單編號,
                  進度: '處理中',
                  訂單金額: orderItem.item.訂單金額,
                }

                return (
                  <div
                    key={orderItem.id}
                    className="border-b border-card-foreground py-4 last:border-b-0"
                  >
                    <div className="flex">
                      {/* 左側 Header */}
                      <div className="w-1/3 flex flex-col gap-4 text-sm font-bold text-accent-foreground">
                        <div className="py-2">訂單編號</div>
                        <div className="py-2">進度</div>
                        <div className="py-2">訂單金額</div>
                        <div className="py-2">操作</div>
                      </div>

                      {/* 右側 Body */}
                      <div className="w-2/3 flex flex-col gap-4 text-base">
                        <div className="py-2 text-accent-foreground font-bold flex items-center justify-center">
                          {filteredData.訂單編號}
                        </div>
                        <div className="py-2 text-accent-foreground flex items-center justify-center">
                          {filteredData.進度}
                        </div>
                        <div className="py-2 text-accent-foreground flex items-center justify-center">
                          NTD${filteredData.訂單金額}
                        </div>
                        <div className="py-2 flex gap-2 justify-center">
                          <Button className="w-[60px] h-8 text-xs bg-transparent border border-primary text-primary hover:bg-transparent hover:text-primary">
                            取消
                          </Button>
                          <Button
                            variant="outline"
                            className="w-[60px] h-8 text-xs"
                          >
                            詳細
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
