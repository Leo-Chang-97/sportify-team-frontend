'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/card/card'
import { getProductImageUrl } from '@/api/admin/shop/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export function ProductCard({
  className,
  onAddToCart,
  onAddToWishlist,
  product,
  isFavorited: initialIsFavorited,
  variant = 'default',
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(initialIsFavorited || false) // 初始狀態從 props 傳入
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 當 initialIsFavorited prop 改變時，更新本地狀態
  useEffect(() => {
    setIsInWishlist(initialIsFavorited || false)
  }, [initialIsFavorited])

  // 處理圖片路徑：如果 img 是物件，取出 url 屬性；如果是字串，直接使用
  const image = product?.img || product?.image // 支援 img 和 image 兩種屬性名稱
  const imageFileName =
    product?.image_url ||
    (typeof image === 'object' && image !== null ? image.url : image)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (onAddToCart) {
      setIsAddingToCart(true) // 設定正在加入購物車的狀態
      const result = await onAddToCart(product?.id, 1)
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = async (e) => {
    e.preventDefault()
    if (onAddToWishlist) {
      const result = await onAddToWishlist(product?.id)
      setIsInWishlist(!!result?.favorited) // 根據後端回傳結果設定狀態
    }
  }

  return (
    <div className={cn('group', className)} {...props}>
      {/* <Link href={`/shop/1`}> */}
      <Link href={`/shop/${product?.id}`}>
        <Card
          className={cn(
            `
              relative h-full overflow-hidden rounded py-0 transition-all
              duration-200 ease-in-out
              hover:shadow-md gap-0
            `,
            isHovered && 'ring-1 ring-primary/20'
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AspectRatio ratio={4 / 3} className="overflow-hidden relative p-4">
            <Image
              alt={product?.name || '商品圖片'}
              className={cn(
                'object-cover transition-transform duration-300 ease-in-out w-full h-full rounded-t',
                isHovered && 'scale-105'
              )}
              src={getProductImageUrl(imageFileName)}
              width={300}
              height={300}
            />
          </AspectRatio>

          <CardContent>
            {/* 運動和品牌 */}
            <div className="flex items-center justify-between my-2">
              <span className="text-sm text-muted-foreground">
                {product?.brand_name || product?.brand || '—'}
              </span>
              {product?.sport_name && (
                <span className="text-sm outline rounded-sm px-2 py-0.5">
                  {product?.sport_name}
                </span>
              )}
            </div>
            {/* Product name with line clamp */}
            <h3
              className={`
                line-clamp-2 text-base font-medium transition-colors
                group-hover:text-primary
              `}
            >
              {product?.name}
            </h3>

            {variant === 'default' && (
              <>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="font-medium text-base text-destructive">
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
                  isAddingToCart && 'opacity-70',
                  'cursor-pointer'
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
                  <span className="font-medium text-base text-destructive">
                    NTD${product?.price}
                  </span>
                </div>
                <div className="flex">
                  {/* 愛心按鈕 */}
                  {isMounted && (
                    <Button
                      className="h-8 w-8 rounded-full cursor-pointer"
                      onClick={handleAddToWishlist}
                      size="icon"
                      variant="ghost"
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4',
                          isInWishlist
                            ? 'fill-destructive text-destructive'
                            : ''
                        )}
                      />
                      <span className="sr-only">加入收藏</span>
                    </Button>
                  )}
                  {/* 購物車按鈕 */}
                  <Button
                    className="h-8 w-8 rounded-full cursor-pointer"
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
              </div>
            </CardFooter>
          )}
        </Card>
      </Link>
    </div>
  )
}
