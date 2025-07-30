'use client'

import { Heart, Star, Eye, ClipboardCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/card/card'
import {
  BasketballIcon,
  BadmintonIcon,
  TableTennisIcon,
  TennisIcon,
  VolleyballIcon,
  TennisRacketIcon,
  SoccerIcon,
  BaseballBatIcon,
} from '@/components/icons/sport-icons'

export function CenterCard({
  className,
  onAddToWishlist,
  product,
  variant = 'default',
  ...props
}) {
  // 防呆：如果沒傳 product，給預設值
  const safeProduct = product || {
    category: 'Demo',
    id: 'demo',
    image: '',
    inStock: true,
    name: '北投國民運動中心',
    originalPrice: 0,
    price: 0,
    rating: 4,
  }
  const [isHovered, setIsHovered] = React.useState(false)
  const [isInWishlist, setIsInWishlist] = React.useState(false)

  const handleAddToWishlist = (e) => {
    e.preventDefault()
    if (onAddToWishlist) {
      setIsInWishlist(!isInWishlist)
      onAddToWishlist(safeProduct.id)
    }
  }

  const discount = safeProduct.originalPrice
    ? Math.round(
        ((safeProduct.originalPrice - safeProduct.price) /
          safeProduct.originalPrice) *
          100
      )
    : 0

  const renderStars = () => {
    const rating = safeProduct.rating ?? 0
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
                  : 'stroke-muted/40 text-muted'
            )}
            key={`star-${safeProduct.id}-position-${i + 1}`}
          />
        ))}
        {rating > 0 && (
          <span className="ml-1 text-xs text-muted-foreground">
            {rating.toFixed(1)}
          </span>
        )}
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
  ]

  return (
    <div className={cn('group', className)} {...props}>
      <Card
        className={cn(
          `
              relative h-full overflow-hidden rounded-lg py-0 transition-all
              duration-200 ease-in-out
              hover:shadow-md
            `,
          isHovered && 'ring-1 ring-primary/20'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {/* {safeProduct.image && (
              <Image
                alt={safeProduct.name}
                className={cn(
                  'object-cover transition-transform duration-300 ease-in-out',
                  isHovered && 'scale-105'
                )}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={safeProduct.image}
              />
            )} */}
          <Image
            alt="test"
            className={cn(
              'object-cover transition-transform duration-300 ease-in-out',
              isHovered && 'scale-105'
            )}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src="/product-pic/photo-1505740420928-5e560c06d30e.avif"
          />

          {/* Category badge */}
          <Badge
            className={`
                absolute top-2 left-2 bg-white/30 backdrop-blur-sm
              `}
            variant="white"
          >
            {safeProduct.category}
          </Badge>

          {/* Discount badge */}
          {discount > 0 && (
            <Badge
              className={`
                absolute top-2 right-2 bg-destructive
                text-destructive-foreground
              `}
            >
              {discount}% OFF
            </Badge>
          )}

          {/* Wishlist button */}
          <Button
            className={cn(
              `
                  absolute right-2 bottom-2 z-10 rounded-full bg-white/30
                  backdrop-blur-sm transition-opacity duration-300
                `,
              !isHovered && !isInWishlist && 'opacity-0'
            )}
            onClick={handleAddToWishlist}
            size="icon"
            type="button"
            variant="outline"
          >
            <Heart
              className={cn(
                'h-4 w-4',
                isInWishlist
                  ? 'fill-destructive text-destructive'
                  : 'text-primary'
              )}
            />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>

        <CardContent className="flex flex-col gap-2 p-4 pt-4">
          {/* Product name with line clamp */}
          <h3
            className={`
                line-clamp-2 text-lg font-medium transition-colors
                group-hover:text-primary
              `}
          >
            {safeProduct.name}
          </h3>

          {variant === 'default' && (
            <>
              <div>{renderStars()}</div>

              <div className="flex flex-wrap gap-2">
                {sportItems.map((item, idx) => {
                  const IconComponent = item.icon
                  return (
                    <Link href="#" key={idx}>
                      <Button variant="white" size="sm">
                        <IconComponent className="!w-6 !h-6" />

                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>

        {variant === 'default' && (
          <CardFooter className="p-4 pt-0 gap-2 flex flex-col md:flex-row">
            <Link
              // href={`/venue/center/${safeProduct.id}`}
              href={`/venue/center/1`}
              className="w-full flex-1"
            >
              <Button variant="white" className="w-full">
                詳細
                <Eye />
              </Button>
            </Link>
            <Link href="#" className="w-full flex-1">
              <Button className="w-full">
                預訂
                <ClipboardCheck />
              </Button>
            </Link>
          </CardFooter>
        )}

        {/* {variant === 'compact' && (
          <CardFooter className="p-4 pt-0">
            <Link href={`/venue/center/${safeProduct.id}`} className="flex-1">
              <Button
                variant="white"
                className="w-full text-primary border-primary"
              >
                詳細
                <Eye />
              </Button>
            </Link>
            <Link href="#" className="flex-1">
              <Button className="w-full">
                預訂
                <ClipboardCheck />
              </Button>
            </Link>
          </CardFooter>
        )} */}

        {!safeProduct.inStock && (
          <div
            className={`
                absolute inset-0 flex items-center justify-center
                bg-background/80 backdrop-blur-sm
              `}
          >
            <Badge className="px-3 py-1 text-sm" variant="destructive">
              Out of Stock
            </Badge>
          </div>
        )}
      </Card>
    </div>
  )
}
