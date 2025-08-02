import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  ShopDataIcon,
  TeamDataIcon,
  VenueDataIcon,
  MemberDataIcon,
  ClassDataIcon,
  FavoriteIcon,
} from '@/components/icons/member-icons'
import { usePathname } from 'next/navigation'

// 定義 Scroll Area 欄位
const memberItems = [
  { icon: MemberDataIcon, label: '會員資料', path: '/member/member-data' },
  { icon: VenueDataIcon, label: '場館租借紀錄', path: '/member/venue-data' },
  { icon: ClassDataIcon, label: '課程紀錄', path: '/member/class-data' },
  { icon: ShopDataIcon, label: '商品訂單紀錄', path: '/member/shop-data' },
  { icon: TeamDataIcon, label: '糾團紀錄', path: '/member/team-data' },
  { icon: FavoriteIcon, label: '收藏紀錄', path: '/member/favorite-data' },
]

export default function ScrollAreaMember() {
  const pathname = usePathname()

  return (
    <div className="w-full bg-background px-4 md:px-6">
      <div className="container mx-auto flex flex-col max-w-screen-xl items-center pt-10">
        <h3 className="text-lg text-white mb-8">GUEST</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex justify-between items-center px-4 py-10 min-w-full">
            {memberItems.map((item, idx) => {
              const IconComponent = item.icon
              const isActive = pathname === item.path
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center min-w-[120px] shrink-0 py-4 rounded-lg hover:bg-foreground/10 transition-colors"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      isActive ? 'bg-orange-500' : 'bg-white/10'
                    }`}
                  >
                    <IconComponent
                      className={`!w-10 !h-10 ${isActive ? 'text-white' : ''}`}
                    />
                  </div>
                  <span
                    className={`text-sm text-center ${
                      isActive ? 'text-orange-500' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
