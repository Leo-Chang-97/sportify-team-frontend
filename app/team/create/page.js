'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link' // 保留 Link 元件
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner, { SearchField } from '@/components/hero-banner'
import ScrollAreaSport from '@/components/scroll-area-sport'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'

export default function createTeamPage() {
  // const router = useRouter() // <--- 移除 useRouter Hook

  // 處理儲存的點擊事件（您可以將您的表單提交邏輯放在這裡）
  const handleSave = () => {
    console.log('儲存按鈕被點擊！')
    // 在這裡處理表單資料並發送到後端
  }

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/team-banner.jpg"
        title="馬上加入團隊"
        overlayOpacity="bg-primary/10"
      ></HeroBanner>
      <section>
        <div className="container mx-auto max-w-screen-xl px-4 gap-8">
          <div className="w-full h-[814px] max-w-[1140px] py-20 flex flex-col justify-center items-center gap-8">
            <div
              data-property-1="Default"
              className="self-stretch flex-1 flex flex-col justify-start items-end overflow-hidden"
            >
              <div className="self-stretch p-8 bg-white rounded-lg backdrop-blur-[2px] flex flex-col justify-center items-end gap-8 overflow-hidden">
                <div className="self-stretch flex flex-col justify-start items-start gap-8">
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-slate-900 text-lg font-bold font-['Noto_Sans_TC'] leading-7">
                      隊伍名稱
                    </div>
                    <div
                      data-color="white"
                      data-size="small"
                      data-state="input"
                      className="self-stretch h-9 flex flex-col justify-start items-start"
                    >
                      <div className="self-stretch h-9 px-2 py-1 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-slate-900 inline-flex justify-start items-center">
                        <div className="flex-1 px-2 flex justify-start items-center gap-2" />
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-slate-900 text-lg font-bold font-['Noto_Sans_TC'] leading-7">
                      運動類別
                    </div>
                    <div
                      data-color="white"
                      data-size="small"
                      data-state="select"
                      className="self-stretch h-9 flex flex-col justify-start items-start"
                    >
                      <div className="self-stretch px-2 py-1 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-slate-900 inline-flex justify-start items-center">
                        <div className="flex-1 px-2 flex justify-between items-center">
                          <div className="flex-1 justify-start text-stone-300 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
                            請選擇項目
                          </div>
                          <div className="w-7 h-7 relative">
                            <div className="w-2 h-3.5 left-[7.50px] top-[18.75px] absolute origin-top-left -rotate-90 border border-slate-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-slate-900 text-lg font-bold font-['Noto_Sans_TC'] leading-7">
                      階級程度
                    </div>
                    <div
                      data-color="white"
                      data-size="small"
                      data-state="select"
                      className="self-stretch h-9 flex flex-col justify-start items-start"
                    >
                      <div className="self-stretch px-2 py-1 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-slate-900 inline-flex justify-start items-center">
                        <div className="flex-1 px-2 flex justify-between items-center">
                          <div className="flex-1 justify-start text-stone-300 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
                            請選擇項目
                          </div>
                          <div className="w-7 h-7 relative">
                            <div className="w-2 h-3.5 left-[7.50px] top-[18.75px] absolute origin-top-left -rotate-90 border border-slate-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-slate-900 text-lg font-bold font-['Noto_Sans_TC'] leading-7">
                      團隊練習時段
                    </div>
                    <div
                      data-color="white"
                      data-size="small"
                      data-state="select"
                      className="self-stretch flex flex-col justify-start items-start"
                    >
                      <div className="self-stretch px-2 py-1 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-slate-900 inline-flex justify-start items-center">
                        <div className="flex-1 px-2 flex justify-between items-center">
                          <div className="flex-1 justify-start text-stone-300 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
                            請選擇項目
                          </div>
                          <div className="w-7 h-7 relative">
                            <div className="w-2 h-3.5 left-[7.50px] top-[18.75px] absolute origin-top-left -rotate-90 border border-slate-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-slate-900 text-lg font-bold font-['Noto_Sans_TC'] leading-7">
                      出沒場地
                    </div>
                    <div
                      data-color="white"
                      data-size="small"
                      data-state="select"
                      className="self-stretch h-9 flex flex-col justify-start items-start"
                    >
                      <div className="self-stretch px-2 py-1 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-slate-900 inline-flex justify-start items-center">
                        <div className="flex-1 px-2 flex justify-between items-center">
                          <div className="flex-1 justify-start text-stone-300 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
                            請選擇項目
                          </div>
                          <div className="w-7 h-7 relative">
                            <div className="w-2 h-3.5 left-[7.50px] top-[18.75px] absolute origin-top-left -rotate-90 border border-slate-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <--- 這裡開始是按鈕群組的修改 ---> */}
                <div className="self-stretch inline-flex justify-between items-start">
                  {/* 使用 <Link> 包裹 <Button>，導航至 /team */}
                  <Link href="/team" passHref>
                    <Button
                      className="w-30 h-11 px-6 py-4 rounded-lg
                                 bg-gray-200 text-slate-900 text-lg font-bold font-['Noto_Sans_TC'] leading-7
                                 flex justify-center items-center gap-2 overflow-hidden
                                 transition-colors duration-200 ease-in-out hover:bg-gray-300"
                    >
                      <span>返回上一頁</span>
                    </Button>
                  </Link>

                  {/* 「儲存」按鈕，這裡將原本的 div 改為 Button 元件 */}
                  <Button
                    onClick={handleSave}
                    className="relative group w-3 0 h-11 px-12 py-4 bg-gradient-to-r from-orange-500 to-blue-600 rounded-lg
                               flex justify-center items-center gap-2 overflow-hidden
                               text-white text-lg font-bold font-['Noto_Sans_TC'] leading-7"
                  >
                    {/* 遮罩效果 */}
                    <div
                      className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ease-in-out
                                 group-hover:opacity-30 pointer-events-none z-0"
                    ></div>
                    {/* 按鈕文字 */}
                    <span className="justify-start text-white text-lg font-bold font-['Noto_Sans_TC'] leading-7 z-10">
                      儲存
                    </span>
                  </Button>
                </div>
                {/* <--- 按鈕群組的修改結束 ---> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
