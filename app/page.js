'use client'

// hooks
import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// utils
import { cn } from '@/lib/utils'

// 資料請求函式庫
import useSWR from 'swr'

// icons
import {
  Plus,
  Star,
  School,
  ShoppingCart,
  Users,
  BookOpen,
  Search,
} from 'lucide-react'
import {
  BasketballIcon,
  BadmintonIcon,
  TableTennisIcon,
  TennisIcon,
  VolleyballIcon,
  TennisRacketIcon,
  SoccerIcon,
  BaseballBatIcon,
  BilliardBallIcon,
} from '@/components/icons/sport-icons'
import { Label } from '@/components/ui/label'

// API 請求
import { fetchLocationOptions, fetchSportOptions } from '@/api'
import { fetchCenters } from '@/api/venue/center'
import { getCenterImageUrl } from '@/api/venue/image'

// next 元件
import Link from 'next/link'
import Image from 'next/image'

// UI 元件
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// 自訂元件
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import { HeroGeometric } from '@/components/shape-landing-hero'
import { LoadingState, ErrorState } from '@/components/loading-states'

function Feacture({ icon: Icon, count, label }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border border-accent rounded">
        <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
      </div>
      <div>
        <div className="flex items-center">
          <span className="font-bold text-highlight text-3xl md:text-5xl">
            {count}
          </span>
          <Plus strokeWidth={3} />
        </div>
        <span className="text-xs md:text-sm">{label}</span>
      </div>
    </div>
  )
}

// 主頁面使用
const stats = [
  { icon: School, count: 100, label: '場館數量' },
  { icon: ShoppingCart, count: 50, label: '商品數量' },
  { icon: Users, count: 200, label: '隊伍數量' },
  { icon: BookOpen, count: 80, label: '課程數量' },
]

export default function HomePage() {
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
  const renderStars = () => {
    const rating = data.averageRating ?? 0
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            className={cn(
              'h-4 w-4',
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalfStar
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'stroke-yellow-400 text-muted'
            )}
            key={`star-${data.id}-position-${i + 1}`}
          />
        ))}
        {rating > 0 && (
          <span className="ml-1 text-xs text-muted-foreground">
            {Number(rating).toFixed(1)}
          </span>
        )}
      </div>
    )
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
  // Marks up
  return (
    <>
      <Navbar />
      <section className="w-full h-[300px] md:h-[624px] relative">
        {/* 大Banner */}
        <Image
          src="/banner/home-banner.jpg"
          alt="Banner"
          fill
          className="object-cover"
        />
        <HeroGeometric
          badge="Sport + Simplify"
          title1="SPORTIFY"
          title2="使運動變得簡單"
          description="你將不再有藉口"
          className="h-full"
        />
        <div
          className={`relative container mx-auto flex flex-col max-w-screen-xl items-end justify-end gap-6`}
        ></div>
      </section>

      <section className="flex flex-col container mx-auto max-w-screen-xl py-20 px-4 md:px-6">
        <section className="flex flex-wrap justify-around md:justify-between gap-6">
          {stats.map((stat, idx) => (
            <Feacture
              key={idx}
              icon={stat.icon}
              count={stat.count}
              label={stat.label}
            />
          ))}
        </section>
      </section>

      <section className="flex flex-col md:flex-row container mx-auto max-w-screen-xl px-4 md:px-6 gap-6 md:gap-6">
        {/* 精選場館 */}
        <div className="flex-2 relative">
          <Carousel className="w-full">
            <CarouselContent>
              {data?.rows && data.rows.length > 0 ? (
                data.rows.slice(0, 5).map((center, index) => (
                  <CarouselItem
                    key={center.id || index}
                    className="flex justify-center"
                  >
                    <div className="relative w-full h-[300px] md:h-[532px] rounded-lg overflow-hidden">
                      {center.images && center.images.length > 0 ? (
                        <Image
                          alt={center.name || `場館 ${index + 1}`}
                          className={cn(
                            'object-cover transition-transform duration-300 ease-in-out hover:scale-105'
                          )}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          src={getCenterImageUrl(center.images[0])}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                          <div className="text-center">
                            <div className="text-lg font-medium">
                              {center.name || `場館 ${index + 1}`}
                            </div>
                            <div className="text-sm mt-2">暫無圖片</div>
                          </div>
                        </div>
                      )}
                      {/* 場館名稱疊加層 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-semibold text-lg">
                          {center.name || `場館 ${index + 1}`}
                        </h3>
                        {center.location && (
                          <p className="text-white/80 text-sm">
                            {center.location.name || center.location}
                          </p>
                        )}
                        {center.rating && <div>{renderStars()}</div>}
                      </div>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="flex justify-center">
                  <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-medium">暫無場館資料</div>
                      <div className="text-sm mt-2">請稍後再試</div>
                    </div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </div>

        {/* 快速搜尋 */}
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>請輸入篩選條件</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">地區</Label>
                  <Select value={locationId} onValueChange={setLocationId}>
                    <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
                      <SelectValue placeholder="請選擇地區" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all" value="all">
                        全部
                      </SelectItem>
                      {locations.length === 0 ? (
                        <div className="px-3 py-2 text-gray-400">
                          沒有符合資料
                        </div>
                      ) : (
                        locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">運動</Label>
                  <Select value={sportId} onValueChange={setSportId}>
                    <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
                      <SelectValue placeholder="請選擇運動" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all" value="all">
                        全部
                      </SelectItem>
                      {sports?.length === 0 ? (
                        <div className="px-3 py-2 text-gray-400">
                          沒有符合資料
                        </div>
                      ) : (
                        sports.map((sport) => (
                          <SelectItem
                            key={sport.id}
                            value={sport.id.toString()}
                          >
                            {sport.name || sport.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">評分</Label>
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
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">關鍵字</Label>
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
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button variant="highlight" type="submit" className="w-full">
              搜尋
            </Button>
            <Button variant="secondary" type="submit" className="w-full">
              查看更多
            </Button>
          </CardFooter>
        </Card>
      </section>

      <Footer />
    </>
  )
}
