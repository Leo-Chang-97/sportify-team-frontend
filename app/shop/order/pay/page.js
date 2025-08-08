'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
import { Input } from '@/components/ui/input'
import { getProductImageUrl } from '@/api/admin/shop/image'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import PaymentMethodSelector, {
  paymentOptions,
} from '@/components/payment-method-selector'
import ReceiptTypeSelector, {
  receiptOptions,
} from '@/components/receipt-type-selector'
import DeliveryMethodSelector, {
  DeliveryOptions,
} from '@/components/delivery-method-selector'
import { getCarts, getCheckoutData, checkout } from '@/api'
import { validateField } from '@/lib/utils'
import { toast } from 'sonner'
import { API_SERVER } from '@/lib/api-path'
import { useAuth } from '@/contexts/auth-context'

const steps = [
  { id: 1, title: '確認購物車', completed: true },
  { id: 2, title: '填寫付款資訊', active: true },
  { id: 3, title: '完成訂單', completed: false },
]

export default function ProductListPage() {
  const searchParams = useSearchParams()
  // 暫時註解登入檢查，用於測試
  // const { user, isAuthenticated } = useAuth()

  // 測試用的會員ID - 之後要改回 useAuth
  const TEST_USER_ID = 1

  // 格式化價格，加上千分位逗號
  const formatPrice = (price) => {
    return Number(price).toLocaleString('zh-TW')
  }

  // ===== 組件狀態管理 =====
  const [selectedPayment, setSelectedPayment] = useState('')
  const [selectedReceipt, setSelectedReceipt] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState('')
  const [carts, setCarts] = useState([])
  const [formData, setFormData] = useState({
    recipient: '',
    phone: '',
    address: '',
    carrierId: '', // 載具號碼
    companyId: '', // 統一編號
  })
  const [errors, setErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({}) // 追蹤欄位是否已被觸碰（用於決定是否顯示驗證錯誤）

  // ===== 數據獲取 =====
  const {
    data: cartData,
    isLoading: isCartLoading,
    error: cartError,
    mutate,
  } = useSWR(['carts-checkout'], async () => {
    const result = await getCarts()
    return result
  })

  // 簡單驗證函數
  const validateField = (
    field,
    value,
    showFormatError = false,
    deliveryType = selectedDelivery
  ) => {
    switch (field) {
      case 'recipient':
        if (!value.trim()) return '收件人姓名為必填'
        return ''
      case 'phone':
        if (!value.trim()) return '手機號碼為必填'
        // 只有在明確要求顯示格式錯誤，或者值看起來像是完整輸入時才顯示格式錯誤
        if (
          showFormatError ||
          (value.length >= 10 && !/^09\d{8}$/.test(value))
        ) {
          if (!/^09\d{8}$/.test(value))
            return '手機號碼格式錯誤，請輸入09開頭的10位數字'
        }
        return ''
      case 'address':
        // 只有選擇宅配時才需要驗證地址
        if (deliveryType === '3') {
          if (!value.trim()) return '收件地址為必填'
          if (showFormatError && value.trim().length < 5)
            return '收件地址至少5個字'
        }
        return ''
      case 'delivery':
        return !value ? '請選擇配送方式' : ''
      case 'payment':
        return !value ? '請選擇付款方式' : ''
      case 'receipt':
        return !value ? '請選擇發票類型' : ''
      case 'carrierId':
        // 只有選擇電子載具時才需要驗證
        if (selectedReceipt === '3') {
          if (!value.trim()) return '載具號碼為必填'
          // 只有在明確要求或輸入看起來完整時才顯示格式錯誤
          if (
            showFormatError ||
            (value.length >= 8 && !/^\/[A-Z0-9.\-+]{7}$/.test(value))
          ) {
            if (!/^\/[A-Z0-9.\-+]{7}$/.test(value))
              return '載具號碼格式錯誤，請輸入正確格式 (例：/A12345B)'
          }
        }
        return ''
      case 'companyId':
        // 只有選擇統一編號時才需要驗證
        if (selectedReceipt === '2') {
          if (!value.trim()) return '統一編號為必填'
          // 只有在明確要求或輸入看起來完整時才顯示格式錯誤
          if (
            showFormatError ||
            (value.length >= 8 && !/^\d{8}$/.test(value))
          ) {
            if (!/^\d{8}$/.test(value)) return '統一編號格式錯誤，請輸入8位數字'
          }
        }
        return ''
      default:
        return ''
    }
  }

  // 計算總價和總數量
  const { totalPrice, itemCount, shippingFee } = useMemo(() => {
    const totalPrice = carts.reduce((sum, cartItem) => {
      return sum + cartItem.product.price * cartItem.quantity
    }, 0)
    const itemCount = carts.reduce(
      (sum, cartItem) => sum + cartItem.quantity,
      0
    )

    // 計算運費
    const selectedDeliveryOption = DeliveryOptions.find(
      (option) => option.id === selectedDelivery
    )
    const shippingFee = selectedDeliveryOption?.fee || 0

    return { totalPrice, itemCount, shippingFee }
  }, [carts, selectedDelivery])

  // ===== 載入選項 =====
  useEffect(() => {
    if (cartData?.data?.cart?.cartItems) {
      setCarts(cartData.data.cart.cartItems)
    }
  }, [cartData])

  // ===== 事件處理函數 =====
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 如果欄位已被觸碰過，才進行即時驗證
    if (touchedFields[field]) {
      const error = validateField(field, value, false)
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }))
    } else {
      // 清除可能存在的錯誤（例如必填錯誤）
      if (value.trim() && errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }))
      }
    }
  }

  // 處理輸入框失焦事件
  const handleInputBlur = (field, value) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }))

    // 失焦時進行完整驗證
    const error = validateField(field, value, true)
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }))
  }

  // 處理下拉選單變更
  const handleSelectChange = (field, value, setter) => {
    setter(value)

    // 標記為已觸碰並進行驗證
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }))

    const error = validateField(field, value, true)
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }))

    // 如果改變發票類型，清除相關欄位的錯誤和觸碰狀態
    if (field === 'receipt') {
      setErrors((prev) => ({
        ...prev,
        carrierId: '',
        companyId: '',
      }))
      setTouchedFields((prev) => ({
        ...prev,
        carrierId: false,
        companyId: false,
      }))
      // 清除相關欄位的值
      setFormData((prev) => ({
        ...prev,
        carrierId: '',
        companyId: '',
      }))
    }

    // 如果改變配送方式，清除地址相關的錯誤和觸碰狀態（如果不是宅配）
    if (field === 'delivery' && value !== '3') {
      setErrors((prev) => ({
        ...prev,
        address: '',
      }))
      setTouchedFields((prev) => ({
        ...prev,
        address: false,
      }))
      // 清除地址欄位的值
      setFormData((prev) => ({
        ...prev,
        address: '',
      }))
    }
  }

  // 獲取選中的付款和發票選項
  const getSelectedOptions = () => {
    const selectedPaymentOption = paymentOptions.find(
      (opt) => opt.id === selectedPayment
    )
    const selectedReceiptOption = receiptOptions.find(
      (opt) => opt.id === selectedReceipt
    )
    const selectedDeliveryOption = DeliveryOptions.find(
      (opt) => opt.id === selectedDelivery
    )

    return {
      paymentMethod: selectedPaymentOption?.label || '',
      receiptType: selectedReceiptOption?.label || '',
      deliveryMethod: selectedDeliveryOption?.label || '',
    }
  }

  // 驗證所有表單欄位
  const validateAllFields = () => {
    const newErrors = {}
    newErrors.recipient = validateField(
      'recipient',
      formData.recipient || '',
      true
    )
    newErrors.phone = validateField('phone', formData.phone || '', true)
    newErrors.address = validateField(
      'address',
      formData.address || '',
      true,
      selectedDelivery
    )
    newErrors.delivery = validateField('delivery', selectedDelivery || '', true)
    newErrors.payment = validateField('payment', selectedPayment || '', true)
    newErrors.receipt = validateField('receipt', selectedReceipt || '', true)
    newErrors.carrierId = validateField(
      'carrierId',
      formData.carrierId || '',
      true
    )
    newErrors.companyId = validateField(
      'companyId',
      formData.companyId || '',
      true
    )

    setErrors(newErrors)

    // 標記所有欄位為已觸碰
    setTouchedFields({
      recipient: true,
      phone: true,
      address: true,
      delivery: true,
      payment: true,
      receipt: true,
      carrierId: true,
      companyId: true,
    })

    // 檢查是否有任何錯誤
    return !Object.values(newErrors).some((error) => error !== '')
  }

  // 處理ECPay付款
  const handleEcpay = async () => {
    try {
      // 暫時註解登入檢查，用於測試
      // if (!isAuthenticated || !user) {
      //   toast.error('請先登入')
      //   return
      // }

      // 檢查是否有購物車資料
      if (!carts || carts.length === 0) {
        toast.error('購物車是空的，無法進行付款')
        return
      }

      // 檢查表單必填欄位
      if (
        !formData.recipient ||
        !formData.phone ||
        !selectedDelivery ||
        !selectedPayment ||
        !selectedReceipt
      ) {
        toast.error('請填寫完整的訂單資訊')
        return
      }

      // 準備商品名稱
      const itemsArray = carts.map(
        (cartItem) => `${cartItem.product.name}x${cartItem.quantity}`
      )
      const items = itemsArray.join(',')
      const amount = totalPrice + shippingFee

      if (window.confirm('確認要導向至ECPay(綠界金流)進行付款?')) {
        // 準備購物車項目資料（符合後端期望的格式）
        const cartItems = carts.map((cartItem) => ({
          productId: cartItem.product.id, // 使用 cartItem.product.id
          quantity: cartItem.quantity,
        }))

        // 先建立訂單到資料庫
        const orderData = {
          recipient: formData.recipient,
          phone: formData.phone,
          address: formData.address || '', // 如果不是宅配可能為空
          deliveryId: parseInt(selectedDelivery), // 轉換為數字
          paymentId: parseInt(selectedPayment), // 轉換為數字
          invoiceData: {
            invoiceId: parseInt(selectedReceipt), // 轉換為數字
            carrier: formData.carrierId || null,
            tax: formData.companyId || null,
          },
        }

        // 呼叫後端建立訂單，傳送會員ID、訂單資料和購物車項目
        const checkoutPayload = {
          memberId: TEST_USER_ID, // 使用測試用會員ID
          orderData: orderData,
          cartItems: cartItems,
        }

        // console.log('發送到後端的資料:', checkoutPayload) // 除錯用
        // console.log('表單資料狀態:', formData) // 檢查表單資料
        // console.log('選擇的選項:', {
        //   selectedDelivery,
        //   selectedPayment,
        //   selectedReceipt,
        // }) // 檢查選擇狀態

        const orderResult = await checkout(checkoutPayload)

        if (orderResult.success) {
          // 訂單建立成功，準備成功頁面資料並存到 localStorage
          const successData = {
            carts: carts,
            userInfo: formData,
            totalPrice: totalPrice + shippingFee,
            itemCount: itemCount,
            shippingFee: shippingFee,
            orderId: orderResult.data.id,
            ...getSelectedOptions(),
          }

          // 將訂單資料存到 localStorage (給綠界付款完成後使用)
          localStorage.setItem('ecpay_order_data', JSON.stringify(successData))
          // console.log('訂單資料已存入 localStorage:', successData)

          // 導向 ECPay
          window.location.href = `${API_SERVER}/payment/ecpay-test?amount=${amount}&items=${encodeURIComponent(items)}&type=shop&orderId=${orderResult.data.id || ''}`
        } else {
          toast.error('建立訂單失敗: ' + (orderResult.message || '未知錯誤'))
          console.error('訂單建立失敗:', orderResult)
        }
      }
    } catch (error) {
      console.error('ECPay付款錯誤:', error)
      toast.error('付款過程發生錯誤，請稍後再試')
    }
  }

  // 處理付款按鈕點擊
  const handlePayment = async () => {
    // 先執行驗證並獲取錯誤
    const newErrors = {}
    newErrors.recipient = validateField(
      'recipient',
      formData.recipient || '',
      true
    )
    newErrors.phone = validateField('phone', formData.phone || '', true)
    newErrors.address = validateField(
      'address',
      formData.address || '',
      true,
      selectedDelivery
    )
    newErrors.delivery = validateField('delivery', selectedDelivery || '', true)
    newErrors.payment = validateField('payment', selectedPayment || '', true)
    newErrors.receipt = validateField('receipt', selectedReceipt || '', true)
    newErrors.carrierId = validateField(
      'carrierId',
      formData.carrierId || '',
      true
    )
    newErrors.companyId = validateField(
      'companyId',
      formData.companyId || '',
      true
    )

    setErrors(newErrors)

    // 標記所有欄位為已觸碰
    setTouchedFields({
      recipient: true,
      phone: true,
      address: true,
      delivery: true,
      payment: true,
      receipt: true,
      carrierId: true,
      companyId: true,
    })

    // 檢查是否有任何錯誤
    const hasErrors = Object.values(newErrors).some((error) => error !== '')

    if (!hasErrors) {
      // 表單驗證通過，根據付款方式處理
      if (selectedPayment === '2') {
        // ECPay綠界金流
        await handleEcpay()
      } else {
        // 其他付款方式
        try {
          // 準備購物車項目資料
          const cartItems = carts.map((cartItem) => ({
            productId: cartItem.product.id,
            quantity: cartItem.quantity,
          }))

          // 建立訂單到資料庫
          const orderData = {
            recipient: formData.recipient,
            phone: formData.phone,
            address: formData.address || '', // 如果不是宅配可能為空
            deliveryId: parseInt(selectedDelivery), // 轉換為數字
            paymentId: parseInt(selectedPayment), // 轉換為數字
            invoiceData: {
              invoiceId: parseInt(selectedReceipt), // 轉換為數字
              carrier: formData.carrierId || null,
              tax: formData.companyId || null,
            },
          }

          // 呼叫後端建立訂單
          const checkoutPayload = {
            memberId: TEST_USER_ID, // 使用測試用會員ID
            orderData: orderData,
            cartItems: cartItems,
          }

          // console.log('發送到後端的資料 (貨到付款):', checkoutPayload)

          const orderResult = await checkout(checkoutPayload)

          if (orderResult.success) {
            // 訂單建立成功，準備成功頁面資料
            const successData = {
              carts: carts,
              userInfo: formData,
              totalPrice: totalPrice + shippingFee,
              itemCount: itemCount,
              shippingFee: shippingFee,
              orderId: orderResult.data.id,
              ...getSelectedOptions(),
            }

            // 導向成功頁面
            window.location.href = `/shop/order/success?data=${encodeURIComponent(JSON.stringify(successData))}`
          } else {
            toast.error('建立訂單失敗: ' + (orderResult.message || '未知錯誤'))
            console.error('訂單建立失敗:', orderResult)
          }
        } catch (error) {
          console.error('建立訂單錯誤:', error)
          toast.error('建立訂單過程發生錯誤，請稍後再試')
        }
      }
    } else {
      // 表單驗證失敗，滾動到第一個錯誤欄位
      const errorFields = [
        { field: 'recipient', selector: '#recipient' },
        { field: 'phone', selector: '#phone' },
        { field: 'address', selector: '#address' },
        { field: 'delivery', selector: '[data-field="delivery"]' },
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

  // 載入狀態處理
  if (isCartLoading) {
    return (
      <>
        <Navbar />
        <BreadcrumbAuto />
        <section className="px-4 md:px-6 py-10">
          <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
            <div className="text-center py-20">載入中...</div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  // 暫時註解登入狀態檢查，用於測試
  // if (!isAuthenticated) {
  //   return (
  //     <>
  //       <Navbar />
  //       <BreadcrumbAuto />
  //       <section className="px-4 md:px-6 py-10">
  //         <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
  //           <div className="text-center py-20 text-red-500">
  //             請先登入才能進行結帳
  //           </div>
  //         </div>
  //       </section>
  //       <Footer />
  //     </>
  //   )
  // }

  // 錯誤狀態處理
  if (cartError) {
    return (
      <>
        <Navbar />
        <BreadcrumbAuto />
        <section className="px-4 md:px-6 py-10">
          <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
            <div className="text-center py-20 text-red-500">
              載入失敗: {cartError.message}
            </div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <section className="px-4 md:px-6 py-10 ">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <Step
            steps={steps}
            orientation="horizontal"
            onStepClick={(step, index) => console.log('Clicked step:', step)}
          />
          <div className="bg-card rounded-lg p-6">
            <Table className="w-full table-fixed">
              <TableHeader className="border-b-2 border-card-foreground">
                <TableRow className="text-lg">
                  <TableHead className="font-bold w-1/2 text-accent-foreground">
                    商品名稱
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-accent-foreground">
                    單價
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-accent-foreground text-center">
                    數量
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-card-foreground">
                {carts && carts.length > 0 ? (
                  carts.map((cartItem) => {
                    // 處理圖片路徑
                    const product = cartItem.product
                    const imageFileName = product.images?.[0]?.url || ''

                    return (
                      <TableRow key={cartItem.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 overflow-hidden flex-shrink-0">
                              <Image
                                className="object-cover w-full h-full"
                                src={getProductImageUrl(imageFileName)}
                                alt={product.name}
                                width={40}
                                height={40}
                              />
                            </div>
                            <span className="text-base whitespace-normal text-accent-foreground">
                              {product.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-accent-foreground">
                          ${formatPrice(product.price)}
                        </TableCell>
                        <TableCell className="text-accent-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-12 text-center select-none">
                              {cartItem.quantity}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      購物車是空的
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="flex flex-col gap-6">
              {/* 收件人資料 */}
              <div className="space-y-3">
                <Label className="text-base font-medium">訂單人資料</Label>
                <div className="space-y-2 grid gap-3">
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="recipient">收件人</Label>
                    <Input
                      type="text"
                      id="recipient"
                      placeholder="請填寫收件人姓名"
                      className={`w-full ${errors.recipient ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                      value={formData.recipient || ''}
                      onChange={(e) =>
                        handleInputChange('recipient', e.target.value)
                      }
                      onBlur={(e) =>
                        handleInputBlur('recipient', e.target.value)
                      }
                    />
                    {errors.recipient && (
                      <span className="text-destructive text-sm">
                        {errors.recipient}
                      </span>
                    )}
                  </div>
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="phone">手機號碼</Label>
                    <Input
                      type="text"
                      id="phone"
                      placeholder="請填寫電話號碼(例：0912345678)"
                      className={`w-full ${errors.phone ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                      value={formData.phone || ''}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      onBlur={(e) => handleInputBlur('phone', e.target.value)}
                    />
                    {errors.phone && (
                      <span className="text-destructive text-sm">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* 物流方式 */}
              <div data-field="delivery">
                <DeliveryMethodSelector
                  selectedDelivery={selectedDelivery}
                  onDeliveryChange={(value) =>
                    handleSelectChange('delivery', value, setSelectedDelivery)
                  }
                  errors={errors}
                  formData={formData}
                  onInputChange={handleInputChange}
                  onInputBlur={handleInputBlur}
                />
              </div>
              {/* 付款方式 */}
              <div data-field="payment">
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
              </div>
              {/* 發票類型 */}
              <div data-field="receipt">
                <ReceiptTypeSelector
                  selectedReceipt={selectedReceipt}
                  formData={formData}
                  onInputChange={handleInputChange}
                  onInputBlur={handleInputBlur}
                  errors={errors}
                  onReceiptChange={(value) =>
                    handleSelectChange('receipt', value, setSelectedReceipt)
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {/* <Link
                  href={`/venue/reservation/success?data=${encodeURIComponent(JSON.stringify(orderSummary))}`}
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" className="w-full">
                    確認付款
                    <ClipboardCheck />
                  </Button>
                </Link> */}
              <div className="flex flex-col">
                <span className="text-base text-right p-2 text-muted-foreground">
                  共有{itemCount}件商品
                </span>
                <Table className="table-fixed flex justify-end">
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-base pr-10 text-accent-foreground">
                        商品金額
                      </TableCell>
                      <TableCell className="text-base font-bold text-accent-foreground">
                        ${formatPrice(totalPrice)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-b border-card-foreground">
                      <TableCell className="text-base pr-10 text-accent-foreground">
                        運費
                      </TableCell>
                      <TableCell className="text-base font-bold text-accent-foreground text-right">
                        ${formatPrice(shippingFee)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-base pr-10 text-accent-foreground">
                        商品小計
                      </TableCell>
                      <TableCell className="text-base font-bold text-accent-foreground">
                        ${formatPrice(totalPrice + shippingFee)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardFooter>
          </Card>
          <div className="flex justify-between">
            <Link href="/shop/order">
              <Button variant="outline" className="w-[120px]">
                返回購物車
              </Button>
            </Link>
            <Button
              variant="highlight"
              className="w-[120px]"
              onClick={handlePayment}
            >
              付款
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
