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
  { icon: MemberDataIcon, label: '會員資料' },
  { icon: VenueDataIcon, label: '場館租借紀錄' },
  { icon: ClassDataIcon, label: '課程紀錄' },
  { icon: ShopDataIcon, label: '商品訂單紀錄' },
  { icon: TeamDataIcon, label: '糾團紀錄' },
  { icon: FavoriteIcon, label: '收藏紀錄' },
]

const MemberHomeButtons = () => {
  const router = useRouter()
  return (
    <div className="w-[1140px] inline-flex justify-center items-start gap-4 flex-wrap content-start">
      {/* 個人資料 */}
      <button
        type="button"
        data-state="member"
        data-type="default"
        className="w-72 h-64 py-4 outline outline-1 outline-offset-[-1px] outline-white inline-flex flex-col justify-center items-center gap-2 hover:bg-white/10 transition"
        onClick={() => router.push('/member/member-data')}
      >
        <div className="w-28 h-28 relative">
          <MemberDataIcon />
        </div>
        <div className="w-52 h-11 text-center text-white text-3xl font-bold leading-10 font-['Noto_Sans_TC']">
          個人資料
        </div>
      </button>

      {/* 場地租借紀錄 */}
      <button
        type="button"
        data-state="venue"
        data-type="default"
        className="w-72 h-64 py-4 outline outline-1 outline-offset-[-1px] outline-white inline-flex flex-col justify-center items-center gap-2 hover:bg-white/10 transition"
      >
        <div className="w-28 h-28 relative">
          <VenueDataIcon />
        </div>
        <div className="w-52 h-11 text-center text-white text-3xl font-bold leading-10 font-['Noto_Sans_TC']">
          場地租借紀錄
        </div>
      </button>

      {/* 課程紀錄 */}
      <button
        type="button"
        data-state="class"
        data-type="default"
        className="w-72 h-64 py-4 outline outline-1 outline-offset-[-1px] outline-white inline-flex flex-col justify-center items-center gap-2 hover:bg-white/10 transition"
      >
        <div className="w-28 h-28 relative">
          <ClassDataIcon />
        </div>
        <div className="w-52 h-11 text-center text-white text-3xl font-bold leading-10 font-['Noto_Sans_TC']">
          課程紀錄
        </div>
      </button>

      {/* 商品訂單紀錄 */}
      <button
        type="button"
        data-state="shop"
        data-type="default"
        className="w-72 h-64 py-4 outline outline-1 outline-offset-[-1px] outline-white inline-flex flex-col justify-center items-center gap-2 hover:bg-white/10 transition"
      >
        <div className="w-28 h-28 relative">
          <ShopDataIcon />
        </div>
        <div className="w-52 h-11 text-center text-white text-3xl font-bold leading-10 font-['Noto_Sans_TC']">
          商品訂單紀錄
        </div>
      </button>

      {/* 糾團紀錄 */}
      <button
        type="button"
        data-state="team"
        data-type="default"
        className="w-72 h-64 py-4 outline outline-1 outline-offset-[-1px] outline-white inline-flex flex-col justify-center items-center gap-2 hover:bg-white/10 transition"
      >
        <div className="w-28 h-28 relative">
          <TeamDataIcon />
        </div>
        <div className="w-52 h-11 text-center text-white text-3xl font-bold leading-10 font-['Noto_Sans_TC']">
          糾團紀錄
        </div>
      </button>

      {/* 收藏紀錄 */}
      <button
        type="button"
        data-state="favorite"
        data-type="default"
        className="w-72 h-64 py-4 outline outline-1 outline-offset-[-1px] outline-white inline-flex flex-col justify-center items-center gap-2 hover:bg-white/10 transition"
      >
        <div className="w-28 h-28 relative">
          <FavoriteIcon />
        </div>
        <div className="w-52 h-11 text-center text-white text-3xl font-bold leading-10 font-['Noto_Sans_TC']">
          收藏紀錄
        </div>
      </button>
    </div>
  )
}

export default MemberHomeButtons
