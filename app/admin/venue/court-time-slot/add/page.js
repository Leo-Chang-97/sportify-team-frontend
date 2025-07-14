// app/admin/venue/center/page.js
'use client'

// ===== 依賴項匯入 =====
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import useSWR from 'swr'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  fetchLocationOptions,
  fetchCenterOptions,
  fetchSportOptions,
  fetchCourtOptions,
  fetchTimeSlotOptions,
  fetchCourtTimeSlots,
  createCourtTimeSlot,
  updateCourtTimeSlot,
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
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'

export default function CourtTimeSlotPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()

  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [locationId, setLocationId] = useState('')
  const [centerId, setCenterId] = useState('')
  const [sportId, setSportId] = useState('')
  const [locations, setLocations] = useState([])
  const [centers, setCenters] = useState([])
  const [sports, setSports] = useState([])
  const [courts, setCourts] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    courtId: '',
    timeSlotId: '',
    price: '',
  })

  // ===== URL 參數處理 =====
  const queryParams = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries())
    return entries
  }, [searchParams])

  // ===== 數據獲取 =====
  const {
    data,
    isLoading: isDataLoading,
    error,
    mutate,
  } = useSWR(['courtTimeSlots', queryParams], async ([, params]) =>
    fetchCourtTimeSlots(params)
  )

  // ===== 副作用處理 =====
  useEffect(() => {
    const loadCourtsAndTimeSlots = async () => {
      try {
        const timeSlotData = await fetchTimeSlotOptions()
        setTimeSlots(timeSlotData.rows || [])
      } catch (error) {
        console.error('載入球場/時段失敗:', error)
        toast.error('載入球場/時段失敗')
      }
    }
    loadCourtsAndTimeSlots()
  }, [])

  // 載入地區、運動類型
  useEffect(() => {
    fetchLocationOptions().then((data) => setLocations(data.rows || []))
    fetchSportOptions().then((data) => setSports(data.rows || []))
  }, [])

  // locationId 變動時，載入對應 center
  useEffect(() => {
    if (locationId) {
      fetchCenterOptions({ locationId: Number(locationId) }).then((data) =>
        setCenters(data.rows || [])
      )
    } else {
      setCenters([])
      setCenterId('')
    }
  }, [locationId])

  // centerId, sportId 變動時，查 court
  useEffect(() => {
    if (centerId || sportId) {
      fetchCourtOptions({
        centerId: centerId ? Number(centerId) : undefined,
        sportId: sportId ? Number(sportId) : undefined,
      }).then((data) => setCourts(data.rows || []))
    } else {
      setCourts([])
    }
  }, [centerId, sportId])

  // ===== 事件處理函數 =====

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Debug: 送出前 log formData
    console.log('送出前 formData:', formData)

    // 清除之前的錯誤訊息
    setErrors({})

    setIsLoading(true)

    // 將 price 轉為數字，若為空字串則設 undefined
    const submitData = {
      ...formData,
      price: formData.price === '' ? undefined : Number(formData.price),
    }

    try {
      let result

      if (isEditMode && editingItem) {
        // 編輯模式
        result = await updateCourtTimeSlot(editingItem.id, submitData)
      } else {
        // 新增模式
        result = await createCourtTimeSlot(submitData)
      }

      console.log('API 回應:', result) // Debug 用

      if (result.success) {
        toast.success(isEditMode ? '編輯時段成功！' : '新增時段成功！')
        setFormData({ courtId: '', timeSlotId: '', price: '' })
        setIsEditMode(false)
        setEditingItem(null)
        mutate()
      } else {
        // 處理 zod 驗證錯誤
        const errs = {}
        const shown = {}

        result.issues?.forEach((issue) => {
          const field = issue.path[0]
          if (shown[field]) return // 避免重複顯示同欄位錯誤
          errs[field] = issue.message
          shown[field] = true
        })

        setErrors(errs)

        // 如果沒有特定欄位錯誤，則顯示一般錯誤訊息
        if (Object.keys(errs).length === 0) {
          toast.error(
            result.message ||
              (isEditMode
                ? '編輯場地失敗，請稍後再試'
                : '新增場地失敗，請稍後再試')
          )
        }
      }
    } catch (error) {
      console.error(isEditMode ? '編輯場地失敗:' : '新增場地失敗:', error)
      // 根據不同的錯誤類型顯示不同的訊息
      if (
        error.message.includes('network') ||
        error.message.includes('fetch')
      ) {
        toast.error('網路連線錯誤，請檢查網路狀態')
      } else if (error.message.includes('400')) {
        toast.error('輸入資料有誤，請檢查後重試')
      } else if (error.message.includes('500')) {
        toast.error('伺服器錯誤，請稍後再試')
      } else {
        toast.error(
          (isEditMode ? '編輯時段失敗：' : '新增時段失敗：') +
            (error.message || '未知錯誤')
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ courtId: '', timeSlotId: '', price: '' })
    setErrors({}) // 清除錯誤訊息
    setIsEditMode(false)
    setEditingItem(null)
  }

  // ===== 載入和錯誤狀態處理 =====
  if (isDataLoading) return <p>載入中...</p>
  if (error) return <p>載入錯誤：{error.message}</p>

  // ===== Debug 資料格式 =====
  /* console.log('完整資料:', data)
  console.log('資料結構:', JSON.stringify(data, null, 2))
  if (data?.rows && data.rows.length > 0) {
    console.log('第一筆資料:', data.rows[0])
    console.log('第一筆資料的 keys:', Object.keys(data.rows[0]))
  } */

  // ===== 頁面渲染 =====
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Court Time Slot" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex justify-center gap-4 py-4 md:gap-6 md:py-6">
              <Card className="w-full max-w-lg">
                <CardHeader>
                  <CardTitle>{isEditMode ? '編輯時段' : '新增時段'}</CardTitle>
                  <CardDescription>請填寫以下資訊</CardDescription>
                  <CardAction></CardAction>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-1">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="courtId">
                          球場
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={locationId}
                          onValueChange={setLocationId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="請選擇地區" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem
                                key={loc.id}
                                value={loc.id.toString()}
                              >
                                {loc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={centerId} onValueChange={setCenterId}>
                          <SelectTrigger>
                            <SelectValue placeholder="請選擇中心" />
                          </SelectTrigger>
                          <SelectContent>
                            {centers.map((center) => (
                              <SelectItem
                                key={center.id}
                                value={center.id.toString()}
                              >
                                {center.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={sportId} onValueChange={setSportId}>
                          <SelectTrigger>
                            <SelectValue placeholder="請選擇運動類型" />
                          </SelectTrigger>
                          <SelectContent>
                            {sports.map((sport) => (
                              <SelectItem
                                key={sport.id}
                                value={sport.id.toString()}
                              >
                                {sport.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={formData.courtId}
                          onValueChange={(value) =>
                            handleInputChange('courtId', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="請選擇球場" />
                          </SelectTrigger>
                          <SelectContent>
                            {courts.map((court) => (
                              <SelectItem
                                key={court.id}
                                value={court.id.toString()}
                              >
                                {court.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.courtId && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.courtId}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeSlotId">
                          時段
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.timeSlotId}
                          onValueChange={(value) =>
                            handleInputChange('timeSlotId', value)
                          }
                        >
                          <SelectTrigger
                            className={
                              errors.timeSlotId ? 'border-red-500' : ''
                            }
                          >
                            <SelectValue placeholder="請選擇時段" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem
                                key={slot.id}
                                value={slot.id.toString()}
                              >
                                {slot.startTime}~{slot.endTime}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.timeSlotId && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.timeSlotId}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeSlotId">
                          價格
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={
                            formData.price === undefined ? '' : formData.price
                          }
                          onChange={(e) =>
                            handleInputChange('price', e.target.value)
                          }
                          placeholder="請輸入價格"
                          className={errors.price ? 'border-red-500' : ''}
                          min="0"
                          step="1"
                        />
                        {errors.price && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.price}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      variant="default"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? isEditMode
                          ? '編輯中...'
                          : '新增中...'
                        : isEditMode
                          ? '編輯時段'
                          : '新增時段'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      取消
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex-col gap-2"></CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
