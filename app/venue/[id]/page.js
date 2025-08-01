'use client'

import { Heart, Share, Minus, Plus, Star, ClipboardCheck } from 'lucide-react'
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
import datas from '../datas.json'

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

  /* Derive data object */
  const data = React.useMemo(() => datas.find((p) => p.id === id), [id])

  /* Handlers */

  /* Conditional UI */
  if (!data) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-10">
          <div
            className={`
              container px-4
              md:px-6
            `}
          >
            <h1 className="text-3xl font-bold">data Not Found</h1>
            <p className="mt-4">
              The data you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button className="mt-6" onClick={() => router.push('/datas')}>
              Back to datas
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
                  aria-label={`Rating ${data.rating} out of 5`}
                  className="flex items-center"
                >
                  {range(5).map((i) => (
                    <Star
                      className={`
                          h-5 w-5
                          ${
                            i < Math.floor(data.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : i < data.rating
                                ? 'fill-yellow-400/50 text-yellow-400'
                                : 'text-muted-foreground'
                          }
                        `}
                      key={`star-${i}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({data.rating.toFixed(1)})
                </span>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
              <Link href={`/venue/center/1`} className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
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
                  alt={data.name}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={data.image}
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
              {/* Description */}
              <p className="text-muted">{data.description}</p>
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
                          <span className="text-primary/50">4個場地</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>
              {/* Features */}
              <div className="flex flex-col">
                <h2 className="mb-4 text-2xl font-bold">場館設施</h2>
                <ul className="space-y-2">
                  {data.features.map((feature) => (
                    <li
                      className="flex items-start"
                      key={`feature-${data.id}-${slugify(feature)}`}
                    >
                      <span className="mt-1 mr-2 h-2 w-2 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Specifications */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">資訊</h2>
              <div className="space-y-2">
                {Object.entries(data.specs).map(([key, value]) => (
                  <div
                    className="flex justify-between border-b pb-2 text-sm"
                    key={key}
                  >
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <Separator className="my-8" />
          <section>
            <h2 className="mb-4 text-2xl font-bold">地理位置</h2>
            <div className="w-full h-[400px] rounded-lg overflow-hidden">
              <Map position={position} dataName={data.name} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
