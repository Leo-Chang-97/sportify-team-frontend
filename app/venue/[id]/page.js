'use client'

// hooks
import * as React from 'react'
import { useVenue } from '@/contexts/venue-context'

// utils
import { cn } from '@/lib/utils'

// Icon
import {
  Heart,
  Share,
  Star,
  ClipboardCheck,
  CircleParking,
  ShowerHead,
  MapPin,
  TrainFront,
  Bus,
} from 'lucide-react'
import {
  IconShoppingCart,
  IconBarbell,
  IconYoga,
  IconBike,
  IconTreadmill,
  IconWifi,
} from '@tabler/icons-react'
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

// API 請求
import { fetchCenter } from '@/api/venue/center'
import { getCenterImageUrl } from '@/api/venue/image'

// next 元件
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// UI 元件
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { toast } from 'sonner'

// 自訂元件
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Footer from '@/components/footer'
import { LoadingState, ErrorState } from '@/components/loading-states'

// 使用 Map 提供互動式地圖功能
const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
})

export default function CenterDetailPage() {
  // #region 路由和URL參數
  const { id } = useParams()
  const router = useRouter()
  const { setVenueData } = useVenue()

  // #region 組件狀態管理
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  // #region 副作用處理
  React.useEffect(() => {
    const fetchCenterData = async () => {
      try {
        setLoading(true)
        // await new Promise((r) => setTimeout(r, 3000)) // 延遲測試載入動畫
        const centerData = await fetchCenter(id)
        setData(centerData.record)
      } catch (err) {
        console.error('Error fetching center detail:', err)
        setError(err.message)
        toast.error('載入場館資料失敗')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCenterData()
    }
  }, [id])

  // #region 事件處理函數
  const handleReservation = (e) => {
    e.preventDefault()
    setVenueData((prev) => ({
      ...prev,
      center: data.name,
      location: data.location.name,
      centerId: data.id,
      locationId: data.location.id,
    }))
    // 跳轉到預約頁面
    router.push('/venue/reservation')
  }

  //  #region 載入和錯誤狀態處理
  if (loading) {
    return <LoadingState message="載入場館資料中..." />
  }

  if (error || !data) {
    const retryFetch = () => {
      const fetchCenterData = async () => {
        try {
          setLoading(true)
          setError(null)
          const centerData = await fetchCenter(id)
          setData(centerData.record)
        } catch (err) {
          console.error('Error fetching center detail:', err)
          setError(err.message)
          toast.error('載入場館資料失敗')
        } finally {
          setLoading(false)
        }
      }
      fetchCenterData()
    }

    return (
      <ErrorState
        title="場館資料載入失敗"
        message={error || '找不到您要查看的場館資料'}
        onRetry={retryFetch}
        backUrl="/venue"
        backLabel="返回場館列表"
      />
    )
  }

  // #region 資料顯示選項
  const range = (length) => Array.from({ length }, (_, i) => i)
  const sportIconMap = {
    basketball: BasketballIcon,
    badminton: BadmintonIcon,
    tabletennis: TableTennisIcon,
    tennis: TennisIcon,
    volleyball: VolleyballIcon,
    squash: TennisRacketIcon,
    soccer: SoccerIcon,
    baseball: BaseballBatIcon,
    billiard: BilliardBallIcon,
  }

  const facilityItems = [
    { icon: CircleParking, label: '停車場' },
    { icon: ShowerHead, label: '淋浴間' },
    { icon: IconShoppingCart, label: '運動用品店' },
    { icon: IconBarbell, label: '健身房' },
    { icon: IconYoga, label: '瑜珈教室' },
    { icon: IconBike, label: '飛輪教室' },
    { icon: IconTreadmill, label: '體適能教室' },
    { icon: IconWifi, label: 'Wi-Fi' },
  ]

  const businessHours = {
    星期一: '08:00-20:00',
    星期二: '08:00-20:00',
    星期三: '08:00-20:00',
    星期四: '08:00-20:00',
    星期五: '08:00-20:00',
    星期六: '08:00-20:00',
    星期日: '休館',
  }
  // 使用 API 資料的位置，如果沒有則使用預設位置
  const position = [data.latitude, data.longitude] || [
    25.116592439309592, 121.50983159645816,
  ]
  // #endregion 資料顯示選項

  // #region Markup
  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen">
          {/* 標題與按鈕 */}
          <section className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Title & rating */}
            <div>
              <h1 className="text-3xl font-bold">{data.name}</h1>

              <div className="mt-2 flex items-center gap-2">
                {/* Stars */}
                <div
                  aria-label={`Rating ${data.averageRating || 0} out of 5`}
                  className="flex items-center"
                >
                  {range(5).map((i) => (
                    <Star
                      className={`
                          h-5 w-5
                          ${
                            i < Math.floor(data.averageRating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : i < (data.averageRating || 0)
                                ? 'fill-yellow-400/50 text-yellow-400'
                                : 'text-muted-foreground'
                          }
                        `}
                      key={`star-${i}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({Number(data.averageRating || 0).toFixed(1)})
                </span>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
              <Link href={`/venue/reservation`} className="w-full sm:w-auto">
                <Button
                  onClick={handleReservation}
                  variant="highlight"
                  size="lg"
                  className="w-full"
                >
                  預訂
                  <ClipboardCheck />
                </Button>
              </Link>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Link href={`/venue/center/1`} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    分享
                    <Share />
                  </Button>
                </Link>
                <Link href="#" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    收藏
                    <Heart />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* 圖片 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Main image */}
            <div className="overflow-hidden rounded-lg bg-muted">
              <AspectRatio ratio={4 / 3} className="bg-muted">
                <Image
                  alt={data.name || '場館圖片'}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={getCenterImageUrl(data.images[0])}
                />
              </AspectRatio>
            </div>
            {/* 2x2 grid image */}
            <div className="grid grid-cols-2 gap-2">
              <div className="overflow-hidden rounded-lg bg-muted">
                <AspectRatio ratio={4 / 3} className="bg-muted">
                  <Image
                    alt={`${data.name} - 圖片 1`}
                    className="object-cover"
                    fill
                    priority
                    sizes="(max-width: 768px) 50vw, 25vw"
                    src="https://images.unsplash.com/photo-1494199505258-5f95387f933c?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </AspectRatio>
              </div>
              <div className="overflow-hidden rounded-lg bg-muted">
                <AspectRatio ratio={4 / 3} className="bg-muted">
                  <Image
                    alt={`${data.name} - 圖片 2`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    src="https://images.unsplash.com/photo-1708312604073-90639de903fc?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </AspectRatio>
              </div>
              <div className="overflow-hidden rounded-lg bg-muted">
                <AspectRatio ratio={4 / 3} className="bg-muted">
                  <Image
                    alt={`${data.name} - 圖片 3`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    src="https://images.unsplash.com/photo-1708268418738-4863baa9cf72?q=80&w=1214&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </AspectRatio>
              </div>
              <div className="overflow-hidden rounded-lg bg-muted">
                <AspectRatio ratio={4 / 3} className="bg-muted">
                  <Image
                    alt={`${data.name} - 圖片 4`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    src="https://images.unsplash.com/photo-1627314387807-df615e8567de?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </AspectRatio>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* 資訊 */}
          <section
            className={`
              grid grid-cols-1 gap-8
              md:grid-cols-2
            `}
          >
            {/* 左半部 */}
            <section className="flex flex-col gap-6">
              {/* 場館運動項目 */}
              <div className="flex flex-col">
                <h2 className="mb-4 text-xl font-bold">場館運動項目</h2>

                <div className="flex flex-wrap gap-2">
                  {data.sports.map((item, idx) => {
                    const IconComponent = sportIconMap[item.iconKey]
                    return (
                      <Link href="#" key={idx}>
                        <Button variant="outline" size="sm">
                          {IconComponent && (
                            <IconComponent className="!w-6 !h-6" />
                          )}
                          {item.name}
                          <span className="text-muted-foreground">4個場地</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>
              {/* 場館設施 */}
              <div className="flex flex-col">
                <h2 className="mb-4 text-xl font-bold">場館設施</h2>
                <div className="flex flex-wrap gap-4">
                  {facilityItems.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <div className="flex gap-2" key={idx}>
                        <IconComponent className="!w-6 !h-6 text-highlight" />
                        <span>{item.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* 營業時間 */}
            <section>
              <h2 className="mb-4 text-xl font-bold">營業時間</h2>
              <div className="space-y-2">
                {data.businessHours ? (
                  Object.entries(data.businessHours).map(
                    ([key, value], idx, arr) => (
                      <div
                        className={cn(
                          'flex justify-between pb-2 text-sm',
                          idx !== arr.length - 1 && 'border-b'
                        )}
                        key={key}
                      >
                        <span className="font-medium capitalize">{key}</span>
                        <span>{value}</span>
                      </div>
                    )
                  )
                ) : businessHours ? (
                  Object.entries(businessHours).map(
                    ([key, value], idx, arr) => (
                      <div
                        className={cn(
                          'flex justify-between pb-2 text-sm',
                          idx !== arr.length - 1 && 'border-b'
                        )}
                        key={key}
                      >
                        <span className="font-medium capitalize">{key}</span>
                        <span>{value}</span>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-muted-foreground">
                    營業時間資料載入中...
                  </div>
                )}
              </div>
            </section>
          </section>

          <Separator className="my-8" />

          {/* 地理位置 */}
          <section>
            <h2 className="mb-4 text-xl font-bold">地理位置</h2>
            <div className="space-y-2 mb-4">
              <div className="flex pb-2 gap-2">
                <MapPin className="text-highlight" />
                <Link
                  href={`https://www.google.com/maps/place/${data.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="underline underline-offset-4">
                    {data.address}
                  </span>
                </Link>
              </div>
              <div className="flex pb-2 gap-2">
                <TrainFront className="text-highlight" />
                <span>距離最近的捷運站</span>
                <span className="text-highlight text-bold">200</span>
                <span>公尺</span>
              </div>
              <div className="flex pb-2 gap-2">
                <Bus className="text-highlight" />
                <span>距離最近的公車站</span>
                <span className="text-highlight text-bold">150</span>
                <span>公尺</span>
              </div>
            </div>
            <div className="w-full h-[400px] rounded-lg overflow-hidden">
              <Map position={position} dataName={data.name || '場館位置'} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
