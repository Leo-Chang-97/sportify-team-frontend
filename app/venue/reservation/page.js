'use client'

// hooks
import React, { useState, useEffect } from 'react'
import { useVenue } from '@/contexts/venue-context'

// Icon
import { ClipboardCheck } from 'lucide-react'

// API 請求
import {
  fetchLocationOptions,
  fetchCenterOptions,
  fetchSportOptions,
} from '@/api'
import { fetchCenter } from '@/api/venue/center'
import {
  fetchCourtTimeSlotsByCenterAndSport,
  fetchAvailableCourtTimeSlotsByMonth,
} from '@/api/venue/court-time-slot'
import { getCenterImageUrl } from '@/api/venue/image'

// next 元件
import Link from 'next/link'
import Image from 'next/image'

// UI 元件
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 自訂元件
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  useInitializeCurrentDate,
  useCalendarMonth,
  useCalendarYear,
} from '@/components/date-picker-calendar'
import { TimeSlotTable } from '@/components/timeslot-table'
import { SimpleLoadingText } from '@/components/loading-states'

import fakeData from '@/app/venue/fake-data.json'
const data = fakeData[0]

export default function ReservationPage() {
  // #region 路由和URL參數
  const { venueData, setVenueData } = useVenue()

  // #region 組件狀態管理
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const [selectedDate, setSelectedDate] = useState(null)
  const [dateData, setDateData] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  const [locationId, setLocationId] = useState(
    venueData.locationId?.toString() || ''
  )
  const [centerId, setCenterId] = useState(venueData.centerId?.toString() || '')
  const [sportId, setSportId] = useState('')

  const [locations, setLocations] = useState([])
  const [centers, setCenters] = useState([])
  const [sports, setSports] = useState([])
  const [courtTimeSlots, setCourtTimeSlots] = useState([])

  // 使用 context 來管理訂單摘要狀態
  const orderSummary = venueData
  const setOrderSummary = (updater) => {
    if (typeof updater === 'function') {
      setVenueData((prev) => updater(prev))
    } else {
      setVenueData(updater)
    }
  }

  // 初始化當前日期
  useInitializeCurrentDate()

  // 獲取日曆的年月狀態
  const [currentMonth] = useCalendarMonth()
  const [calendarYear] = useCalendarYear()

  // 計算 yearMonth 格式 (YYYY-MM)
  const yearMonth = `${calendarYear}-${String(currentMonth + 1).padStart(2, '0')}`

  // #region 副作用處理

  // 在客戶端生成資料，避免 hydration 錯誤
  useEffect(() => {
    setDateData(generateDateWithStatus())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        setLoading(true)
        // await new Promise((r) => setTimeout(r, 3000)) // 延遲測試載入動畫
        const centerData = await fetchCenter(centerId)
        setData(centerData.record)
      } catch (err) {
        console.error('Error fetching center detail:', err)
        setError(err.message)
        toast.error('載入場館資料失敗')
      } finally {
        setLoading(false)
      }
    }

    if (centerId) {
      fetchCenterData()
    }
  }, [centerId])

  // 更新訂單摘要中的選項 - 分別處理每個欄位
  useEffect(() => {
    const selectedCenter = centers.find(
      (center) => center.id.toString() === centerId
    )
    const newCenterName = selectedCenter?.name || ''

    setOrderSummary((prev) => {
      if (prev.center !== newCenterName) {
        return { ...prev, center: newCenterName }
      }
      return prev
    })
  }, [centerId, centers])
  useEffect(() => {
    const selectedSport = sports.find(
      (sport) => sport.id.toString() === sportId
    )
    const newSportName = selectedSport?.name || ''

    setOrderSummary((prev) => {
      if (prev.sport !== newSportName) {
        return { ...prev, sport: newSportName }
      }
      return prev
    })
  }, [sportId, sports])

  // 載入下拉選單選項
  useEffect(() => {
    const loadData = async () => {
      try {
        const locationData = await fetchLocationOptions()
        setLocations(locationData.rows || [])
        const centerData = await fetchCenterOptions()
        setCenters(centerData.rows || [])
        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])
      } catch (error) {
        console.error('載入選項失敗:', error)
        toast.error('載入選項失敗')
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        let centerData
        if (locationId) {
          centerData = await fetchCenterOptions({
            locationId: Number(locationId),
          })
        } else {
          centerData = await fetchCenterOptions()
        }
        setCenters(centerData.rows || [])
        if (
          centerId &&
          !centerData.rows?.some((center) => center.id.toString() === centerId)
        ) {
          setCenterId('')
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCenters([])
        } else {
          setCenters([])
        }
      }
    }
    loadData()
  }, [locationId])

  useEffect(() => {
    const loadData = async () => {
      try {
        let courtTimeSlotData
        if (centerId && sportId) {
          courtTimeSlotData = await fetchCourtTimeSlotsByCenterAndSport(
            Number(centerId),
            Number(sportId)
          )
          setCourtTimeSlots(courtTimeSlotData.rows || [])
        } else {
          setCourtTimeSlots([])
        }
      } catch (err) {
        console.error('載入場地時段失敗:', err)
        if (err.response && err.response.status === 404) {
          setCourtTimeSlots([])
        } else {
          setCourtTimeSlots([])
        }
      }
    }
    loadData()
  }, [centerId, sportId])

  useEffect(() => {
    const loadData = async () => {
      try {
        let courtTimeSlotData
        if (centerId && sportId && yearMonth) {
          courtTimeSlotData = await fetchAvailableCourtTimeSlotsByMonth(
            Number(centerId),
            Number(sportId),
            yearMonth
          )
          setCourtTimeSlots(courtTimeSlotData.rows || [])
        } else {
          setCourtTimeSlots([])
        }
      } catch (err) {
        console.error('載入場地時段失敗:', err)
        if (err.response && err.response.status === 404) {
          setCourtTimeSlots([])
        } else {
          setCourtTimeSlots([])
        }
      }
    }
    loadData()
  }, [centerId, sportId, yearMonth])

  // #region 事件處理函數
  const handleDateSelect = (date, dateInfo) => {
    if (dateInfo && dateStatuses[dateInfo.status].clickable) {
      setSelectedDate(date)
      setOrderSummary((prev) => {
        // 檢查日期是否真的不同
        if (prev.selectedDate?.getTime() !== date?.getTime()) {
          return {
            ...prev,
            selectedDate: date,
          }
        }
        return prev
      })
      console.log('選擇的日期:', date, '狀態:', dateInfo.status)
    }
  }

  // 處理場地時段選擇
  const handleTimeSlotSelection = (selectionData) => {
    setOrderSummary((prev) => {
      // 檢查是否真的有變化
      if (
        JSON.stringify(prev.timeSlots) !==
          JSON.stringify(selectionData.details) ||
        prev.totalPrice !== selectionData.totalPrice
      ) {
        return {
          ...prev,
          timeSlots: selectionData.details,
          totalPrice: selectionData.totalPrice,
        }
      }
      return prev
    })
  }

  // #region 資料顯示選項
  // 步驟選項設定
  const steps = [
    { id: 1, title: '選擇場地與時間', active: true },
    { id: 2, title: '填寫付款資訊', completed: false },
    { id: 3, title: '完成訂單', completed: false },
  ]

  // 日期狀態設定
  const dateStatuses = {
    available: {
      label: '可預約',
      color: 'bg-green-100 text-green-800',
      clickable: true,
    },
    full: {
      label: '已額滿',
      color: 'bg-red-100 text-red-800',
      clickable: false,
    },
    closed: {
      label: '未開放',
      color: 'bg-gray-100 text-gray-500',
      clickable: false,
    },
  }

  // 生成帶狀態的日期資料 (使用固定的模式避免hydration錯誤)
  const generateDateWithStatus = () => {
    const today = new Date()
    const dateData = {}

    // 生成未來30天的資料
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]

      // 使用日期作為種子來決定狀態，確保每次都一樣
      const dayOfMonth = date.getDate()
      let status = 'available'
      let availableSlots = 5

      // 根據日期模式分配狀態
      if (dayOfMonth % 7 === 0) {
        status = 'closed'
        availableSlots = 0
      } else if (dayOfMonth % 5 === 0) {
        status = 'full'
        availableSlots = 0
      } else {
        status = 'available'
        availableSlots = Math.max(1, dayOfMonth % 8)
      }

      dateData[dateKey] = {
        date: date,
        status: status,
        availableSlots: availableSlots,
      }
    }

    return dateData
  }

  // 計算年份範圍
  const currentYear = new Date().getFullYear()
  const earliestYear = currentYear - 1
  const latestYear = currentYear + 2
  // #endregion 資料顯示選項

  // #region Markup
  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          {/* 步驟 */}
          <section>
            <Step
              steps={steps}
              orientation="horizontal"
              onStepClick={(step, index) => console.log('Clicked step:', step)}
            />
          </section>

          <section className="flex flex-col lg:flex-row gap-6">
            {/* 訂單選擇 */}
            <section className="flex-1 lg:flex-2 min-w-0 flex flex-col gap-6">
              {/* 選擇場館與運動 */}
              <section>
                <h2 className="text-xl font-semibold mb-4">選擇場館與運動</h2>
                <div className="flex flex-col lg:flex-row gap-2">
                  <div className="space-y-2 flex-1">
                    <Label>地區</Label>
                    <Select value={locationId} onValueChange={setLocationId}>
                      <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
                        <SelectValue placeholder="全部地區" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.length === 0 ? (
                          <div className="px-3 py-2 text-gray-400">
                            沒有符合資料
                          </div>
                        ) : (
                          locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id.toString()}>
                              {loc.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>中心</Label>
                    <Select value={centerId} onValueChange={setCenterId}>
                      <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
                        {centers.length === 0 ? (
                          <SelectValue placeholder="沒有符合資料" />
                        ) : (
                          <SelectValue placeholder="請選擇中心" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {centers.length === 0 ? (
                          <div className="px-3 py-2 text-gray-400">
                            沒有符合資料
                          </div>
                        ) : (
                          centers.map((center) => (
                            <SelectItem
                              key={center.id}
                              value={center.id.toString()}
                            >
                              {center.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex-1">
                    <Select value={sportId} onValueChange={setSportId}>
                      <Label>運動</Label>
                      <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
                        <SelectValue placeholder="請選擇運動" />
                      </SelectTrigger>
                      <SelectContent>
                        {data &&
                        data.centerSports &&
                        data.centerSports.length === 0 ? (
                          <div className="px-3 py-2 text-gray-400">
                            沒有符合資料
                          </div>
                        ) : (
                          data &&
                          data.centerSports &&
                          data.centerSports.map((cs) => (
                            <SelectItem
                              key={cs.sportId}
                              value={cs.sportId.toString()}
                            >
                              {cs.sport.name || cs.sport.id}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>
              {/* 選擇預約日期 */}
              <section>
                <h2 className="text-xl font-semibold mb-4">選擇預約日期</h2>
                {isLoaded ? (
                  <CalendarProvider
                    dateData={dateData}
                    dateStatuses={dateStatuses}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                  >
                    <CalendarDate>
                      <CalendarDatePicker>
                        <CalendarYearPicker
                          end={latestYear}
                          start={earliestYear}
                        />
                        <CalendarMonthPicker />
                      </CalendarDatePicker>
                      <CalendarDatePagination />
                    </CalendarDate>
                    <CalendarHeader />
                    <CalendarBody
                      dateData={dateData}
                      dateStatuses={dateStatuses}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                    />
                  </CalendarProvider>
                ) : (
                  <div className="bg-card border rounded-lg p-6">
                    <SimpleLoadingText message="載入日曆資料中..." />
                  </div>
                )}
              </section>
              {/* 選擇場地與時段 */}
              <section>
                <h2 className="text-xl font-semibold mb-4">選擇場地與時段</h2>
                <TimeSlotTable
                  courtTimeSlots={courtTimeSlots}
                  onSelectionChange={handleTimeSlotSelection}
                />
              </section>
            </section>

            {/* 訂單確認 */}
            <section className="flex-1 lg:max-w-sm xl:max-w-md min-w-0 w-full">
              <h2 className="text-xl font-semibold mb-4">您的訂單</h2>
              {/* 訂單摘要卡片 */}
              <Card>
                <CardHeader>
                  {/* 預約圖片 */}
                  <div className="overflow-hidden rounded-lg">
                    <AspectRatio ratio={4 / 3} className="bg-muted">
                      {data && data.images && (
                        <Image
                          alt={data.name}
                          className="object-cover"
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 320px"
                          src={getCenterImageUrl(data.images[0])}
                        />
                      )}
                    </AspectRatio>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 場館資訊 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      場館資訊
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {/* <div>地區: {orderSummary.location || '未選擇'}</div> */}
                      <div>中心: {orderSummary.center || '未選擇'}</div>
                      <div>運動: {orderSummary.sport || '未選擇'}</div>
                    </div>
                  </div>

                  {/* 預約日期 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      預約日期
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {orderSummary.selectedDate
                        ? orderSummary.selectedDate.toLocaleDateString(
                            'zh-TW',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              weekday: 'long',
                            }
                          )
                        : '未選擇'}
                    </div>
                  </div>

                  {/* 場地時段 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      場地時段
                    </h4>
                    {orderSummary.timeSlots.length > 0 ? (
                      <div className="space-y-2">
                        {orderSummary.timeSlots.map((slot, index) => (
                          <div
                            key={index}
                            className="text-sm text-muted-foreground bg-muted p-2 rounded"
                          >
                            <div className="font-medium">{slot.courtName}</div>
                            <div className="flex justify-between">
                              <span>{slot.timeRange}</span>
                              <span>NT$ {slot.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        未選擇
                      </div>
                    )}
                  </div>

                  {/* 總計 */}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">總計</span>
                      <span className="text-lg font-bold text-primary">
                        NT$ {orderSummary.totalPrice}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/venue/reservation/payment" className="w-full">
                    <Button size="lg" className="w-full">
                      預訂
                      <ClipboardCheck />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </section>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
