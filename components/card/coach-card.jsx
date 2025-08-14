'use client'

// hooks
import * as React from 'react'

// utils
import { cn } from '@/lib/utils'

// Icon

// API 請求

// next 元件
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// UI 元件
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// 自訂元件
import { Card, CardContent, CardFooter } from '@/components/card/card'

export function CoachCard({ className, data, ...props }) {
  // #region 路由和URL參數
  const router = useRouter()

  // #region 組件狀態管理
  const [isHovered, setIsHovered] = React.useState(false)

  // #region 事件處理函數

  // #region 資料顯示選項

  return (
    <div className={cn('group', className)} {...props}>
      <Card
        className={cn(
          `
      relative h-full overflow-hidden py-0 transition-all
      duration-200 ease-in-out
      hover:shadow-md gap-0 border-none bg-background
    `,
          isHovered && 'ring-1 ring-accent'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-3/4 w-full h-full overflow-hidden rounded-lg">
          {data.avatar && (
            <Image
              alt={data.name}
              className={cn(
                'object-cover transition-transform duration-300 ease-in-out rounded-lg',
                isHovered && 'scale-105'
              )}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={data.avatar}
            />
          )}
        </div>

        <CardContent className="flex flex-col text-center text-accent justify-center gap-2 p-4">
          {/* data name with line clamp */}
          <h3
            className={`
                line-clamp-2 text-lg font-bold transition-colors
                group-hover:text-highlight
              `}
          >
            {data.name}
          </h3>
          <span className="text-base text-gray-400">{data.sport}</span>
        </CardContent>
      </Card>
    </div>
  )
}
