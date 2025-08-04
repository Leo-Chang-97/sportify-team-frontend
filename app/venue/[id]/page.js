'use client'

import {
  Heart,
  Share,
  Star,
  ClipboardCheck,
  CircleParking,
  ShowerHead,
} from 'lucide-react'
import {
  IconShoppingCart,
  IconBarbell,
  IconYoga,
  IconBike,
  IconTreadmill,
  IconWifi,
} from '@tabler/icons-react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Footer from '@/components/footer'
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
import { getCenterDetail } from '@/api/venue/center'
import fakeData from '@/app/venue/fake-data.json'

// 使用 Map 提供互動式地圖功能
const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
})

/** `feature -> feature` ➜ `feature-feature` (for React keys) */
const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')

/** Build an integer array `[0,…,length-1]` once */
const range = (length) => Array.from({ length }, (_, i) => i)

export default function CenterDetailPage() {
  /* Routing */
  const { id } = useParams()
  const router = useRouter()
  // 根據 id 找到對應的假資料
  const fakeItem = React.useMemo(
    () => fakeData.find((item) => item.id === id),
    [id]
  )

  /* State for API data */
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  /* Fetch data from API */
  React.useEffect(() => {
    const fetchCenterData = async () => {
      try {
        setLoading(true)
        const centerData = await getCenterDetail(id)
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

  /* Handlers */

  /* Loading state */
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-10">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">載入中...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  /* Error or not found state */
  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-10">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold">場館資料載入失敗</h1>
            <p className="mt-4">{error || '找不到您要查看的場館資料'}</p>
            <Button className="mt-6" onClick={() => router.push('/venue')}>
              返回場館列表
            </Button>
          </div>
        </main>
      </div>
    )
  }
  const sportItems = [
    { icon: BasketballIcon, label: '籃球' },
    { icon: BadmintonIcon, label: '羽球' },
    { icon: TableTennisIcon, label: '桌球' },
    { icon: TennisIcon, label: '網球' },
    { icon: VolleyballIcon, label: '排球' },
    { icon: TennisRacketIcon, label: '壁球' },
    { icon: SoccerIcon, label: '足球' },
    { icon: BaseballBatIcon, label: '棒球' },
    { icon: BilliardBallIcon, label: '撞球' },
  ]

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

  // 使用 API 資料的位置，如果沒有則使用預設位置
  /* const position = data.location?.coordinates || [
      data.latitude,
      data.longitude,
    ] || [25.116592439309592, 121.50983159645816] */
  const position = [25.116592439309592, 121.50983159645816]

  /*  Markup  */
  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Title & rating */}
            <div>
              <h1 className="text-3xl font-bold">{data.name}</h1>

              <div className="mt-2 flex items-center gap-2">
                {/* Stars */}
                <div
                  aria-label={`Rating ${data.rating || 0} out of 5`}
                  className="flex items-center"
                >
                  {range(5).map((i) => (
                    <Star
                      className={`
                          h-5 w-5
                          ${
                            i < Math.floor(data.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : i < (data.rating || 0)
                                ? 'fill-yellow-400/50 text-yellow-400'
                                : 'text-muted-foreground'
                          }
                        `}
                      key={`star-${i}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({(data.rating || 0).toFixed(1)})
                </span>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
              <Link href={`/venue/reservation`} className="w-full sm:w-auto">
                <Button variant="highlight" size="lg" className="w-full">
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
          </div>

          <Separator className="my-8" />

          {/* Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Main image */}
            <div className="overflow-hidden rounded-lg bg-muted">
              <AspectRatio ratio={4 / 3} className="bg-muted">
                <Image
                  alt={data.name || '場館圖片'}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={
                    data.image || data.images?.[0] || '/placeholder-venue.jpg'
                  }
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
          </div>

          <Separator className="my-8" />

          {/* - Features & Specs */}
          <div
            className={`
              grid grid-cols-1 gap-8
              md:grid-cols-2
            `}
          >
            <section className="flex flex-col gap-6">
              {/* data info */}
              <div className="flex flex-col">
                <h2 className="mb-4 text-2xl font-bold">場館運動項目</h2>

                <div className="flex flex-wrap gap-2">
                  {sportItems.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <Link href="#" key={idx}>
                        <Button variant="outline" size="sm">
                          <IconComponent className="!w-6 !h-6" />
                          <span>{item.label}</span>
                          <span className="text-muted-foreground">4個場地</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>
              {/* Features */}
              <div className="flex flex-col">
                <h2 className="mb-4 text-2xl font-bold">場館設施</h2>
                <div className="flex flex-wrap gap-4">
                  {facilityItems.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <div className="flex gap-2" key={idx}>
                        <IconComponent className="!w-6 !h-6" />
                        <span>{item.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Specifications */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">營業時間</h2>
              <div className="space-y-2">
                {fakeItem?.specs ? (
                  Object.entries(fakeItem.specs).map(([key, value]) => (
                    <div
                      className="flex justify-between border-b pb-2 text-sm"
                      key={key}
                    >
                      <span className="font-medium capitalize">{key}</span>
                      <span>{value}</span>
                    </div>
                  ))
                ) : data.businessHours ? (
                  Object.entries(data.businessHours).map(([key, value]) => (
                    <div
                      className="flex justify-between border-b pb-2 text-sm"
                      key={key}
                    >
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span>{value}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">
                    營業時間資料載入中...
                  </div>
                )}
              </div>
            </section>
          </div>

          <Separator className="my-8" />
          <section>
            <h2 className="mb-4 text-2xl font-bold">地理位置</h2>
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
