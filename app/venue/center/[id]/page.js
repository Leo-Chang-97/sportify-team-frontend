'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, Eye, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Footer from '@/components/footer'
import { cn } from '@/lib/utils'

const centerData = {
  category: 'Demo',
  id: 'demo',
  image: '',
  inStock: true,
  name: '北投國民運動中心',
  originalPrice: 0,
  price: 0,
  rating: 4,
}

const renderStars = () => {
  const rating = centerData.rating ?? 0
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
          key={`star-${centerData.id}-position-${i + 1}`}
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

export default function CenterPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbAuto />

      <section className="py-10">
        <div className="container mx-auto max-w-screen-xl">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg text-primary">{centerData.name}</h2>
              <div>{renderStars()}</div>
            </div>

            <div className="flex gap-2">
              <Link href={`/venue/center/1`}>
                <Button
                  variant="outline"
                  className="w-full text-primary border-primary"
                >
                  詳細
                </Button>
              </Link>
              <Link href="#">
                <Button className="w-full">預訂</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
