'use client'

import { Heart, Star, Eye, ClipboardCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import { useRouter } from 'next/navigation'

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
  BilliardBallIcon,
} from '@/components/icons/sport-icons'
import { getCenterImageUrl } from '@/api/venue/image'
import { useVenue } from '@/contexts/venue-context'

export function CenterCard({
  className,
  onAddToWishlist,
  data,
  variant = 'default',
  ...props
}) {
  const router = useRouter()
  const { setVenueData } = useVenue()
  const [isHovered, setIsHovered] = React.useState(false)
  const [isInWishlist, setIsInWishlist] = React.useState(false)

  const handleAddToWishlist = (e) => {
    e.preventDefault()
    if (onAddToWishlist) {
      setIsInWishlist(!isInWishlist)
      onAddToWishlist(data.id)
    }
  }

  const handleReservation = (e) => {
    e.preventDefault()
    setVenueData((prev) => ({
      ...prev,
      center: data.name,
      location: data.location.name,
      centerId: data.id,
      locationId: data.location.id,
    }))
    router.push('/venue/reservation')
  }

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
          {data.images && data.images.length > 0 && (
            <Image
              alt={data.name}
              className={cn(
                'object-cover transition-transform duration-300 ease-in-out',
                isHovered && 'scale-105'
              )}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={getCenterImageUrl(data.images[0])}
            />
          )}

          {/* Category badge */}
          <Badge
            className={`
                absolute top-2 left-2 bg-background/80 backdrop-blur-sm
              `}
            variant="outline"
          >
            {data.location.name}
          </Badge>

          {/* Wishlist button */}
          <Button
            className={cn(
              `
                  absolute right-2 bottom-2 z-10 rounded-full bg-background/80
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
                  : 'text-muted-foreground'
              )}
            />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>

        <CardContent className="flex flex-col gap-2 p-4 pt-4">
          {/* data name with line clamp */}
          <h3
            className={`
                line-clamp-2 text-lg font-medium transition-colors
                group-hover:text-primary
              `}
          >
            {data.name}
          </h3>

          {variant === 'default' && (
            <>
              <div>{renderStars()}</div>

              <div className="flex flex-wrap md:h-[74px] gap-2">
                {data.sports.map((item, idx) => {
                  const IconComponent = sportIconMap[item.iconKey]
                  return (
                    <Link href="#" key={idx}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="hover:bg-primary/10"
                      >
                        {IconComponent && (
                          <IconComponent className="!w-6 !h-6" />
                        )}
                        {item.name}
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
            <Button
              onClick={() => router.push(`/venue/${data.id}`)}
              variant="secondary"
              className="hover:bg-primary/10 w-full flex-1"
            >
              詳細
              <Eye />
            </Button>
            <Button onClick={handleReservation} className="w-full flex-1">
              預訂
              <ClipboardCheck />
            </Button>
          </CardFooter>
        )}

        {/* {!data.inStock && (
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
        )} */}
      </Card>
    </div>
  )
}
