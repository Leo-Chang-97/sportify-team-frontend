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
// 定義 Scroll Area 欄位
const memberItems = [
  { icon: MemberDataIcon, label: '會員資料' },
  { icon: VenueDataIcon, label: '場館租借紀錄' },
  { icon: ClassDataIcon, label: '課程紀錄' },
  { icon: ShopDataIcon, label: '商品訂單紀錄' },
  { icon: TeamDataIcon, label: '糾團紀錄' },
  { icon: FavoriteIcon, label: '收藏紀錄' },
]
export default function ScrollAreaMember() {
  return (
    <div className="w-full bg-background px-4 md:px-6">
      <div className="container mx-auto flex flex-col max-w-screen-xl items-center pt-10">
        <h3 className="text-lg text-white mb-8">GUEST</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex justify-between items-center px-4 py-10 min-w-full">
            {memberItems.map((item, idx) => {
              const IconComponent = item.icon
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center min-w-[120px] shrink-0 py-4 rounded-lg hover:bg-foreground/10 transition-colors"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-3">
                    <IconComponent className="!w-10 !h-10" />
                  </div>
                  <span className="text-white text-sm text-center">
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
