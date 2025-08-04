'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/card/card'
import { getProductImageUrl } from '@/api/admin/shop/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'

// ...existing code...

export function ProductCard({
  className,
  onAddToCart,
  onAddToWishlist,
  product,
  variant = 'default',
  ...props
}) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isAddingToCart, setIsAddingToCart] = React.useState(false)
  const [isInWishlist, setIsInWishlist] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // 處理圖片路徑：如果 img 是物件，取出 url 屬性；如果是字串，直接使用
  const image = product?.img || product?.image // 支援 img 和 image 兩種屬性名稱
  const imageFileName =
    product?.image_url ||
    (typeof image === 'object' && image !== null ? image.url : image)

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (onAddToCart) {
      setIsAddingToCart(true)
      // Simulate API call
      setTimeout(() => {
        onAddToCart(product?.id)
        setIsAddingToCart(false)
      }, 600)
    }
  }

  const handleAddToWishlist = (e) => {
    e.preventDefault()
    if (onAddToWishlist) {
      setIsInWishlist(!isInWishlist)
      onAddToWishlist(product?.id)
    }
  }

  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0

  return (
    <div className={cn('group', className)} {...props}>
      <Link href={`/shop/list/1`}>
        {/* <Link href={`/shop/product/${product?.id}`}> */}
        <Card
          className={cn(
            `
              relative h-full overflow-hidden rounded-lg py-0 transition-all
              duration-200 ease-in-out
              hover:shadow-md gap-3
            `,
            isHovered && 'ring-1 ring-primary/20'
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AspectRatio
            ratio={4 / 3}
            className="bg-muted overflow-hidden rounded-t-lg relative"
          >
            {/* {product?.image && (
              <Image
                alt={product?.name}
                className={cn(
                  'object-cover transition-transform duration-300 ease-in-out',
                  isHovered && 'scale-105'
                )}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={product?.image}
              />
            )} */}
            <Image
              alt={product?.name || '商品圖片'}
              className={cn(
                'object-cover transition-transform duration-300 ease-in-out w-full h-full',
                isHovered && 'scale-105'
              )}
              src={getProductImageUrl(imageFileName)}
              width={300}
              height={300}
            />

            {/* Wishlist button */}
            {isMounted && (
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
            )}
          </AspectRatio>

          <CardContent>
            {/* 運動和品牌 */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground font-medium">
                {product?.brand_name || product?.brand || '—'}
              </span>
              {product?.sport_name && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {product?.sport_name}
                </span>
              )}
            </div>
            {/* Product name with line clamp */}
            <h3
              className={`
                line-clamp-2 text-lg font-medium transition-colors
                group-hover:text-primary min-h-[56px]
              `}
            >
              {product?.name}
            </h3>

            {variant === 'default' && (
              <>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="font-medium text-lg text-destructive">
                    NTD${product?.price}
                  </span>
                </div>
              </>
            )}
          </CardContent>

          {variant === 'default' && (
            <CardFooter className="p-4 pt-0">
              <Button
                className={cn(
                  'w-full gap-2 transition-all',
                  isAddingToCart && 'opacity-70'
                )}
                disabled={!isMounted || isAddingToCart}
                onClick={handleAddToCart}
              >
                {isMounted && isAddingToCart ? (
                  <div
                    className={`
                      h-4 w-4 animate-spin rounded-full border-2
                      border-background border-t-transparent
                    `}
                  />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                加入購物車
              </Button>
            </CardFooter>
          )}

          {variant === 'compact' && (
            <CardFooter className="px-6 pt-0 pb-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-lg text-destructive">
                    NTD${product?.price}
                  </span>
                </div>
                <Button
                  className="h-8 w-8 rounded-full"
                  disabled={!isMounted || isAddingToCart}
                  onClick={handleAddToCart}
                  size="icon"
                  variant="ghost"
                >
                  {isMounted && isAddingToCart ? (
                    <div
                      className={`
                        h-4 w-4 animate-spin rounded-full border-2
                        border-primary border-t-transparent
                      `}
                    />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                  <span className="sr-only">加入購物車</span>
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </Link>
    </div>
  )
}
