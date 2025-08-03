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

import datas from '../../datas.json'
const data = datas[0] // 使用第一筆資料

const steps = [
  { id: 1, title: '選擇場地與時間', completed: true },
  { id: 2, title: '填寫付款資訊', active: true },
  { id: 3, title: '完成訂單', completed: false },
]

// 付款選項組件
const CreditCardForm = () => (
  <div className="space-y-4 p-4 bg-accent/50 rounded-lg mt-3">
    <div className="grid grid-cols-1 gap-6">
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="cardNumber">信用卡號碼</Label>
        <Input
          type="text"
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          maxLength="19"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="expiry">有效期限</Label>
          <Input type="text" id="expiry" placeholder="MM/YY" maxLength="5" />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="cvv">安全碼</Label>
          <Input type="text" id="cvv" placeholder="123" maxLength="3" />
        </div>
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="cardName">持卡人姓名</Label>
        <Input type="text" id="cardName" placeholder="請輸入持卡人姓名" />
      </div>
    </div>
  </div>
)

const ATMForm = () => (
  <div className="space-y-4 p-4 bg-accent/50 rounded-lg mt-3">
    <div className="text-sm text-muted-foreground">
      <p className="font-medium mb-2">轉帳資訊：</p>
      <p>銀行代碼：822</p>
      <p>帳號：123456789012</p>
      <p>戶名：運動場地預約系統</p>
      <p className="text-orange-600 mt-2">
        ※ 請在完成轉帳後，保留轉帳明細供核對
      </p>
    </div>
  </div>
)

const paymentOptions = [
  {
    id: '1',
    label: '信用卡付款',
    subtitle: (
      <div>
        <Image
          src="/payment-pic/visa.svg"
          alt="信用卡圖示-visa"
          width={40}
          height={24}
          style={{ display: 'inline-block' }}
        />
        <Image
          src="/payment-pic/mastercard.svg"
          alt="信用卡圖示-mastercard"
          width={40}
          height={24}
          style={{ display: 'inline-block' }}
        />
        <Image
          src="/payment-pic/jcb.svg"
          alt="信用卡圖示-jcb"
          width={40}
          height={24}
          style={{ display: 'inline-block' }}
        />
      </div>
    ),
    component: <CreditCardForm />,
  },
  {
    id: '2',
    label: 'LINE Pay',
    subtitle: (
      <Image
        src="/payment-pic/linepay.svg"
        alt="LINE Pay"
        width={80}
        height={24}
        style={{ display: 'inline-block' }}
      />
    ),
    component: null, // 不顯示額外選項
  },
  {
    id: '3',
    label: 'Apple Pay',
    subtitle: (
      <Image
        src="/payment-pic/applepay.svg"
        alt="Apple Pay"
        width={80}
        height={24}
        style={{ display: 'inline-block' }}
      />
    ),
    component: null, // 不顯示額外選項
  },
  {
    id: '4',
    label: 'ATM轉帳',
    subtitle: '銀行轉帳付款',
    component: <ATMForm />,
  },
  {
    id: '5',
    label: '超商代碼',
    subtitle: '超商代碼繳費',
    component: null, // 不顯示額外選項
  },
]

// 發票選項組件
const CompanyReceiptForm = () => (
  <div className="space-y-4 p-4 bg-accent/50 rounded-lg mt-3">
    <div className="grid grid-cols-1 gap-3">
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="companyId">統一編號</Label>
        <Input
          type="text"
          id="companyId"
          placeholder="請輸入8位數統一編號"
          maxLength="8"
        />
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="companyName">公司名稱</Label>
        <Input type="text" id="companyName" placeholder="請輸入公司名稱" />
      </div>
    </div>
  </div>
)

const ElectronicCarrierForm = () => (
  <div className="space-y-4 p-4 bg-accent/50 rounded-lg mt-3">
    <div className="grid grid-cols-1 gap-3">
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="carrierId">載具號碼</Label>
        <Input
          type="text"
          id="carrierId"
          placeholder="請輸入載具號碼 (例：/XXXXXXX)"
        />
      </div>
    </div>
  </div>
)

const receiptOptions = [
  {
    id: '1',
    label: '一般發票',
    subtitle: '個人發票，無需額外資訊',
    component: null, // 不顯示額外選項
  },
  {
    id: '2',
    label: '統一編號',
    subtitle: '公司發票，需填寫統編',
    component: <CompanyReceiptForm />,
  },
  {
    id: '3',
    label: '電子載具',
    subtitle: '存入電子載具',
    component: <ElectronicCarrierForm />,
  },
]

export default function PaymentPage() {
  const searchParams = useSearchParams()

  // 付款和發票選項狀態
  const [selectedPayment, setSelectedPayment] = useState('1')
  const [selectedReceipt, setSelectedReceipt] = useState('1')

  // 訂單摘要狀態
  const [orderSummary, setOrderSummary] = useState({
    location: '',
    center: '',
    sport: '',
    selectedDate: null,
    timeSlots: [],
    totalPrice: 0,
  })

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
                        />
                      </div>
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor="phone">電話</Label>
                        <Input
                          type="text"
                          id="phone"
                          placeholder="電話"
                          className="w-full"
                        />
                      </div>
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          placeholder="Email"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  {/* 付款方式 */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      選擇付款方式
                    </Label>
                    <div className="space-y-2">
                      <Choicebox
                        value={selectedPayment}
                        onValueChange={setSelectedPayment}
                      >
                        {paymentOptions.map((option) => (
                          <div key={option.id}>
                            <ChoiceboxItem value={option.id}>
                              <ChoiceboxItemHeader>
                                <ChoiceboxItemTitle>
                                  {option.label}
                                  <ChoiceboxItemSubtitle>
                                    {option.subtitle}
                                  </ChoiceboxItemSubtitle>
                                </ChoiceboxItemTitle>
                              </ChoiceboxItemHeader>
                              <ChoiceboxItemContent>
                                <ChoiceboxItemIndicator />
                              </ChoiceboxItemContent>
                            </ChoiceboxItem>
                            {/* 動態顯示選中選項的組件 */}
                            {selectedPayment === option.id &&
                              option.component && (
                                <div className="md:ml-6">
                                  {option.component}
                                </div>
                              )}
                          </div>
                        ))}
                      </Choicebox>
                    </div>
                  </div>
                  {/* 發票類型 */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      選擇發票類型
                    </Label>
                    <div className="space-y-2">
                      <Choicebox
                        value={selectedReceipt}
                        onValueChange={setSelectedReceipt}
                      >
                        {receiptOptions.map((option) => (
                          <div key={option.id}>
                            <ChoiceboxItem value={option.id}>
                              <ChoiceboxItemHeader>
                                <ChoiceboxItemTitle>
                                  {option.label}
                                  <ChoiceboxItemSubtitle>
                                    {option.subtitle}
                                  </ChoiceboxItemSubtitle>
                                </ChoiceboxItemTitle>
                              </ChoiceboxItemHeader>
                              <ChoiceboxItemContent>
                                <ChoiceboxItemIndicator />
                              </ChoiceboxItemContent>
                            </ChoiceboxItem>
                            {/* 動態顯示選中選項的組件 */}
                            {selectedReceipt === option.id &&
                              option.component && (
                                <div className="md:ml-6">
                                  {option.component}
                                </div>
                              )}
                          </div>
                        ))}
                      </Choicebox>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Link
                    href={`/venue/reservation/success?data=${encodeURIComponent(JSON.stringify(orderSummary))}`}
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
