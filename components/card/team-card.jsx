// components/TeamCard.jsx

'use client'

// import Image from 'next/image' // 移除 next/image 導入，因為它在非 Next.js 環境中無法解析
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils' // 假設您有這個工具函數
import { Badge } from '@/components/ui/badge' // 假設您有這個 Badge 元件
import { Button } from '@/components/ui/button' // 假設您有這個 Button 元件
import { Card, CardContent, CardFooter } from '@/components/card/card' // 假設您有這些 Card 元件
import {
  BasketballIcon,
  BadmintonIcon,
  TableTennisIcon,
  TennisIcon,
  VolleyballIcon,
  SoccerIcon,
  BaseballBatIcon,
} from '../icons/sport-icons' //引入ICON

export function TeamCard({
  teamName = '先發一對',
  sportType = '籃球',
  currentMembers = 5,
  maxMembers = 12,
  location = '北投運動中心',
  time = '星期(一、三、六）  早上9點',
  skillLevel = '新手', // 新增技能等級 prop
  isNews = true, // 新增是否為新聞 prop
  imageUrl = '/product-pic/photo-1505740420928-5e560c06d30e.avif', // 新增圖片 URL prop
}) {
  // 根據 skillLevel 決定標籤顏色和背景
  const getSkillBadgeStyles = (level) => {
    switch (level) {
      case '新手':
        return {
          bgColor: 'bg-white',
          textColor: 'text-slate-900',
          outlineColor: 'outline-slate-900',
        }
      case '中手':
        return {
          bgColor: 'bg-gray-400',
          textColor: 'text-white',
          outlineColor: 'outline-gray-400',
        }
      case '熟手':
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-white',
          outlineColor: 'outline-gray-500',
        }
      case '老手':
        return {
          bgColor: 'bg-slate-900',
          textColor: 'text-white',
          outlineColor: 'outline-slate-900',
        }
      default:
        return {
          bgColor: 'bg-white',
          textColor: 'text-slate-900',
          outlineColor: 'outline-slate-900',
        }
    }
  }

  const skillStyles = getSkillBadgeStyles(skillLevel)

  // 運動類型到圖示元件的映射
  const SportIcons = {
    籃球: BasketballIcon,
    羽毛球: BadmintonIcon,
    桌球: TableTennisIcon,
    網球: TennisIcon,
    排球: VolleyballIcon,
    足球: SoccerIcon,
    棒球: BaseballBatIcon, // 假設棒球對應 BaseballBatIcon
    // 您可以在這裡添加更多運動類型和對應的圖示
  }

  // 根據 sportType 獲取對應的圖示元件
  const CurrentSportIcon = SportIcons[sportType] || null // 如果沒有匹配的圖示，則為 null

  // 添加 console.log 以便在開發者工具中檢查值
  console.log(
    `TeamCard: sportType = "${sportType}", CurrentSportIcon =`,
    CurrentSportIcon
  )

  return (
    <div
      data-name="team-card"
      // 最外層是水平排列的 Flex 容器
      className="w-full p-8 bg-white rounded-lg flex flex-col sm:flex-row justify-start items-start sm:items-center gap-8 shadow-md"
    >
      {/* 隊伍圖片 (左側) */}
      <div className="w-full sm:w-64 h-48 flex-shrink-0 flex flex-col justify-start items-start gap-2.5">
        <img
          src={
            imageUrl ||
            `https://placehold.co/256x192/E0E0E0/333333?text=${teamName}`
          }
          alt={teamName || '隊伍圖片'}
          width={250}
          height={180}
          className="self-stretch flex-1 bg-zinc-300 rounded-lg object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = `https://placehold.co/256x192/E0E0E0/333333?text=無圖片`
          }}
        />
      </div>

      {/* 隊伍相關資訊 (中間區域) */}
      {/* flex-1 讓它佔據剩餘空間，flex-col 讓其內容垂直堆疊 */}
      <div className="flex-1 flex flex-col justify-start items-start gap-8">
        {/* 運動類型標籤 */}
        <div className="inline-flex justify-start items-center gap-2 flex-wrap content-center">
          <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-900 flex justify-center items-center gap-2">
            {/* 動態渲染運動圖示 */}
            {CurrentSportIcon && (
              <CurrentSportIcon className="w-6 h-6 text-slate-900" />
            )}
            <div className="justify-start text-slate-900 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
              {sportType || '運動類型'}
            </div>
          </div>
        </div>
        {/* 隊伍詳細資訊 */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-7">
            {teamName || 'Team Name'}
          </div>
          <div className="w-52 justify-start text-neutral-600 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
            {`${currentMembers || 0} / ${maxMembers || 0} 目前隊伍人數`}
          </div>
          <div className="w-52 justify-start text-neutral-600 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
            {location || '地點'}
          </div>
          <div className="w-52 justify-start text-gray-500 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
            {time || '時間'}
          </div>
        </div>
      </div>

      {/* 等級/News 標籤 和 詳細按鈕 (最右側區域) */}
      {/* 應用模板樣式：w-40, items-end, 移除 flex-grow */}
      <div className="w-45 self-stretch inline-flex flex-col justify-between items-end">
        {/* 技能等級和新聞標籤 - 並排顯示，間距為 10px (gap-2.5) */}
        <div className="inline-flex justify-start items-start gap-2.5">
          {/* 技能等級標籤 */}
          <div
            // 移除 flex-col，讓文字水平排列
            className={`px-5 py-2.5 rounded-lg ${skillStyles.bgColor} outline outline-1 outline-offset-[-1px] ${skillStyles.outlineColor} inline-flex justify-center items-center`}
          >
            {/* 技能等級文字 - 直接顯示字串，而不是拆分 */}
            <div
              className={`justify-start text-lg font-medium font-['Noto_Sans_TC'] leading-7 ${skillStyles.textColor}`}
            >
              {skillLevel || '未知'}
            </div>
          </div>
          {/* 新聞標籤 */}
          {isNews && (
            <div
              data-color="Secondary"
              className="px-5 py-2.5 bg-orange-500 rounded-lg inline-flex justify-center items-center"
            >
              <div className="justify-start text-white text-lg font-bold font-['Inter'] leading-7">
                News
              </div>
            </div>
          )}
        </div>
        {/* 詳細按鈕 */}
        <Button
          data-color="primary"
          data-icon="true"
          data-radius="8px"
          data-size="medium"
          data-state="Default"
          className="h-15 w-40 items-end px-12 py-4 bg-slate-900 rounded outline outline-1 outline-offset-[-0.50px] outline-white inline-flex justify-center items-center gap-2 overflow-hidden"
        >
          <div className="justify-start text-white text-lg font-bold font-['Noto_Sans_TC'] leading-7">
            詳細
          </div>
          <div className="w-6 h-6 relative flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              {/* 這是標準的「向右箭頭」SVG 路徑 */}
              <path
                d="M14 5L21 12L14 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Button>
      </div>
    </div>
  )
}
