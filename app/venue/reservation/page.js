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
import { Calendar } from '@/components/date-picker-calendar'

// 自訂元件
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
import { TimeSlotTable } from '@/components/timeslot-table'

export default function ReservationPage() {
  // #region 路由和URL參數
  const { venueData, setVenueData } = useVenue()

  // #region 組件狀態管理
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [errors, setErrors] = React.useState(null)

  const [locationId, setLocationId] = useState(
    venueData.locationId?.toString() || ''
  )
  const [centerId, setCenterId] = useState(venueData.centerId?.toString() || '')
  const [sportId, setSportId] = useState('')

  const [locations, setLocations] = useState([])
  const [centers, setCenters] = useState([])
  const [sports, setSports] = useState([])
  const [courtTimeSlots, setCourtTimeSlots] = useState([])
  const [date, setDate] = useState(null)
  const [monthlyAvailability, setMonthlyAvailability] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // 使用 context 來管理訂單摘要狀態
  const orderSummary = venueData
  const setOrderSummary = (updater) => {
    if (typeof updater === 'function') {
      setVenueData((prev) => updater(prev))
    } else {
      setVenueData(updater)
    }
  }

  // 計算 yearMonth 格式 (YYYY-MM) - 基於當前顯示的月份
  const yearMonth = currentMonth ? currentMonth.toISOString().slice(0, 7) : null

  // #region 副作用處理

  // #region Center資料
  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        setLoading(true)
        // await new Promise((r) => setTimeout(r, 3000)) // 延遲測試載入動畫
        const centerData = await fetchCenter(centerId)
        setData(centerData.record)
      } catch (err) {
        console.error('Error fetching center detail:', err)
        setErrors(err.message)
        toast.error('載入場館資料失敗')
      } finally {
        setLoading(false)
      }
    }

    if (centerId) {
      fetchCenterData()
    }
  }, [centerId])

  // #region 訂單摘要
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

  // #region 下拉選單
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

  // #region 中心、運動與日期篩選可選時段
  useEffect(() => {
    const loadData = async () => {
      try {
        let courtTimeSlotData
        if (centerId && sportId && date) {
          // 將選擇的日期轉換為 YYYY-MM-DD 格式
          const dateStr = date.toISOString().split('T')[0]
          courtTimeSlotData = await fetchCourtTimeSlotsByCenterAndSport(
            Number(centerId),
            Number(sportId),
            dateStr
          )
          // 從 API 回應中取得 rows，這些資料包含預約狀態
          setCourtTimeSlots(courtTimeSlotData.rows || [])
          console.log('載入的場地時段資料:', courtTimeSlotData)
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
  }, [centerId, sportId, date])

  // #region 獲取月份可預約數據
  useEffect(() => {
    const loadMonthlyData = async () => {
      try {
        if (centerId && sportId && yearMonth) {
          const monthlyData = await fetchAvailableCourtTimeSlotsByMonth(
            Number(centerId),
            Number(sportId),
            yearMonth
          )
          setMonthlyAvailability(monthlyData.rows || [])
          console.log('載入的月份可預約資料:', monthlyData)
        } else {
          setMonthlyAvailability([])
        }
      } catch (err) {
        console.error('載入月份可預約資料失敗:', err)
        setMonthlyAvailability([])
      }
    }
    loadMonthlyData()
  }, [centerId, sportId, yearMonth])

  // #region 事件處理函數

  // 獲取特定日期的可預約數量
  const getAvailableCount = (date) => {
    if (!date || !monthlyAvailability.length) return null

    const dateStr = date.toISOString().split('T')[0]
    const dayData = monthlyAvailability.find((day) => day.date === dateStr)
    return dayData ? dayData.availableCount : null
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
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate)
                    // 更新訂單摘要中的選擇日期
                    setOrderSummary((prev) => ({
                      ...prev,
                      selectedDate: selectedDate,
                    }))
                    console.log(selectedDate)
                  }}
                  className="bg-accent text-accent-foreground rounded [--cell-size:3.5rem]"
                  components={{
                    DayButton: ({ day, modifiers, ...props }) => {
                      const availableCount = getAvailableCount(day.date)
                      const hasData = centerId && sportId

                      return (
                        <button
                          {...props}
                          className={`
                            flex flex-col items-center justify-center w-full h-full p-1 text-sm
                            ${modifiers.selected ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}
                            ${modifiers.today ? 'bg-accent' : ''}
                            ${modifiers.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            rounded-md transition-colors
                          `}
                          disabled={modifiers.disabled}
                        >
                          <span className="font-medium">
                            {day.date.getDate()}
                          </span>
                          {hasData && availableCount !== null && (
                            <span
                              className={`text-xs ${
                                availableCount === 0
                                  ? 'text-red-500 font-medium'
                                  : 'text-green-600'
                              }`}
                            >
                              {availableCount === 0
                                ? '已額滿'
                                : `${availableCount}個`}
                            </span>
                          )}
                        </button>
                      )
                    },
                  }}
                />
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
