'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  { icon: MemberDataIcon, label: '個人資料', path: '/member/member-data' },
  { icon: VenueDataIcon, label: '場地租借紀錄', path: '/member/venue-data' },
  { icon: ClassDataIcon, label: '課程紀錄', path: '/member/class-data' },
  { icon: ShopDataIcon, label: '商品訂單紀錄', path: '/member/shop-data' },
  { icon: TeamDataIcon, label: '糾團紀錄', path: '/member/team-data' },
  { icon: FavoriteIcon, label: '收藏紀錄', path: '/member/favorite-data' },
]

const MemberHomeButtons = () => {
  const router = useRouter()

  const handleButtonClick = (path) => {
    router.push(path)
  }

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {memberItems.map((item, index) => (
          <button
            key={index}
            type="button"
            data-state={item.label.toLowerCase().replace(/\s+/g, '-')}
            data-type="default"
            className="w-32 h-32 md:w-40 md:h-40 py-2 outline outline-1 outline-offset-[-1px] outline-white flex flex-col justify-center items-center gap-1 md:gap-2 hover:bg-white/10 transition"
            onClick={() => handleButtonClick(item.path)}
          >
            <div className="w-12 h-12 md:w-24 md:h-24 flex items-center justify-center">
              <item.icon className="w-full h-full" />
            </div>
            <div className="w-full px-1 text-center text-white text-sm md:text-xl font-bold leading-tight md:leading-10">
              {item.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MemberHomeButtons
