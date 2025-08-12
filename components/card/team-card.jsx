// components/TeamCard.jsx
'use client'

import Link from 'next/link'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BasketballIcon,
  BadmintonIcon,
  TableTennisIcon,
  TennisIcon,
  VolleyballIcon,
  SoccerIcon,
  BaseballBatIcon,
} from '../icons/sport-icons'
import { ChevronDownIcon, ChevronUpIcon, UserIcon } from 'lucide-react'

// 內嵌的 SVG 預設圖片，不會被任何廣告攔截器封鎖
const FALLBACK_IMAGE_URL =
  "data:image/svg+xml,%3Csvg width='256' height='192' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='16' fill='%23333' text-anchor='middle' dominant-baseline='middle'%3E無圖片%3C/text%3E%3C/svg%3E"

export function TeamCard({
  isExpanded,
  onToggleExpand,
  teamName = '先發一對',
  sportType = '籃球',
  currentMembers = 5,
  maxMembers = 12,
  location = '北投運動中心',
  time = '星期(一、三、六）  早上9點',
  skillLevel = '新手',
  isNews = true,
  imageUrl,
}) {
  const mockMembers = [
    { id: 1, name: '陳XX', skill: '擅長籃球、網球', level: '程度中手' },
    { id: 2, name: '洪XX', skill: '擅長足球、網球', level: '程度新手' },
    { id: 3, name: '林XX', skill: '擅長籃球、網球', level: '程度老手' },
    { id: 4, name: '隊員 Amy', skill: '', level: '' },
  ]

  const SportIcons = {
    籃球: BasketballIcon,
    羽毛球: BadmintonIcon,
    桌球: TableTennisIcon,
    網球: TennisIcon,
    排球: VolleyballIcon,
    足球: SoccerIcon,
    棒球: BaseballBatIcon,
  }
  const CurrentSportIcon = SportIcons[sportType] || null

  return (
    <div data-name="team-card-container" className="relative w-full">
      <div
        className={cn(
          'w-full flex flex-col shadow-md overflow-hidden bg-card transition-all duration-300',
          isExpanded ? 'rounded-t-lg' : 'rounded-lg'
        )}
      >
        {/* ===== 【RWD 核心修改 1】讓 flex 容器在空間不足時可以換行，並讓子元素等高 ===== */}
        <div className="w-full p-4 flex flex-col lg:flex-row justify-start lg:items-stretch gap-4">
          {/* 隊伍圖片 (左側) */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <img
              src={imageUrl || FALLBACK_IMAGE_URL}
              alt={teamName || '隊伍圖片'}
              className="w-full h-full rounded-lg object-cover aspect-[4/3] lg:aspect-auto"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = FALLBACK_IMAGE_URL
              }}
            />
          </div>

          {/* 隊伍相關資訊 (中間區域) */}
          <div className="flex-1 flex flex-col justify-start items-start gap-2 h-auto min-w-0">
            <div className="inline-flex justify-start items-center gap-2 flex-wrap content-center">
              <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-border flex justify-center items-center gap-2">
                {CurrentSportIcon && (
                  <CurrentSportIcon className="w-6 h-6 text-background" />
                )}
                <div className="justify-start text-background text-base font-normal leading-normal">
                  {sportType || '運動類型'}
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-card-foreground text-xl font-bold leading-7 truncate">
                {teamName || 'Team Name'}
              </div>
              <div className="w-full justify-start text-muted-foreground text-base font-normal leading-normal truncate">
                {`${currentMembers || 0} / ${maxMembers || 0} 目前隊伍人數`}
              </div>
              <div className="w-full justify-start text-muted-foreground text-base font-normal leading-normal truncate">
                {location || '地點'}
              </div>
              <div className="w-full justify-start text-muted-foreground text-base font-normal leading-normal truncate">
                {time || '時間'}
              </div>
            </div>
          </div>

          {/* ===== 【排版核心修改 2】重構右側區塊的佈局 ===== */}
          <div className="w-full lg:w-auto flex flex-col justify-between items-stretch lg:items-end mt-4 lg:mt-0 gap-2">
            {/* 標籤固定在最上方 */}
            <div className="flex justify-end items-start gap-2.5">
              {isNews && (
                <Badge
                  variant="default"
                  size="lg"
                  className="bg-gradient-to-r bg-highlight text-base"
                >
                  News
                </Badge>
              )}
              <Badge
                variant="outline"
                size="lg"
                className="bg-gradient-to-r text-base text-slate-900"
              >
                {skillLevel}
              </Badge>
            </div>
            {/* 按鈕固定在最下方 */}
            <Button
              onClick={onToggleExpand}
              variant="outline"
              className="flex-shrink-0 mt-auto"
            >
              <span>詳細</span>
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5 text-primary-foreground" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-primary-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 展開內容 */}
      <div
        className={cn(
          'absolute top-full left-0 right-0 z-10 w-full bg-sidebar-border overflow-hidden transition-all duration-300 ease-in-out rounded-b-lg shadow-lg',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 pt-2">
          <div className="flex w-full justify-between items-center mb-2">
            <div className="text-lg font-bold text-sidebar-primary">
              隊伍成員
            </div>
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
    </div>
  )
}
