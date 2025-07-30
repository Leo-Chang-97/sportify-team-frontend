import * as React from 'react'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
// 定義 Scroll Area 欄位
const sportItems = [
  { icon: '/sport-icon/basketball.svg', label: '籃球' },
  { icon: '/sport-icon/badminton.svg', label: '羽球' },
  { icon: '/sport-icon/table_tennis.svg', label: '桌球' },
  { icon: '/sport-icon/tennis_02.svg', label: '網球' },
  { icon: '/sport-icon/volleyball.svg', label: '排球' },
  { icon: '/sport-icon/tennis_racket.svg', label: '壁球' },
  { icon: '/sport-icon/soccer.svg', label: '足球' },
  { icon: '/sport-icon/baseball_bat.svg', label: '棒球' },
]
export default function ScrollAreaSport() {
  return (
    <div className="w-full bg-background px-4 md:px-6">
      <div className="container mx-auto flex flex-col max-w-screen-xl items-center justify-between pt-10">
        <h3 className="text-lg text-white">探索各類運動</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 px-4 py-10">
            {sportItems.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center min-w-[120px] shrink-0"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-3">
                  <img src={item.icon} alt={item.label} className="w-10 h-10" />
                </div>
                <span className="text-white text-sm text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
