// components/TeamCard.jsx

'use client'

// import Image from 'next/image' // 移除 next/image 導入，因為它在非 Next.js 環境中無法解析
import Link from 'next/link'
import * as React from 'react'
import { useState } from 'react' // <--- 新增: 引入 useState Hook 來管理狀態
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
import { ChevronDownIcon, ChevronUpIcon, UserIcon } from 'lucide-react' // <--- 新增: 引入向下的和向上的箭頭圖示，以及使用者圖示

export function TeamCard({
  teamName = '先發一對',
  sportType = '籃球',
  currentMembers = 5,
  maxMembers = 12,
  location = '北投運動中心',
  time = '星期(一、三、六）  早上9點',
  skillLevel = '新手', // 新增技能等級 prop
  isNews = true, // 是否有NEWS標籤
  imageUrl = '/product-pic/photo-1505740420928-5e560c06d30e.avif', // 新增圖片 URL prop
}) {
  // <--- 新增: 狀態來控制卡片內容的展開/收合 --->
  const [isExpanded, setIsExpanded] = useState(false)

  // 模擬從資料庫獲取的隊員資料
  const mockMembers = [
    { id: 1, name: '陳XX', skill: '擅長籃球、網球', level: '程度中手' },
    { id: 2, name: '洪XX', skill: '擅長足球、網球', level: '程度新手' },
    { id: 3, name: '林XX', skill: '擅長籃球、網球', level: '程度老手' },
    { id: 4, name: '隊員 Amy', skill: '', level: '' },
    // 更多隊員資料...
  ]
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
      data-name="team-card-container"
      className="w-full flex flex-col rounded-lg shadow-md overflow-hidden bg-card"
    >
      {/* 頂部主要資訊區塊 */}
      <div className="w-full p-4 flex flex-col sm:flex-row justify-start sm:items-center gap-4">
        {/* 隊伍圖片 (左側) */}
        <div className="w-full sm:w-64 flex-shrink-0 flex flex-col justify-start items-start gap-2.5">
          <img
            src={imageUrl}
            alt={teamName || '隊伍圖片'}
            className="w-full h-auto rounded-lg object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = `https://placehold.co/256x192/E0E0E0/333333?text=無圖片`
            }}
          />
        </div>

        {/* 隊伍相關資訊 (中間區域，大螢幕時 flex-1 佔據剩餘空間) */}
        <div className="flex-1 flex flex-col justify-start items-start gap-2 h-auto">
          {/* 運動類型標籤 */}
          <div className="inline-flex justify-start items-center gap-2 flex-wrap content-center">
            <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-border flex justify-center items-center gap-2">
              {CurrentSportIcon && (
                <CurrentSportIcon className="w-6 h-6 text-background" />
              )}
              <div className="justify-start text-background text-base font-normal font-['Noto_Sans_TC'] leading-normal">
                {sportType || '運動類型'}
              </div>
            </div>
          </div>
          {/* 隊伍詳細資訊 */}
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-card-foreground text-xl font-bold leading-7">
              {teamName || 'Team Name'}
            </div>
            <div className="w-52 justify-start text-muted-foreground text-base font-normal leading-normal">
              {`${currentMembers || 0} / ${maxMembers || 0} 目前隊伍人數`}
            </div>
            <div className="w-52 justify-start text-muted-foreground text-base font-normal leading-normal">
              {location || '地點'}
            </div>
            <div className="w-52 justify-start text-muted-foreground text-base font-normal leading-normal">
              {time || '時間'}
            </div>
          </div>
        </div>

        {/* 右側區塊，包含標籤和按鈕 */}
        {/* 在手機版佔滿寬度，在大螢幕時寬度自適應並右對齊 */}
        <div className="w-full sm:w-auto sm:h-40 flex flex-col sm:flex-col justify-between sm:items-end items-center gap-4 mt-4 sm:mt-0">
          {/* 標籤容器，手機版左右延伸，大螢幕右對齊 */}
          <div className="flex flex-col items-end gap-2.5">
            {/* NEWS標籤 */}
            {isNews && (
              <Badge
                variant="default"
                size="lg"
                className="bg-gradient-to-r bg-highlight text-base"
              >
                News
              </Badge>
            )}
            {/* 技能等級標籤 */}
            <Badge
              variant="outline"
              size="lg"
              className="bg-gradient-to-r text-base text-slate-900"
            >
              {skillLevel}
            </Badge>
          </div>
          {/* 詳細按鈕，手機版佔滿寬度，大螢幕寬度自適應並右對齊 */}
          <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline">
            <span>詳細</span>
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-primary-foreground" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-primary-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* 展開內容 */}
      <div
        className={cn(
          'w-full bg-sidebar-border overflow-hidden transition-all duration-500 ease-in-out',
          isExpanded
            ? 'max-h-screen opacity-100 p-4 pt-2 '
            : 'max-h-0 opacity-0 p-0'
        )}
      >
        <div className="flex w-full justify-between">
          <div className="text-lg font-bold text-sidebar-primary">隊伍成員</div>
          {/* 加入按鈕 */}
          <div className="flex justify-end">
            <Button className="bg-highlight">加入</Button>
          </div>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockMembers.map((member) => (
            <li key={member.id} className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-base text-card-foreground">
                  {member.name}
                </span>
                {member.skill && member.level && (
                  <span className="text-sm text-muted-foreground">{`${member.skill} / ${member.level}`}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
