'use client'

// ===== 依賴項匯入 =====
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import {
  updateReservation,
  fetchReservations,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function EditReservationPage() {
  const params = useParams()
  const router = useRouter()
  const reservationId = params.id

  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)

  const [memberId, setMemberId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [centerId, setCenterId] = useState('')
  const [sportId, setSportId] = useState('')
  const [courtId, setCourtIds] = useState('')
  const [timePeriodId, setTimePeriodId] = useState('')
  const [timeSlotId, setTimeSlotIds] = useState('')
  const [courtTimeSlotId, setCourtTimeSlotIds] = useState('')
  const [statusId, setStatusId] = useState('')
  const [date, setDate] = useState('')
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
  const [originalReservation, setOriginalReservation] = useState(null)

  // ===== 載入預約資料 =====
  useEffect(() => {
    const loadReservationData = async () => {
      try {
        setIsDataLoading(true)
        const response = await fetchReservations({ id: reservationId })

        if (response?.rows && response.rows.length > 0) {
          const reservation = response.rows[0]
          console.log('載入的預約資料:', reservation) // 除錯用

          // 保存原始資料
          setOriginalReservation(reservation)

          // 基本欄位設置
          setMemberId(
            reservation.member?.id?.toString() ||
              reservation.memberId?.toString() ||
              ''
          )
          setDate(reservation.date || '')
          setPrice(reservation.price?.toString() || '')

          // 複雜關聯欄位 - 使用正確的資料結構
          setCourtIds(
            reservation.courtTimeSlot?.court?.id?.toString() ||
              reservation.courtId?.toString() ||
              ''
          )
          setTimeSlotIds(
            reservation.courtTimeSlot?.timeSlot?.id?.toString() ||
              reservation.timeSlotId?.toString() ||
              ''
          )
          setStatusId(
            reservation.statusId?.toString() ||
              reservation.status?.id?.toString() ||
              ''
          )

          // 篩選用欄位 - 從巢狀物件取得
          setLocationId(
            reservation.courtTimeSlot?.court?.center?.location?.id?.toString() ||
              ''
          )
          setCenterId(
            reservation.courtTimeSlot?.court?.centerId?.toString() || ''
          )
          setSportId(
            reservation.courtTimeSlot?.court?.sportId?.toString() || ''
          )
          setTimePeriodId(
            reservation.courtTimeSlot?.timeSlot?.timePeriodId?.toString() || ''
          )
        } else {
          toast.error('找不到預約資料')
          router.push('/admin/venue/reservation')
        }
      } catch (error) {
        console.error('載入預約資料失敗:', error)
        toast.error('載入預約資料失敗')
        router.push('/admin/venue/reservation')
      } finally {
        setIsDataLoading(false)
      }
    }

    if (reservationId) {
      loadReservationData()
    }
  }, [reservationId, router])

  // ===== 副作用處理 =====
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

  // ===== 當所有基本選項載入完成後，確保設置正確的值 =====
  useEffect(() => {
    if (originalReservation && members.length > 0 && status.length > 0) {
      // 重新確認基本欄位設置
      if (!memberId && originalReservation.member?.id) {
        setMemberId(originalReservation.member.id.toString())
      }
      if (!statusId && originalReservation.statusId) {
        setStatusId(originalReservation.statusId.toString())
      }

      // 設置篩選相關的欄位，這些會觸發載入相依選項
      if (!centerId && originalReservation.courtTimeSlot?.court?.centerId) {
        setCenterId(originalReservation.courtTimeSlot.court.centerId.toString())
      }
      if (!sportId && originalReservation.courtTimeSlot?.court?.sportId) {
        setSportId(originalReservation.courtTimeSlot.court.sportId.toString())
      }
      if (
        !timePeriodId &&
        originalReservation.courtTimeSlot?.timeSlot?.timePeriodId
      ) {
        setTimePeriodId(
          originalReservation.courtTimeSlot.timeSlot.timePeriodId.toString()
        )
      }
    }
  }, [
    originalReservation,
    members,
    status,
    memberId,
    statusId,
    centerId,
    sportId,
    timePeriodId,
  ])

  // ===== 重新設置原始預約資料值 =====
  useEffect(() => {
    // 這個 useEffect 現在主要處理會員和狀態的後備設置
    if (originalReservation && members.length > 0 && status.length > 0) {
      if (!memberId && originalReservation.member?.id) {
        setMemberId(originalReservation.member.id.toString())
      }
      if (!statusId && originalReservation.statusId) {
        setStatusId(originalReservation.statusId.toString())
      }
    }
  }, [originalReservation, members, status])

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
        let courtData
        if (centerId || sportId) {
          courtData = await fetchCourtOptions({
            centerId: centerId ? Number(centerId) : undefined,
            sportId: sportId ? Number(sportId) : undefined,
          })
        } else {
          courtData = await fetchCourtOptions()
        }
        setCourts(courtData.rows || [])
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCourts([])
        } else {
          setCourts([])
        }
      }
    }
    loadData()
  }, [centerId, sportId])

  // ===== 重新設置球場值 =====
  useEffect(() => {
    if (
      originalReservation &&
      courts.length > 0 &&
      !courtId &&
      originalReservation.courtTimeSlot?.court?.id
    ) {
      setCourtIds(originalReservation.courtTimeSlot.court.id.toString())
    }
  }, [originalReservation, courts, courtId])

  useEffect(() => {
    const loadData = async () => {
      try {
        let timeSlotData
        if (timePeriodId) {
          timeSlotData = await fetchTimeSlotOptions({
            timePeriodId: Number(timePeriodId),
          })
        } else {
          timeSlotData = await fetchTimeSlotOptions()
        }
        setTimeSlots(timeSlotData.rows || [])
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setTimeSlots([])
        } else {
          setTimeSlots([])
        }
      }
    }
    loadData()
  }, [timePeriodId])

  // ===== 重新設置時段值 =====
  useEffect(() => {
    if (
      originalReservation &&
      timeSlots.length > 0 &&
      !timeSlotId &&
      originalReservation.courtTimeSlot?.timeSlot?.id
    ) {
      setTimeSlotIds(originalReservation.courtTimeSlot.timeSlot.id.toString())
    }
  }, [originalReservation, timeSlots, timeSlotId])

  useEffect(() => {
    const loadData = async () => {
      try {
        let courtTimeSlotData
        if (courtId || timeSlotId) {
          courtTimeSlotData = await fetchCourtTimeSlotOptions({
            courtId: courtId ? Number(courtId) : undefined,
            timeSlotId: timeSlotId ? Number(timeSlotId) : undefined,
          })
        } else {
          courtTimeSlotData = await fetchCourtTimeSlotOptions()
        }
        setCourtTimeSlots(courtTimeSlotData.rows || [])
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCourtTimeSlots([])
        } else {
          setCourtTimeSlots([])
        }
      }
    }
    loadData()
  }, [courtId, timeSlotId])

  // ===== 事件處理函數 =====
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    // 根據 courtId 和 timeSlotId 組合出 courtTimeSlotId
    const selectedCourtTimeSlot = courtTimeSlots.find(
      (cts) =>
        cts.courtId?.toString() === courtId &&
        cts.timeSlotId?.toString() === timeSlotId
    )
    const courtTimeSlotIdToSend = selectedCourtTimeSlot?.id?.toString() || ''

    const submitData = {
      memberId,
      courtTimeSlotId: courtTimeSlotIdToSend,
      date,
      statusId,
      price,
    }

    try {
      const result = await updateReservation(reservationId, submitData)
      if (result.success) {
        toast.success('編輯預約成功！')
        router.push('/admin/venue/reservation')
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data
      ) {
        const result = error.response.data
        const errs = {}
        const shown = {}
        result.issues?.forEach((issue) => {
          const field = issue.path[0]
          if (shown[field]) return
          errs[field] = issue.message
          shown[field] = true
        })
        setErrors(errs)
        if (Object.keys(errs).length === 0) {
          toast.error(result.message || '輸入資料有誤')
        }
        return
      }
      toast.error('編輯預約失敗：' + (error.message || '未知錯誤'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/venue/reservation')
  }

  if (isDataLoading) {
    return (
      <SidebarProvider
        style={{
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        }}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="編輯預約" />
          <div className="flex flex-1 flex-col items-center justify-center">
            <p>載入中...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="編輯預約" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6">
              {/* 返回按鈕 */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回列表
                </Button>
              </div>

              {/* 表單卡片 */}
              <Card className="max-w-4xl mx-auto w-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    編輯預約
                  </CardTitle>
                  <CardDescription>修改預約資訊</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 使用者 */}
                      <div className="space-y-2">
                        <Label htmlFor="memberId">
                          使用者
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select value={memberId} onValueChange={setMemberId}>
                          <SelectTrigger
                            className={errors.memberId ? 'border-red-500' : ''}
                          >
                            <SelectValue placeholder="請選擇使用者" />
                          </SelectTrigger>
                          <SelectContent>
                            {members?.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400">
                                沒有符合資料
                              </div>
                            ) : (
                              members.map((member) => (
                                <SelectItem
                                  key={member.id}
                                  value={member.id.toString()}
                                >
                                  {`${member.id}-${member.name}` || member.id}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {errors.memberId && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.memberId}
                          </p>
                        )}
                      </div>

                      {/* 地區 */}
                      <div className="space-y-2">
                        <Label>地區</Label>
                        <Select
                          value={locationId}
                          onValueChange={setLocationId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="全部地區" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400">
                                沒有符合資料
                              </div>
                            ) : (
                              locations.map((loc) => (
                                <SelectItem
                                  key={loc.id}
                                  value={loc.id.toString()}
                                >
                                  {loc.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 中心 */}
                      <div className="space-y-2">
                        <Label>中心</Label>
                        <Select value={centerId} onValueChange={setCenterId}>
                          <SelectTrigger>
                            <SelectValue placeholder="全部中心" />
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

                      {/* 運動 */}
                      <div className="space-y-2">
                        <Label>運動</Label>
                        <Select value={sportId} onValueChange={setSportId}>
                          <SelectTrigger>
                            <SelectValue placeholder="全部運動" />
                          </SelectTrigger>
                          <SelectContent>
                            {sports.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400">
                                沒有符合資料
                              </div>
                            ) : (
                              sports.map((sport) => (
                                <SelectItem
                                  key={sport.id}
                                  value={sport.id.toString()}
                                >
                                  {sport.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 球場 */}
                      <div className="space-y-2">
                        <Label htmlFor="courtId">
                          球場
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select value={courtId} onValueChange={setCourtIds}>
                          <SelectTrigger
                            className={errors.courtId ? 'border-red-500' : ''}
                          >
                            <SelectValue placeholder="請選擇球場" />
                          </SelectTrigger>
                          <SelectContent>
                            {courts?.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400">
                                沒有符合資料
                              </div>
                            ) : (
                              courts.map((court) => (
                                <SelectItem
                                  key={court.id}
                                  value={court.id.toString()}
                                >
                                  {court.name || court.id}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {errors.courtId && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.courtId}
                          </p>
                        )}
                      </div>

                      {/* 日期 */}
                      <div className="space-y-2">
                        <Label htmlFor="date">
                          日期
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className={errors.date ? 'border-red-500' : ''}
                        />
                        {errors.date && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.date}
                          </p>
                        )}
                      </div>

                      {/* 時段區段 */}
                      <div className="space-y-2">
                        <Label>時段區段</Label>
                        <Select
                          value={timePeriodId}
                          onValueChange={setTimePeriodId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="全部時段區段" />
                          </SelectTrigger>
                          <SelectContent>
                            {timePeriods.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400">
                                沒有符合資料
                              </div>
                            ) : (
                              timePeriods.map((tp) => (
                                <SelectItem
                                  key={tp.id}
                                  value={tp.id.toString()}
                                >
                                  {tp.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 時段 */}
                      <div className="space-y-2">
                        <Label htmlFor="timeSlotId">
                          時段
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={timeSlotId}
                          onValueChange={setTimeSlotIds}
                        >
                          <SelectTrigger
                            className={
                              errors.timeSlotId ? 'border-red-500' : ''
                            }
                          >
                            <SelectValue placeholder="請選擇時段" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots?.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400">
                                沒有符合資料
                              </div>
                            ) : (
                              timeSlots.map((ts) => (
                                <SelectItem
                                  key={ts.id}
                                  value={ts.id.toString()}
                                >
                                  {ts.label}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {errors.timeSlotId && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.timeSlotId}
                          </p>
                        )}
                      </div>

                      {/* 價格 */}
                      <div className="space-y-2">
                        <Label>
                          價格<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="請輸入價格"
                          min="0"
                          step="1"
                          className={errors.price ? 'border-red-500' : ''}
                        />
                        {errors.price && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.price}
                          </p>
                        )}
                      </div>

                      {/* 狀態 */}
                      <div className="space-y-2">
                        <Label htmlFor="status">
                          狀態
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select value={statusId} onValueChange={setStatusId}>
                          <SelectTrigger
                            className={errors.statusId ? 'border-red-500' : ''}
                          >
                            <SelectValue placeholder="請選擇狀態" />
                          </SelectTrigger>
                          <SelectContent>
                            {status.map((sta) => (
                              <SelectItem
                                key={sta.id}
                                value={sta.id.toString()}
                              >
                                {sta.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.status && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.status}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 按鈕區域 */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        取消
                      </Button>
                      <Button
                        type="submit"
                        variant="default"
                        disabled={isLoading}
                      >
                        {isLoading ? '編輯中...' : '編輯預約'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
