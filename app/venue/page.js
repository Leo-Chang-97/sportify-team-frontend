'use client'

// hooks
import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// 資料請求函式庫
import useSWR from 'swr'

// Icon
import { Star, Search } from 'lucide-react'

// API 請求
import { fetchLocationOptions, fetchSportOptions } from '@/api'
import { fetchCenters } from '@/api/venue/center'

// UI 元件
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Input } from '@/components/ui/input'

// 自訂元件
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner, { SearchField } from '@/components/hero-banner'
import ScrollAreaSport from '@/components/scroll-area-sport'
import { PaginationBar } from '@/components/pagination-bar'
import { CenterCard } from '@/components/card/center-card'
import { LoadingState, ErrorState } from '@/components/loading-states'

export default function VenueListPage() {
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

  // #region 副作用處理
  // 載入下拉選單選項
  useEffect(() => {
    const loadData = async () => {
      try {
        const locationData = await fetchLocationOptions()
        setLocations(locationData.rows || [])

        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])
      } catch (error) {
        console.error('載入選項失敗:', error)
        toast.error('載入選項失敗')
      }
    }
    loadData()
  }, [])

  // #region 事件處理函數
  const handleSearch = (keyword, customSportId) => {
    const newParams = new URLSearchParams(searchParams.toString())
    // 地區
    if (locationId && locationId !== 'all') {
      newParams.set('locationId', locationId)
    } else {
      newParams.delete('locationId')
    }
    // 運動
    const sportValue = customSportId ?? sportId
    if (sportValue && sportValue !== 'all') {
      newParams.set('sportId', sportValue)
    } else {
      newParams.delete('sportId')
    }
    // 評分
    if (minRating && minRating !== 'all') {
      newParams.set('minRating', minRating)
    } else {
      newParams.delete('minRating')
    }
    // 關鍵字
    if (keyword) {
      newParams.set('keyword', keyword)
    } else {
      newParams.delete('keyword')
    }
    newParams.set('page', '1') // 搜尋時重設分頁
    router.push(`?${newParams.toString()}`)
  }

  const handlePagination = (targetPage) => {
    const perPage = data?.perPage || 8
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('page', String(targetPage))
    newParams.set('perPage', String(perPage))
    router.push(`?${newParams.toString()}`)
  }

  //  #region 載入和錯誤狀態處理
  if (isDataLoading) return <LoadingState message="載入場館資料中..." />
  if (error)
    return (
      <ErrorState
        title="場館資料載入失敗"
        message={`載入錯誤：${error.message}` || '找不到您要查看的場館資料'}
        onRetry={mutate}
        backUrl="/"
        backLabel="返回首頁"
      />
    )

  // #region 資料顯示選項

  // 評分系統選項
  const ratingOptions = [
    { label: <>全部</>, value: 'all' },
    ...[2, 3, 4, 5].map((num) => ({
      label: (
        <>
          {Array.from({ length: num }).map((_, i) => (
            <Star key={i} className="text-yellow-400 fill-yellow-400" />
          ))}
          {num === 5 ? '5星' : `${num}星以上`}
        </>
      ),
      value: String(num),
    })),
  ]

  // 定義 Hero Banner 搜尋欄位
  const searchFields = [
    {
      label: '地區',
      component: (
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
            <SelectValue placeholder="請選擇地區" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              全部
            </SelectItem>
            {locations.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
            ) : (
              locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id.toString()}>
                  {loc.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '運動',
      component: (
        <Select value={sportId} onValueChange={setSportId}>
          <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
            <SelectValue placeholder="請選擇運動" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              全部
            </SelectItem>
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
      label: '評分',
      component: (
        <Select value={minRating} onValueChange={setMinRating}>
          <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
            <SelectValue placeholder="請選擇評分星等" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '關鍵字',
      component: (
        <div className="relative flex items-center">
          <Search
            className="absolute left-3 text-accent-foreground/50"
            size={20}
          />
          <Input
            type="search"
            className="w-full bg-accent text-accent-foreground !h-10 pl-10"
            placeholder="請輸入關鍵字"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(keyword)
            }}
          />
        </div>
      ),
    },
  ]
  // #endregion 資料顯示選項

  // #region Markup
  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/venue-banner.jpg"
        title="馬上預訂動起來"
        overlayOpacity="bg-primary/50"
      >
        <SearchField
          fields={searchFields}
          onSearch={() => handleSearch(keyword)}
          searchButtonText="搜尋"
        />
      </HeroBanner>
      <ScrollAreaSport
        sportItems={sports}
        onSportSelect={(id) => {
          setSportId(id)
          handleSearch(keyword, id)
        }}
      />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <h3 className="text-center text-lg font-normal tracking-[24px]">
            精·選·場·館
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.rows.map((data) => (
              <CenterCard
                key={data.id}
                // onAddToCart={handleAddToCart}
                // onAddToWishlist={handleAddToWishlist}
                data={data}
              />
            ))}
          </div>
          <PaginationBar
            page={data.page}
            totalPages={data.totalPages}
            perPage={data.perPage}
            onPageChange={(targetPage) => {
              handlePagination(targetPage)
            }}
          />
        </div>
      </main>

      <Footer />
    </>
  )
}
