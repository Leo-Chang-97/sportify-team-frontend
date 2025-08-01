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
import CourseCard from '@/components/card/course-card'
import { ChevronDown } from 'lucide-react'

export default function VenueListPage() {
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
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

  // 課程圖片資料
  const courseImages = [
    { id: 1, src: '/product-pic/volleyball-course.png', alt: '桌球教學 1' },
    { id: 2, src: '/product-pic/volleyball-course.png', alt: '桌球教學 2' },
    { id: 3, src: '/product-pic/volleyball-course.png', alt: '桌球教學 3' },
    { id: 4, src: '/product-pic/volleyball-course.png', alt: '桌球教學 4' }
  ];

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
      label: '運動',
      component: (
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-full bg-white !h-10">
            <SelectValue placeholder="請選運動" />
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
      label: '場館',
      component: (
        <Select value={sportId} onValueChange={setSportId}>
          <SelectTrigger className="w-full bg-white !h-10">
            <SelectValue placeholder="請選擇場館" />
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
      label: '快速查詢',
      component: (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className={`w-full h-10 bg-white justify-between font-normal${
                !date ? ' text-gray-500' : ' text-primary'
              }`}
            >
              {date ? date.toLocaleDateString() : '請選擇預訂日期'}
              <ChevronDown className="w-4 h-4" />
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

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      
      {/* 課程資訊區域 */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* 主標題 */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-12 sm:mb-16 lg:mb-20">
            課程資訊
          </h1>
          
          {/* 主要內容區域 - 響應式並排 */}
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
            {/* 左側 - 主圖片 (桌機版左側，手機版上方) */}
            <div className="md:w-1/2">
              <img 
                src="/banner/class-banner.jpg" 
                alt="桌球教學主圖" 
                className="w-full h-48 sm:h-64 lg:h-auto rounded-lg object-cover"
              />
            </div>
            
            {/* 右側 - 課程資訊 (桌機版右側，手機版下方) */}
            <div className="text-white md:w-1/2">
              <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">課程簡介說明:</h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 text-slate-200">
                學習桌球，從基礎開始培養運動技巧與身體能力，提供多元且充滿
                樂趣，重新認識、建立桌球基礎運動技能，循序漸進的課程訓練，
                讓新手也能快速上手。
              </p>
              
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">課程特色:</h3>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-200 mb-6 sm:mb-8">
                <li>• 小班教學，精緻化人數規劃</li>
                <li>• 豐富經驗，具備豐富教學心得</li>
                <li>• 專業師資，擁有專業訓練與認證</li>
                <li>• 完善設備，提供標準比賽設備規格</li>
              </ul>
              
              {/* 課程詳細資訊 */}
              <div className="text-xs leading-relaxed space-y-1 mb-6 sm:mb-8 text-slate-300 bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <p>適合年齡：中學-高中、國小中學年以上</p>
                <p>課程時間：週二18:30-19:00 (6-8週線性課程)</p>
                <p>上課人數：最大人數10名以內完美學員</p>
                <p>課程學費：詳情請致電洽詢，提供彈性方案</p>
                <p>上課地點：體育館青少年A教室-14號房間</p>
                <p className="hidden sm:block">課程設計：專為初學者設計，從基礎動作到進階技巧循序漸進學習</p>
              </div>
              
              {/* 報名區域 */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-slate-300 text-xs sm:text-sm">一期十堂</span>
                  <span className="text-white text-lg sm:text-xl font-bold">4800</span>
                </div>
                <button className="bg-orange-500 hover:bg-orange-500 px-4 sm:px-6 py-2 rounded text-white text-sm font-medium transition-colors w-full sm:w-auto">
                  立即報名
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </section>
      
      <Footer />
    </>
  )
}