'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  createReservation,
  fetchReservation,
  updateReservation,
  fetchMemberOptions,
  fetchLocationOptions,
  fetchTimePeriodOptions,
  fetchCenterOptions,
  fetchSportOptions,
  fetchCourtOptions,
  fetchTimeSlotOptions,
  fetchCourtTimeSlotOptions,
  fetchStatusOptions,
} from '@/api'
import { TeamCard } from '@/components/card/team-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner, { SearchField } from '@/components/hero-banner'
import ScrollAreaSport from '@/components/scroll-area-sport'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDownIcon } from 'lucide-react'

export default function TeamPage() {
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  // const [isDataLoading, setIsDataLoading] = useState(mode === 'edit')
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)

  const [memberId, setMemberId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [centerId, setCenterId] = useState('')
  const [sportId, setSportId] = useState('')
  const [courtId, setCourtIds] = useState('')
  const [timePeriodId, setTimePeriodId] = useState('')
  const [timeSlotId, setTimeSlotIds] = useState('')
  const [courtTimeSlotId, setCourtTimeSlotIds] = useState('')
  const [statusId, setStatusId] = useState('')
  const [date, setDate] = useState(null)
  const [price, setPrice] = useState('')

  const [members, setMembers] = useState([])
  const [locations, setLocations] = useState([])
  const [centers, setCenters] = useState([])
  const [sports, setSports] = useState([])
  const [courts, setCourts] = useState([])
  const [timePeriods, setTimePeriods] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [courtTimeSlots, setCourtTimeSlots] = useState([])
  const [status, setStatus] = useState([])

  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)

  // ===== 載入下拉選單選項 =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const memberData = await fetchMemberOptions()
        setMembers(memberData.rows || [])

        const locationData = await fetchLocationOptions()
        setLocations(locationData.rows || [])

        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])

        const timePeriodData = await fetchTimePeriodOptions()
        setTimePeriods(timePeriodData.rows || [])

        const statusData = await fetchStatusOptions()
        setStatus(statusData.rows || [])
      } catch (error) {
        console.error('載入球場/時段失敗:', error)
        toast.error('載入球場/時段失敗')
      }
    }
    loadData()
  }, [])

  const handleSearch = () => {
    // 搜尋邏輯
    console.log('搜尋:', { locationId, sportId, date })
  }

  // 定義 Hero Banner 搜尋欄位
  const searchFields = [
    {
      label: '地區',
      component: (
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-full bg-white !h-10">
            <SelectValue placeholder="請選擇地區" />
          </SelectTrigger>
          <SelectContent>
            {locations.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
            ) : (
              locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id.toString()}>
                  {loc.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '運動',
      component: (
        <Select value={sportId} onValueChange={setSportId}>
          <SelectTrigger className="w-full bg-white !h-10">
            <SelectValue placeholder="請選擇運動" />
          </SelectTrigger>
          <SelectContent>
            {sports?.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
            ) : (
              sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id.toString()}>
                  {sport.name || sport.id}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '日期',
      component: (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className={`w-full h-10 justify-between font-normal${
                !date ? ' text-gray-500' : ''
              }`}
            >
              {date ? date.toLocaleDateString() : '請選擇預訂日期'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
              className={errors.date ? 'border border-red-500 rounded-md' : ''}
            />
          </PopoverContent>
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date}</p>
          )}
        </Popover>
      ),
    },
  ]

  // 做一個 onClick function
  const createTeam = () => {
    console.log('創建隊伍Create!')
  }
  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/team-banner.jpg"
        title="馬上加入團隊"
        overlayOpacity="bg-primary/10"
      >
        <SearchField
          fields={searchFields}
          onSearch={handleSearch}
          searchButtonText="搜尋"
        />
      </HeroBanner>
      <ScrollAreaSport />
      <section>
        <div className="container mx-auto max-w-screen-xl px-4 gap-8">
          <div className="self-stretch text-center justify-start text-white text-2xl font-normal font-['Noto_Sans_TC'] leading-loose tracking-[24px]">
            推·薦·隊·伍
          </div>
          {/* 這個 div 是包含「創建隊伍」按鈕和右側排序下拉菜單的容器 */}
          <div className="self-stretch flex justify-between items-center mt-4 mb-8">
            {/* 創建隊伍按鈕 (使用 shadcn/ui 的 Button 組件) */}
            {/* 如果你想讓它變成可點擊的按鈕，建議使用 shadcn/ui 的 Button 元件 */}
            <Link href="/team/create" passHref>
              <Button
                onClick={createTeam} //測試
                className="relative group // <--- 新增 relative 和 group 在 Button 本身
              w-40 h-11 px-12 py-4 bg-gradient-to-r from-orange-500 to-blue-600 rounded-lg
              flex justify-center items-center gap-2 overflow-hidden
              text-white text-lg font-bold font-['Noto_Sans_TC'] leading-7"
              >
                <span className="flex justify-center items-center gap-2 z-10">
                  {' '}
                  {/* 確保內容在遮罩上方 */}
                  <span className="justify-start text-white text-lg font-bold font-['Noto_Sans_TC'] leading-7">
                    創建隊伍
                  </span>
                  {/* ICON 部分 */}
                  <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
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
                  </span>
                </span>

                {/* === 新增這個 div 作為遮罩層 === */}
                <div
                  className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ease-in-out
                group-hover:opacity-30 pointer-events-none z-0" // z-0 確保遮罩在內容下方
                ></div>
              </Button>
            </Link>

            {/* 右側的排序下拉菜單 (保持原樣，因為其結構看起來是完整的) */}
            {/* 這是你程式碼中的 Select 元件，我假設它能正常工作 */}
            <div className="flex-1 h-9 flex justify-end items-center gap-2">
              <div
                data-color="white"
                data-size="hug"
                data-state="search"
                className="inline-flex flex-col justify-start items-start"
              />
              <div
                data-color="white"
                data-size="hug"
                data-state="select"
                className="inline-flex flex-col justify-start items-start"
              >
                <div className="px-2 py-1 bg-white rounded-md outline-1 outline-offset-[-1px] outline-slate-900 inline-flex justify-start items-center">
                  <div className="pl-4 pr-2 flex justify-start items-center gap-2">
                    <div className="justify-start text-stone-300 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
                      請選擇排序
                    </div>
                    {/* 排序下拉菜單的 ICON 保持原樣 */}
                    <div className="w-7 h-7 relative">
                      <div className="w-2 h-3.5 left-[7.50px] top-[18.75px] absolute origin-top-left -rotate-90 border border-slate-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* card-group */}
          <div className="w-full flex flex-col justify-start items-start gap-8">
            <TeamCard></TeamCard>
            <TeamCard></TeamCard>
            <TeamCard></TeamCard>
            <TeamCard></TeamCard>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
