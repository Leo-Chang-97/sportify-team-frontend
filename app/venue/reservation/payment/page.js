'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
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
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Input } from '@/components/ui/input'
import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemContent,
  ChoiceboxItemHeader,
  ChoiceboxItemIndicator,
  ChoiceboxItemSubtitle,
  ChoiceboxItemTitle,
} from '@/components/ui/choicebox'
import PaymentMethodSelector, {
  paymentOptions,
} from '@/components/payment-method-selector'
import ReceiptTypeSelector, {
  receiptOptions,
} from '@/components/receipt-type-selector'

import fakeData from '@/app/venue/fake-data.json'
const data = fakeData[0] // 使用第一筆資料

const steps = [
  { id: 1, title: '選擇場地與時間', completed: true },
  { id: 2, title: '填寫付款資訊', active: true },
  { id: 3, title: '完成訂單', completed: false },
]

export default function PaymentPage() {
  const searchParams = useSearchParams()

  // 付款和發票選項狀態
  const [selectedPayment, setSelectedPayment] = useState('1')
  const [selectedReceipt, setSelectedReceipt] = useState('1')

  // 用戶輸入資料狀態
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  })

  // 訂單摘要狀態
  const [orderSummary, setOrderSummary] = useState({
    location: '',
    center: '',
    sport: '',
    selectedDate: null,
    timeSlots: [],
    totalPrice: 0,
  })

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

  // 從 URL 參數讀取訂單資訊
  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam))
        // 處理日期字串轉換為 Date 物件
        if (decodedData.selectedDate) {
          decodedData.selectedDate = new Date(decodedData.selectedDate)
        }
        setOrderSummary(decodedData)
      } catch (error) {
        console.error('解析訂單資料失敗:', error)
      }
    }
  }, [searchParams])
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
                          className="w-full"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange('name', e.target.value)
                          }
                        />
                      </div>
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor="phone">電話</Label>
                        <Input
                          type="text"
                          id="phone"
                          placeholder="電話"
                          className="w-full"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange('phone', e.target.value)
                          }
                        />
                      </div>
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          placeholder="Email"
                          className="w-full"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange('email', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/* 付款方式 */}
                  <PaymentMethodSelector
                    selectedPayment={selectedPayment}
                    onPaymentChange={setSelectedPayment}
                  />
                  {/* 發票類型 */}
                  <ReceiptTypeSelector
                    selectedReceipt={selectedReceipt}
                    onReceiptChange={setSelectedReceipt}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Link
                    href={`/venue/reservation/success?data=${encodeURIComponent(
                      JSON.stringify({
                        ...orderSummary,
                        userInfo: formData,
                        ...getSelectedOptions(),
                      })
                    )}`}
                    className="w-full sm:w-auto"
                  >
                    <Button size="lg" className="w-full">
                      確認付款
                      <ClipboardCheck />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </section>
            {/* 訂單確認 */}
            <section className="order-1 md:order-2 flex-1 w-full">
              <h2 className="text-xl font-semibold mb-4">您的訂單</h2>

              {/* 訂單摘要卡片 */}
              <Card>
                <CardHeader>
                  {/* 預約圖片 */}
                  {data.image && (
                    <div className="overflow-hidden rounded-lg">
                      <AspectRatio ratio={4 / 3} className="bg-muted">
                        <Image
                          alt={data.name}
                          className="object-cover"
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 320px"
                          src={data.image}
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
                      <div>地區: {orderSummary.location || '未選擇'}</div>
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
              </Card>
            </section>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
