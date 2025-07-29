'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import { Product } from "@/db/schema"
import { CheckIcon, EyeOpenIcon, PlusIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'

// import { addToCart } from '@/lib/actions/cart'
import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// import { Icons } from '@/components/icons'
// import { PlaceholderImage } from '@/components/placeholder-image'

export function ProductCard({
  product = {},
  variant = 'default',
  isAddedToCart = false,
  onSwitch,
  className,
  ...props
}) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  // 防呆：product 可能為 undefined/null
  const safeName = product?.name ?? '商品名稱'
  const safeId = product?.id ?? ''
  const safeImages = product?.images ?? []
  return (
    <Card
      className={cn('size-full overflow-hidden rounded-lg', className)}
      {...props}
    >
      <Link aria-label={safeName} href={safeId ? `/product/${safeId}` : '#'}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {safeImages.length ? (
              <Image
                src={safeImages[0]?.url ?? '/images/product-placeholder.webp'}
                alt={safeImages[0]?.name ?? safeName}
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                fill
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{safeName}</span>
      </Link>
      <Link href={safeId ? `/product/${safeId}` : '#'} tabIndex={-1}>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1">{safeName}</CardTitle>
          <CardDescription className="line-clamp-1">
            {/* {formatPrice(product.price)} */}
            100
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-1">
        {variant === 'default' ? (
          <div className="flex w-full items-center space-x-2">
            <Button
              aria-label="Add to cart"
              size="sm"
              className="h-8 w-full rounded-sm"
              // onClick={async () => {
              //   startUpdateTransition(() => {})
              //   const { error } = await addToCart({
              //     productId: product.id,
              //     quantity: 1,
              //   })

              //   if (error) {
              //     toast.error(error)
              //   }
              // }}
              disabled={isUpdatePending}
            >
              {isUpdatePending && (
                <span className="mr-2 size-4 animate-spin">⏳</span>
              )}
              Add to cart
            </Button>
            <Link
              href={`/preview/product/${product.id}`}
              title="Preview"
              className={cn(
                buttonVariants({
                  variant: 'secondary',
                  size: 'icon',
                  className: 'h-8 w-8 shrink-0',
                })
              )}
            >
              <EyeOpenIcon className="size-4" aria-hidden="true" />
              <span className="sr-only">Preview</span>
            </Link>
          </div>
        ) : (
          <Button
            aria-label={isAddedToCart ? 'Remove from cart' : 'Add to cart'}
            size="sm"
            className="h-8 w-full rounded-sm"
            onClick={async () => {
              startUpdateTransition(async () => {})
              await onSwitch?.()
            }}
            disabled={isUpdatePending}
          >
            {isUpdatePending ? (
              <span className="mr-2 size-4 animate-spin">⏳</span>
            ) : isAddedToCart ? (
              <CheckIcon className="mr-2 size-4" aria-hidden="true" />
            ) : (
              <PlusIcon className="mr-2 size-4" aria-hidden="true" />
            )}
            {isAddedToCart ? 'Added' : 'Add to cart'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
