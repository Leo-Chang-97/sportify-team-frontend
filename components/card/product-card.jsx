'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/card/card'

// ...existing code...

export function ProductCard({
  className,
  onAddToCart,
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
    name: 'Demo Product',
    originalPrice: 0,
    price: 0,
  }
  const [isHovered, setIsHovered] = React.useState(false)
  const [isAddingToCart, setIsAddingToCart] = React.useState(false)
  const [isInWishlist, setIsInWishlist] = React.useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (onAddToCart) {
      setIsAddingToCart(true)
      // Simulate API call
      setTimeout(() => {
        onAddToCart(safeProduct.id)
        setIsAddingToCart(false)
      }, 600)
    }
  }

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

  return (
    <div className={cn('group', className)} {...props}>
      <Link href={`/shop/list/1`}>
        {/* <Link href={`/shop/product/${safeProduct.id}`}> */}
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
              alt="text"
              className={cn(
                'object-cover transition-transform duration-300 ease-in-out',
                isHovered && 'scale-105'
              )}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={product.img}
            />

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

          <CardContent className="p-4 pt-4">
            {/* Product name with line clamp */}
            <h3
              className={`
                line-clamp-2 text-xl font-bold transition-colors
                group-hover:text-primary
              `}
            >
              {safeProduct.name}
            </h3>

            {variant === 'default' && (
              <>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="font-bold text-xl text-destructive">
                    NTD${safeProduct.price}
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
                disabled={isAddingToCart}
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
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
            <CardFooter className="p-4 pt-0">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xl text-destructive">
                    NTD${safeProduct.price}
                  </span>
                </div>
                <Button
                  className="h-8 w-8 rounded-full"
                  disabled={isAddingToCart}
                  onClick={handleAddToCart}
                  size="icon"
                  variant="ghost"
                >
                  {isAddingToCart ? (
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
