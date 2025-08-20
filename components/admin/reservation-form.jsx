'use client'

// hooks
import { useState, useEffect } from 'react'

// icons
import { ArrowLeft, ChevronDownIcon } from 'lucide-react'

// next 元件
import { useRouter } from 'next/navigation'

// API 請求
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
  fetchPaymentOptions,
  fetchInvoiceOptions,
} from '@/api'

// UI 元件
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'

export default function ReservationForm({
  mode = 'add', // 'add' 或 'edit'
  reservationId = null,
  title,
  description,
  submitButtonText,
  loadingButtonText,
}) {
  const router = useRouter()

  // #region 狀態管理
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(mode === 'edit')
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)
  const [memberSearch, setMemberSearch] = useState('')

  const [memberId, setMemberId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [centerId, setCenterId] = useState('')
  const [sportId, setSportId] = useState('')
  const [courtId, setCourtIds] = useState('')
  const [timePeriodId, setTimePeriodId] = useState('')
  const [timeSlotId, setTimeSlotIds] = useState('')
  const [courtTimeSlotId, setCourtTimeSlotIds] = useState('')
  const [statusId, setStatusId] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [invoiceId, setInvoiceId] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [invoiceTaxId, setInvoiceTaxId] = useState('')
  const [invoiceCarrier, setInvoiceCarrier] = useState('')
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
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])

  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)

  // #region 副作用處理

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

        const paymentData = await fetchPaymentOptions()
        setPayments(paymentData.rows || [])

        const invoiceData = await fetchInvoiceOptions()
        setInvoices(invoiceData.rows || [])
      } catch (error) {
        console.error('載入球場/時段失敗:', error)
        toast.error('載入球場/時段失敗')
      }
    }
    loadData()
  }, [])

  // ===== 載入現有預約資料（僅編輯模式） =====
  useEffect(() => {
    if (mode !== 'edit' || !reservationId) {
      setIsDataLoading(false)
      return
    }

    const loadReservationData = async () => {
      try {
        setIsDataLoading(true)
        const reservationData = await fetchReservation(reservationId)

        if (reservationData.success && reservationData.record) {
          const data = reservationData.record
          console.log('預約資料:', data)

          // 設定表單資料
          setMemberId(data.memberId?.toString() || '')
          setLocationId(
            data.courtTimeSlot?.court?.center?.locationId?.toString() || ''
          )
          setCenterId(data.courtTimeSlots[0].centerId?.toString() || '')
          setSportId(data.courtTimeSlots[0].sportId?.toString() || '')
          setTimePeriodId(
            data.courtTimeSlot?.timeSlot?.timePeriodId?.toString() || ''
          )
          setCourtIds(data.courtTimeSlot?.courtId?.toString() || '')
          setTimeSlotIds(data.courtTimeSlot?.timeSlotId?.toString() || '')
          setCourtTimeSlotIds(data.courtTimeSlotId?.toString() || '')
          setStatusId(data.statusId?.toString() || '')
          setPaymentId(data.paymentId?.toString() || '')
          setInvoiceId(data.invoiceId?.toString() || '')
          setInvoiceNumber(data.invoiceNumber || '')
          setInvoiceTaxId(data.tax || '')
          setInvoiceCarrier(data.carrier || '')
          setPrice(data.price?.toString() || '')

          // 設定日期
          if (data.date) {
            setDate(new Date(data.date))
          }

          // 標記初始資料已設定
          setIsInitialDataSet(true)
        } else {
          console.log('API 回應格式不正確或沒有資料:', reservationData)
        }
      } catch (error) {
        console.error('載入預約資料失敗:', error)
        toast.error('載入預約資料失敗')
        router.push('/admin/venue/reservation')
      } finally {
        setIsDataLoading(false)
      }
    }

    loadReservationData()
  }, [mode, reservationId, router])

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
          !centerData.rows?.some(
            (center) => center.id.toString() === centerId
          ) &&
          !isDataLoading
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
  }, [locationId, centerId, isDataLoading])

  useEffect(() => {
    const loadData = async () => {
      try {
        let courtData
        // 在初始載入時或者新增模式，載入所有球場選項
        if (isDataLoading || mode === 'add') {
          if (mode === 'add') {
            // 新增模式：根據條件篩選
            if (centerId || sportId) {
              courtData = await fetchCourtOptions({
                centerId: centerId ? Number(centerId) : undefined,
                sportId: sportId ? Number(sportId) : undefined,
              })
            } else {
              courtData = await fetchCourtOptions()
            }
          } else {
            // 編輯模式初始載入：載入所有選項
            courtData = await fetchCourtOptions()
          }
        } else if (centerId || sportId) {
          courtData = await fetchCourtOptions({
            centerId: centerId ? Number(centerId) : undefined,
            sportId: sportId ? Number(sportId) : undefined,
          })
        } else {
          courtData = await fetchCourtOptions()
        }

        const newCourts = courtData.rows || []
        setCourts(newCourts)

        // 新增模式：只有在條件變動時且當前選擇不在新選項中才清空
        if (mode === 'add' && courtId) {
          const currentCourtExists = newCourts.some(
            (court) => court.id.toString() === courtId
          )
          if (!currentCourtExists) {
            setCourtIds('')
          }
        } else if (
          mode === 'edit' &&
          isInitialDataSet &&
          !isDataLoading &&
          courtId
        ) {
          // 編輯模式：只有在初始資料設定完成且不是載入中才檢查
          const currentCourtExists = newCourts.some(
            (court) => court.id.toString() === courtId
          )
          if (!currentCourtExists) {
            setCourtIds('')
          }
        }
      } catch (err) {
        setCourts([])
      }
    }
    loadData()
  }, [centerId, sportId, isDataLoading, isInitialDataSet, mode])

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
        if (
          timeSlotId &&
          !timeSlotData.rows?.some(
            (timeSlot) => timeSlot.id.toString() === timeSlotId
          ) &&
          !isDataLoading
        ) {
          setTimeSlotIds('')
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setTimeSlots([])
        } else {
          setTimeSlots([])
        }
      }
    }
    loadData()
  }, [timePeriodId, timeSlotId, isDataLoading])

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

  // #region 事件處理函數
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
      date: date ? date.toISOString().slice(0, 10) : '',
      statusId,
      paymentId,
      invoiceId,
      invoiceNumber: invoiceNumber || null,
      tax: invoiceTaxId || null,
      carrier: invoiceCarrier || null,
      price,
    }

    try {
      let result
      if (mode === 'edit') {
        result = await updateReservation(reservationId, submitData)
      } else {
        result = await createReservation(submitData)
      }

      if (result.success) {
        const successMessage =
          mode === 'edit' ? '修改預約成功！' : '新增預約成功！'
        toast.success(successMessage)
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
      const errorMessage = mode === 'edit' ? '修改預約失敗：' : '新增預約失敗：'
      toast.error(errorMessage + (error.message || '未知錯誤'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/venue/reservation')
  }

  // #region 頁面渲染
  return (
    <Card className="max-w-4xl mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isDataLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-lg">載入中...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-6">
              {/* 使用者 */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="memberId">
                  使用者
                  <span className="text-red-500">*</span>
                </Label>
                {/* 搜尋使用者 */}
                <Input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="搜尋使用者"
                  className="w-auto"
                />
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
                      (() => {
                        const filtered = members.filter((member) =>
                          `${member.id}-${member.name}`
                            .toLowerCase()
                            .includes(memberSearch.toLowerCase())
                        )
                        const selectedMember = memberId
                          ? members.find((m) => m.id.toString() === memberId)
                          : null
                        const selectedInFiltered = filtered.some(
                          (m) => m.id.toString() === memberId
                        )
                        return (
                          <>
                            {/* 若目前選到的 memberId 不在篩選結果，額外顯示 */}
                            {selectedMember && !selectedInFiltered && (
                              <SelectItem
                                value={selectedMember.id.toString()}
                                disabled
                              >
                                {`${selectedMember.id}-${selectedMember.name}`}
                              </SelectItem>
                            )}
                            {filtered.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400">
                                沒有符合資料
                              </div>
                            ) : (
                              filtered.map((member) => (
                                <SelectItem
                                  key={member.id}
                                  value={member.id.toString()}
                                >
                                  {`${member.id}-${member.name}` || member.id}
                                </SelectItem>
                              ))
                            )}
                          </>
                        )
                      })()
                    )}
                  </SelectContent>
                </Select>
                {errors.memberId && (
                  <p className="text-sm text-red-500 mt-1">{errors.memberId}</p>
                )}
              </div>

              {/* 地區 */}
              <div className="space-y-2">
                <Label>地區</Label>
                <Select value={locationId} onValueChange={setLocationId}>
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
                        <SelectItem key={loc.id} value={loc.id.toString()}>
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
                  <SelectTrigger
                    className={errors.sportId ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="請選擇運動" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports?.length === 0 ? (
                      <div className="px-3 py-2 text-gray-400">
                        沒有符合資料
                      </div>
                    ) : (
                      sports.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id.toString()}>
                          {sport.name || sport.id}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* 日期 */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="date">
                  日期
                  <span className="text-red-500">*</span>
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className={`w-48 justify-between font-normal${
                        !date ? ' text-gray-500' : ''
                      }`}
                    >
                      {date ? date.toLocaleDateString() : '請選擇預訂日期'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date)
                        setOpen(false)
                      }}
                      disabled={(date) => {
                        // 禁用今天之前的日期
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today
                      }}
                      className={
                        errors.date ? 'border border-red-500 rounded-md' : ''
                      }
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                )}
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
                      (() => {
                        // 編輯模式才需要檢查目前選中的球場是否在選項中
                        if (mode === 'edit') {
                          const selectedCourt = courtId
                            ? courts.find((c) => c.id.toString() === courtId)
                            : null
                          const selectedInOptions = courts.some(
                            (c) => c.id.toString() === courtId
                          )

                          return (
                            <>
                              {/* 若目前選到的 courtId 不在選項中，額外顯示 */}
                              {selectedCourt && !selectedInOptions && (
                                <SelectItem
                                  value={selectedCourt.id.toString()}
                                  disabled
                                >
                                  {selectedCourt.name || selectedCourt.id}{' '}
                                  (已載入)
                                </SelectItem>
                              )}
                              {courts.map((court) => (
                                <SelectItem
                                  key={court.id}
                                  value={court.id.toString()}
                                >
                                  {court.name || court.id}
                                </SelectItem>
                              ))}
                            </>
                          )
                        } else {
                          // 新增模式直接顯示所有選項
                          return courts.map((court) => (
                            <SelectItem
                              key={court.id}
                              value={court.id.toString()}
                            >
                              {court.name || court.id}
                            </SelectItem>
                          ))
                        }
                      })()
                    )}
                  </SelectContent>
                </Select>
                {errors.courtId && (
                  <p className="text-sm text-red-500 mt-1">{errors.courtId}</p>
                )}
              </div>

              {/* 時段區段 */}
              <div className="space-y-2">
                <Label>時段區段</Label>
                <Select value={timePeriodId} onValueChange={setTimePeriodId}>
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
                        <SelectItem key={tp.id} value={tp.id.toString()}>
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
                <Select value={timeSlotId} onValueChange={setTimeSlotIds}>
                  <SelectTrigger
                    className={errors.timeSlotId ? 'border-red-500' : ''}
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
                        <SelectItem key={ts.id} value={ts.id.toString()}>
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
                  className={`w-auto ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              {/* 付款方式 */}
              <div className="space-y-2">
                <Label htmlFor="payment">
                  付款方式<span className="text-red-500">*</span>
                </Label>
                <Select value={paymentId} onValueChange={setPaymentId}>
                  <SelectTrigger
                    className={errors.paymentId ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="請選擇付款方式" />
                  </SelectTrigger>
                  <SelectContent>
                    {payments.length === 0 ? (
                      <div className="px-3 py-2 text-gray-400">
                        沒有符合資料
                      </div>
                    ) : (
                      payments
                        .filter((item) => item.id && item.id !== '')
                        .map((item, idx) => (
                          <SelectItem
                            key={`payment-${item.id}-${idx}`}
                            value={item.id.toString()}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                {errors.paymentId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.paymentId}
                  </p>
                )}
              </div>

              {/* 發票類型 */}
              <div className="space-y-2">
                <Label htmlFor="invoice">
                  發票類型<span className="text-red-500">*</span>
                </Label>
                <Select value={invoiceId} onValueChange={setInvoiceId}>
                  <SelectTrigger
                    className={errors.invoiceId ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="請選擇發票類型" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices.length === 0 ? (
                      <div className="px-3 py-2 text-gray-400">
                        沒有符合資料
                      </div>
                    ) : (
                      invoices.map((item, idx) => (
                        <SelectItem
                          key={`invoice-${item.id}-${idx}`}
                          value={item.id.toString()}
                        >
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.invoiceId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.invoiceId}
                  </p>
                )}
              </div>

              {/* 發票詳細資訊欄位 */}
              {invoiceId === '3' && (
                <div className="space-y-2">
                  <Label htmlFor="invoiceCarrier">
                    載具號碼<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="invoiceCarrier"
                    type="text"
                    value={invoiceCarrier || ''}
                    onChange={(e) => setInvoiceCarrier(e.target.value)}
                    placeholder="請輸入載具號碼 (如手機條碼)"
                    className={errors.invoiceCarrier ? 'border-red-500' : ''}
                  />
                  {errors.invoiceCarrier && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.invoiceCarrier}
                    </p>
                  )}
                </div>
              )}

              {invoiceId === '2' && (
                <div className="space-y-2">
                  <Label htmlFor="invoiceTaxId">
                    統一編號<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="invoiceTaxId"
                    type="text"
                    value={invoiceTaxId || ''}
                    onChange={(e) => setInvoiceTaxId(e.target.value)}
                    placeholder="請輸入8位數統一編號"
                    className={errors.invoiceTaxId ? 'border-red-500' : ''}
                    maxLength={8}
                  />
                  {errors.invoiceTaxId && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.invoiceTaxId}
                    </p>
                  )}
                </div>
              )}

              {mode === 'edit' && (
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">發票號碼</Label>
                  <Input
                    id="invoiceNumber"
                    type="text"
                    value={invoiceNumber || ''}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="請輸入發票號碼"
                  />
                </div>
              )}

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
                      <SelectItem key={sta.id} value={sta.id.toString()}>
                        {sta.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.statusId && (
                  <p className="text-sm text-red-500 mt-1">{errors.statusId}</p>
                )}
              </div>
            </div>

            {/* 按鈕區域 */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading || isDataLoading}
              >
                取消
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={isLoading || isDataLoading}
              >
                {isLoading ? loadingButtonText : submitButtonText}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
