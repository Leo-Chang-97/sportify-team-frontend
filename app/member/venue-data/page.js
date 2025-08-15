'use client'

// hooks
import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// 資料請求函式庫
import useSWR from 'swr'

// Icon
import { AlertCircle, Star, Search } from 'lucide-react'

// API 請求
import { fetchLocationOptions, fetchSportOptions } from '@/api'
import { fetchCenters } from '@/api/venue/center'

// UI 元件
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

// 自訂元件
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBannerMember from '@/components/hero-banner-member'
import ScrollAreaMember from '@/components/scroll-area-member'
import { PaginationBar } from '@/components/pagination-bar'
import { CenterCard } from '@/components/card/center-card'
import { LoadingState, ErrorState } from '@/components/loading-states'

export default function VenueDataPage() {
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

  // #region 路由和URL參數
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryParams = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries())
    return entries
  }, [searchParams])

  // #region 狀態管理
  const [locationId, setLocationId] = useState('')
  const [sportId, setSportId] = useState('')
  const [minRating, setMinRating] = useState('')
  const [keyword, setKeyword] = useState('')
  const [date, setDate] = useState(null)

  const [locations, setLocations] = useState([])
  const [sports, setSports] = useState([])

  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)

  // #region 數據獲取
  const {
    data,
    isLoading: isDataLoading,
    error,
    mutate,
  } = useSWR(['centers', queryParams], async ([, params]) => {
    // await new Promise((r) => setTimeout(r, 3000)) // 延遲測試載入動畫
    return fetchCenters(params)
  })
  const handlePagination = (targetPage) => {
    const perPage = data?.perPage || 8
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('page', String(targetPage))
    newParams.set('perPage', String(perPage))
    router.push(`?${newParams.toString()}`)
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
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.rows.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-12 text-lg">
                <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  沒有符合資料，請重新搜尋
                </h3>
              </div>
            ) : (
              data?.rows.map((data) => <CenterCard key={data.id} data={data} />)
            )}
          </div>
          {data?.rows.length > 0 && (
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
      </main>
      <Footer />
    </>
  )
}
