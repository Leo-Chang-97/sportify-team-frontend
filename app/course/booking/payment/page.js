'use client'

import React, { useState, useEffect } from 'react'
import { CreditCard } from 'lucide-react'
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
import PaymentMethodSelector, {
  paymentOptions,
} from '@/components/payment-method-selector'
import ReceiptTypeSelector, {
  receiptOptions,
} from '@/components/receipt-type-selector'

const steps = [
  { id: 1, title: '選擇課程', completed: true },
  { id: 2, title: '填寫付款資訊', active: true },
  { id: 3, title: '完成訂單', completed: false },
]

export default function CoursePaymentPage() {
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

  // 課程訂單摘要狀態
  const [orderSummary, setOrderSummary] = useState({
    courseName: '桌球基礎班',
    courseType: '團體課程',
    instructor: '王教練',
    duration: '一期十堂',
    schedule: '週二 18:30-20:00',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-04-08'),
    location: '體育館青少年A教室',
    students: 3, // 目前已報名人數
    unitPrice: 4800, // 單價
    totalPrice: 4800, // 總價（單人價格）
    courseImage: '/product-pic/volleyball-course.png',
    // 課程詳細資訊
    ageGroup: '中學-高中、國小中學年以上',
    maxStudents: 10, // 課程最大人數
    courseLevel: '初級',
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

  // 從 URL 參數讀取課程資訊
  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam))
        // 處理日期字串轉換為 Date 物件
        if (decodedData.startDate) {
          decodedData.startDate = new Date(decodedData.startDate)
        }
        if (decodedData.endDate) {
          decodedData.endDate = new Date(decodedData.endDate)
        }
        setOrderSummary((prev) => ({ ...prev, ...decodedData }))
      } catch (error) {
        console.error('解析課程資料失敗:', error)
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
                <CardContent className="flex flex-col gap-6 pt-6">
                  {/* 預訂人資料 */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">訂購人資料</Label>
                    <div className="space-y-2 grid gap-3">
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor="name">姓名</Label>
                        <Input
                          type="text"
                          id="name"
                          placeholder="請輸入姓名"
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
                          placeholder="09xxxxxxxx"
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
                          placeholder="example@email.com"
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
              </Card>
            </section>

            {/* 訂單確認 */}
            <section className="order-1 md:order-2 flex-1 w-full">
              <h2 className="text-xl font-semibold mb-4">課程訂單摘要</h2>

              {/* 訂單摘要卡片 */}
              <Card>
                <CardHeader>
                  {/* 課程圖片 */}
                  {orderSummary.courseImage && (
                    <div className="overflow-hidden rounded-lg">
                      <AspectRatio ratio={4 / 3} className="bg-muted">
                        <Image
                          alt={orderSummary.courseName}
                          className="object-cover"
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 320px"
                          src={orderSummary.courseImage}
                        />
                      </AspectRatio>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 課程資訊 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      課程資訊
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>課程名稱:</span>
                        <span className="font-medium">
                          {orderSummary.courseName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>課程類型:</span>
                        <span>{orderSummary.courseType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>授課教練:</span>
                        <span>{orderSummary.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>課程等級:</span>
                        <span>{orderSummary.courseLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* 上課時間 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      上課時間
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>上課時段:</span>
                        <span>{orderSummary.schedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>課程期間:</span>
                        <span>
                          {orderSummary.startDate?.toLocaleDateString('zh-TW')}{' '}
                          -{orderSummary.endDate?.toLocaleDateString('zh-TW')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>課程堂數:</span>
                        <span>{orderSummary.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* 上課地點 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      上課地點
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {orderSummary.location}
                    </div>
                  </div>

                  {/* 報名人數 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground">
                      報名人數
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>目前報名人數:</span>
                        <span className="font-medium">
                          {orderSummary.students} 人
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>剩餘名額:</span>
                        <span className="font-medium">
                          {orderSummary.maxStudents - orderSummary.students} 人
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 費用明細 */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>課程費用:</span>
                      <span>NT$ {orderSummary.unitPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">總計</span>
                      <span className="text-lg font-bold text-primary">
                        NT$ {orderSummary.totalPrice}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-3">
                  <Link href="/course/id" className="flex-1">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      返回上一頁
                    </Button>
                  </Link>
                  <Link
                    href={`/course/payment/success?data=${encodeURIComponent(
                      JSON.stringify({
                        ...orderSummary,
                        userInfo: formData,
                        ...getSelectedOptions(),
                      })
                    )}`}
                    className="flex-1"
                  >
                    <Button size="lg" className="w-full">
                      確認付款
                      <CreditCard />
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
