'use client'

// hooks
import { useState, useEffect, useMemo } from 'react'
import { useVenue } from '@/contexts/venue-context'

// utils
import { validateField, cn } from '@/lib/utils'
import { API_SERVER } from '@/lib/api-path'
import { toast } from 'sonner'
import { format } from 'date-fns'

// Icon
import { CreditCard } from 'lucide-react'

// API 請求
import { fetchCenter } from '@/api/venue/center'
import { getCenterImageUrl } from '@/api/venue/image'
import { createReservation } from '@/api/venue/reservation'

// next 元件
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'

// UI 元件
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// 自訂元件
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
import PaymentMethodSelector, {
  paymentOptions,
} from '@/components/payment-method-selector'
import ReceiptTypeSelector, {
  receiptOptions,
} from '@/components/receipt-type-selector'

export default function PaymentPage() {
  // #region 路由和URL參數
  const router = useRouter()

  // #region 狀態管理
  const [centerData, setCenterData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  const { venueData, setVenueData } = useVenue()
  const [centerId, setCenterId] = useState(venueData.centerId?.toString() || '')

  // 付款和發票選項狀態
  const [selectedPayment, setSelectedPayment] = useState('')
  const [selectedReceipt, setSelectedReceipt] = useState('')

  // 用戶輸入資料狀態
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carrierId: '', // 載具號碼
    companyId: '', // 統一編號
  })
  console.log('venueData', venueData)

  // ECPay 確認對話框狀態
  const [showEcpayDialog, setShowEcpayDialog] = useState(false)
  const [ecpayParams, setEcpayParams] = useState(null)

  // #region 副作用處理

  // #region Center資料
  useEffect(() => {
    console.log('centerId:', centerId)
    const fetchCenterData = async () => {
      try {
        setLoading(true)
        // await new Promise((r) => setTimeout(r, 3000)) // 延遲測試載入動畫
        const centerData = await fetchCenter(centerId)
        setCenterData(centerData.record)
        console.log('centerData', centerData)
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

  // #region 事件處理函數
  // 處理表單輸入變更
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 獲取選中的付款和發票選項
  const getSelectedOptions = () => {
    const selectedPaymentOption = paymentOptions.find(
      (opt) => opt.id === selectedPayment
    )
    const selectedReceiptOption = receiptOptions.find(
      (opt) => opt.id === selectedReceipt
    )

    return {
      paymentMethod: selectedPaymentOption?.label || '',
      receiptType: selectedReceiptOption?.label || '',
    }
  }

  // 處理下拉選單變更
  const handleSelectChange = (field, value, setter) => {
    setter(value)
    // 如果改變發票類型，清除相關欄位
    if (field === 'receipt') {
      setFormData((prev) => ({
        ...prev,
        carrierId: '',
        companyId: '',
      }))
    }
  }

  // #region 處理ECPay付款
  const handleEcpay = async (reservationId) => {
    try {
      // 暫時註解登入檢查，用於測試
      // if (!isAuthenticated || !user) {
      //   toast.error('請先登入')
      //   return
      // }

      // 檢查表單必填欄位
      if (
        !formData.name ||
        !formData.phone ||
        !selectedPayment ||
        !selectedReceipt
      ) {
        toast.error('請填寫完整的訂單資訊')
        return
      }

      // 準備商品名稱
      const itemsArray = venueData.timeSlots.map(
        (slot) => `場地:${slot.courtName} - 時間:${slot.timeRange}`
      )
      const items = itemsArray.join(',') // 例如 "場地A,場地B"
      const amount = venueData.totalPrice

      // 儲存 ECPay 參數到 state，供確認對話框使用
      setEcpayParams({
        amount,
        items,
        reservationId,
      })

      // 顯示確認對話框
      setShowEcpayDialog(true)
    } catch (error) {
      console.error('ECPay付款錯誤:', error)
      toast.error('付款過程發生錯誤，請稍後再試')
    }
  }

  // #region 處理ECPay確認付款
  const handleEcpayConfirm = () => {
    try {
      if (!ecpayParams) {
        toast.error('付款參數錯誤，請重新嘗試')
        return
      }

      const { amount, items, reservationId } = ecpayParams

      // 導向 ECPay，帶上 reservationId
      window.location.href = `${API_SERVER}/payment/ecpay-test?amount=${amount}&items=${encodeURIComponent(items)}&type=venue&reservationId=${reservationId}`
    } catch (error) {
      console.error('ECPay導向錯誤:', error)
      toast.error('付款導向發生錯誤，請稍後再試')
    }
  }

  // #region 處裡建立訂單
  const handleReservation = async () => {
    // e.preventDefault()
    setErrors({})
    setIsLoading(true)

    console.log('venueData.timeSlots 內容:', venueData.timeSlots) // 詳細除錯

    // 檢查 timeSlots 是否為空
    if (!venueData.timeSlots || venueData.timeSlots.length === 0) {
      toast.error('請選擇場地時段')
      setIsLoading(false)
      return false
    }

    // 準備 courtTimeSlotId 陣列 - 從 venueData.timeSlots 中提取 courtTimeSlotId
    const courtTimeSlotIds = []

    for (const slot of venueData.timeSlots) {
      console.log('處理時段:', slot) // 除錯

      if (slot.courtTimeSlotId) {
        const id = parseInt(slot.courtTimeSlotId)
        if (!isNaN(id)) {
          courtTimeSlotIds.push(id)
        } else {
          console.error('無效的 courtTimeSlotId:', slot.courtTimeSlotId)
          toast.error('場地時段 ID 格式錯誤')
          setIsLoading(false)
          return false
        }
      } else {
        console.error('缺少 courtTimeSlotId:', slot)
        toast.error('場地時段資料不完整')
        setIsLoading(false)
        return false
      }
    }

    if (courtTimeSlotIds.length === 0) {
      toast.error('沒有有效的場地時段')
      setIsLoading(false)
      return false
    }

    // 準備日期字串 - 轉換為 YYYY-MM-DD 格式
    const dateString = venueData.selectedDate
      ? format(venueData.selectedDate, 'yyyy-MM-dd')
      : null

    console.log(dateString)

    if (!dateString) {
      toast.error('請選擇預約日期')
      setIsLoading(false)
      return false
    }

    const reservationData = {
      memberId: 1,
      courtTimeSlotId: courtTimeSlotIds, // 使用處理過的 ID 陣列
      date: dateString, // 使用字串格式的日期
      statusId: 1,
      price: venueData.totalPrice,
      paymentId: parseInt(selectedPayment), // 轉換為數字
      invoiceId: parseInt(selectedReceipt), // 轉換為數字
      carrier: formData.carrierId || '', // 空字串而非 null
      tax: formData.companyId || '', // 空字串而非 null
    }

    console.log('發送訂單資料:', reservationData) // 除錯用

    try {
      const result = await createReservation(reservationData)
      if (result.success) {
        // const successMessage = '新增預約成功！'
        // toast.success(successMessage)
        console.log('訂單建立成功:', result) // 除錯用
        return { success: true, reservationId: result.insertId } // 回傳成功狀態和訂單ID
      } else {
        toast.error('建立訂單失敗: ' + (result.message || '未知錯誤'))
        console.error('訂單建立失敗:', result)
        return { success: false } // 回傳失敗狀態
      }
    } catch (error) {
      console.error('建立訂單錯誤:', error) // 除錯用
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
      } else {
        const errorMessage = '新增預約失敗：'
        toast.error(errorMessage + (error.message || '未知錯誤'))
      }
      return false // 返回失敗狀態
    } finally {
      setIsLoading(false)
    }
  }

  // #region 處理付款按鈕點擊
  const handlePayment = async () => {
    // 先執行驗證並獲取錯誤
    const newErrors = {}
    newErrors.name = validateField('name', formData.name || '', true)
    newErrors.phone = validateField('phone', formData.phone || '', true)
    newErrors.payment = validateField('payment', selectedPayment || '', true)
    newErrors.receipt = validateField('receipt', selectedReceipt || '', true)
    newErrors.carrierId = validateField(
      'carrierId',
      formData.carrierId || '',
      true,
      '',
      selectedReceipt
    )
    newErrors.companyId = validateField(
      'companyId',
      formData.companyId || '',
      true,
      '',
      selectedReceipt
    )

    setErrors(newErrors)

    // 檢查是否有任何錯誤
    const hasErrors = Object.values(newErrors).some((error) => error !== '')

    if (!hasErrors) {
      // 表單驗證通過，更新 context 包含用戶資料和付款資訊
      setVenueData({
        ...venueData,
        userInfo: formData,
        ...getSelectedOptions(),
      })

      // 先建立訂單
      const reservationResult = await handleReservation()

      if (reservationResult && reservationResult.success) {
        // 訂單建立成功，根據付款方式決定下一步
        const reservationId = reservationResult.reservationId

        if (selectedPayment === '1') {
          // ECPay綠界金流 - 導向付款頁面，傳入 reservationId
          await handleEcpay(reservationId)
        } else {
          // 其他付款方式 - 直接跳轉到成功頁面
          router.push('/venue/reservation/success')
        }
      }
      // 如果訂單建立失敗，handleReservation 內部已經處理錯誤訊息
    } else {
      // 表單驗證失敗，滾動到第一個錯誤欄位
      const errorFields = [
        { field: 'name', selector: '#name' },
        { field: 'phone', selector: '#phone' },
        { field: 'payment', selector: '[data-field="payment"]' },
        { field: 'receipt', selector: '[data-field="receipt"]' },
        { field: 'carrierId', selector: '#carrierId' },
        { field: 'companyId', selector: '#companyId' },
      ]

      // 找到第一個有錯誤的欄位並跳轉
      setTimeout(() => {
        for (const errorField of errorFields) {
          if (newErrors[errorField.field]) {
            const element = document.querySelector(errorField.selector)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              // 如果是輸入框，則聚焦
              const input = element.querySelector('input') || element
              if (input && input.focus) {
                input.focus()
              }
              break
            }
          }
        }
      }, 100) // 稍微延遲確保 DOM 更新完成
    }
  }

  // #region 資料顯示選項
  const steps = [
    { id: 1, title: '選擇場地與時間', completed: true },
    { id: 2, title: '填寫付款資訊', active: true },
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
          <section className="flex flex-col md:flex-row gap-6">
            {/* 付款流程 */}
            <section className="order-2 md:order-1 flex-2 w-full">
              <h2 className="text-xl font-semibold mb-4">付款方式</h2>
              <Card>
                <CardContent className="flex flex-col gap-6">
                  {/* 預訂人資料 */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">訂單人資料</Label>
                    <div className="space-y-2 grid gap-3">
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor="name">姓名</Label>
                        <Input
                          type="text"
                          id="name"
                          placeholder="姓名"
                          className={cn(
                            'w-full',
                            errors.name &&
                              'border-destructive focus:border-destructive focus:ring-destructive'
                          )}
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange('name', e.target.value)
                          }
                        />
                        {errors.name && (
                          <span className="text-destructive text-sm">
                            {errors.name}
                          </span>
                        )}
                      </div>
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor="phone">電話</Label>
                        <Input
                          type="text"
                          id="phone"
                          placeholder="電話"
                          className={cn(
                            'w-full',
                            errors.phone &&
                              'border-destructive focus:border-destructive focus:ring-destructive'
                          )}
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange('phone', e.target.value)
                          }
                        />
                        {errors.phone && (
                          <span className="text-destructive text-sm">
                            {errors.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* 付款方式 */}
                  <PaymentMethodSelector
                    selectedPayment={selectedPayment}
                    onPaymentChange={(value) =>
                      handleSelectChange('payment', value, setSelectedPayment)
                    }
                    options={[
                      paymentOptions[0],
                      paymentOptions[1],
                      paymentOptions[3],
                    ]}
                    errors={errors}
                  />

                  {/* 發票類型 */}
                  <ReceiptTypeSelector
                    selectedReceipt={selectedReceipt}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onReceiptChange={(value) =>
                      handleSelectChange('receipt', value, setSelectedReceipt)
                    }
                    errors={errors}
                  />
                </CardContent>
              </Card>
            </section>
            {/* 訂單確認 */}
            <section className="order-1 md:order-2 flex-1 w-full">
              <h2 className="text-xl font-semibold mb-4">您的訂單</h2>

              {/* 訂單摘要卡片 */}
              <Card>
                <CardHeader>
                  {/* 預約圖片 */}
                  {centerData && centerData.images && (
                    <div className="overflow-hidden rounded-lg">
                      <AspectRatio ratio={4 / 3} className="bg-muted">
                        <Image
                          alt={centerData.name}
                          className="object-cover"
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 320px"
                          src={getCenterImageUrl(centerData.images[0])}
                        />
                      </AspectRatio>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 場館資訊 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      場館資訊
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {/* <div>地區: {venueData.location || '未選擇'}</div> */}
                      <div>中心: {venueData.center || '未選擇'}</div>
                      <div>運動: {venueData.sport || '未選擇'}</div>
                    </div>
                  </div>

                  {/* 預約日期 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      預約日期
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {venueData.selectedDate
                        ? venueData.selectedDate.toLocaleDateString('zh-TW', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long',
                          })
                        : '未選擇'}
                    </div>
                  </div>

                  {/* 場地時段 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      場地時段
                    </h4>
                    {venueData.timeSlots?.length > 0 ? (
                      <div className="space-y-2">
                        {venueData.timeSlots.map((slot, index) => (
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
                        NT$ {venueData.totalPrice || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button size="lg" className="w-full" onClick={handlePayment}>
                    確認付款
                    <CreditCard />
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </section>
        </div>
      </main>

      {/* ECPay 付款確認對話框 */}
      <AlertDialog open={showEcpayDialog} onOpenChange={setShowEcpayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認付款</AlertDialogTitle>
            <AlertDialogDescription>
              確認是否導向至 ECPay(綠界金流) 進行付款？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowEcpayDialog(false)
                setEcpayParams(null)
              }}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowEcpayDialog(false)
                setEcpayParams(null)
                handleEcpayConfirm()
              }}
            >
              確認付款
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </>
  )
}
