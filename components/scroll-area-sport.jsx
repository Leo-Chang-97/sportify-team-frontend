import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  BasketballIcon,
  BadmintonIcon,
  TableTennisIcon,
  TennisIcon,
  VolleyballIcon,
  TennisRacketIcon,
  SoccerIcon,
  BaseballBatIcon,
} from '@/components/icons/sport-icons'
// 定義 Scroll Area 欄位
const sportItems = [
  { icon: BasketballIcon, label: '籃球' },
  { icon: BadmintonIcon, label: '羽球' },
  { icon: TableTennisIcon, label: '桌球' },
  { icon: TennisIcon, label: '網球' },
  { icon: VolleyballIcon, label: '排球' },
  { icon: TennisRacketIcon, label: '壁球' },
  { icon: SoccerIcon, label: '足球' },
  { icon: BaseballBatIcon, label: '棒球' },
]
export default function ScrollAreaSport() {
  return (
    <div className="w-full bg-background px-4 md:px-6">
      <div className="container mx-auto flex flex-col max-w-screen-xl items-center justify-between pt-10">
        <h3 className="text-lg text-white">探索各類運動</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 px-4 py-10">
            {sportItems.map((item, idx) => {
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
