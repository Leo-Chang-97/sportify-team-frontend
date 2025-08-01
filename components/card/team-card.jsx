// components/TeamCard.jsx (建議將檔案名稱改為 TeamCard.jsx)

// 所有必要的 import 語句
'use client'

import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/card/card'

// 修正後的函式定義，參數放在括號內，並將 JSX 內容放在 return 裡
export function TeamCard({
  teamName,
  sportType,
  currentMembers,
  maxMembers,
  location,
  time,
}) {
  return (
    <div
      data-name="team-card"
      className="self-stretch p-8 bg-white rounded-lg inline-flex justify-start items-center gap-8"
    >
      <div className="w-64 h-48 inline-flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch flex-1 bg-zinc-300 rounded-lg" />
      </div>
      <div className="flex-1 flex justify-between items-end">
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
          <div
            data-property-1="Default"
            className="inline-flex justify-start items-center gap-2 flex-wrap content-center"
          >
            <div className="px-2 py-1 rounded-lg  outline-1 outline-offset-[-1px] outline-slate-900 flex justify-center items-center gap-2">
              <div
                data-styles="Line"
                className="w-6 h-6 relative overflow-hidden"
              >
                <div className="w-5 h-5 left-[2px] top-[2px] absolute outline-1 outline-offset-[-0.50px] outline-slate-900" />
              </div>
              <div className="justify-start text-slate-900 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
                籃球{' '}
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-7">
              Team Name
            </div>
            <div className="w-52 justify-start text-neutral-600 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
              7 / 8 目前隊伍人數
            </div>
            <div className="w-52 justify-start text-neutral-600 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
              北投運動中心
            </div>
            <div className="w-52 justify-start text-gray-500 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
              星期(一、三、六） 早上9點
            </div>
          </div>
        </div>
        <div className="w-40 self-stretch inline-flex flex-col justify-between items-end">
          <div className="inline-flex justify-start items-start gap-2.5">
            <div
              data-color="White"
              className="px-5 py-2.5 bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-slate-900 inline-flex flex-col justify-center items-center"
            >
              <div className="justify-start text-slate-900 text-lg font-medium font-['Noto_Sans_TC'] leading-7">
                新手
              </div>
            </div>
            <div
              data-color="Secondary"
              className="px-5 py-2.5 bg-orange-500 rounded-lg inline-flex flex-col justify-center items-center"
            >
              <div className="justify-start text-white text-lg font-bold font-['Inter'] leading-7">
                News
              </div>
            </div>
          </div>
          <div
            data-color="primary"
            data-icon="true"
            data-radius="8px"
            data-size="medium"
            data-state="Default"
            className="self-stretch px-12 py-4 bg-slate-900 rounded outline-1 outline-offset-[-0.50px] outline-white inline-flex justify-center items-center gap-2 overflow-hidden"
          >
            <div className="justify-start text-white text-lg font-bold font-['Noto_Sans_TC'] leading-7">
              詳細
            </div>
            <div className="w-6 h-6 relative">
              <div className="w-3.5 h-3 left-[20px] top-[18px] absolute origin-top-left rotate-180 border-2 border-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
