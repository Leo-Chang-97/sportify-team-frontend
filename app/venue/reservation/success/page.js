'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ClipboardCheck } from 'lucide-react'
import { FaXmark, FaCheck } from 'react-icons/fa6'
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
import fakeData from '@/app/venue/fake-data.json'
const data = fakeData[0] // 使用第一筆資料
const steps = [
  { id: 1, title: '選擇場地與時間', completed: true },
  { id: 2, title: '填寫付款資訊', completed: true },
  { id: 3, title: '完成訂單', active: true },
]

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(true)
  // 訂單摘要狀態
  const [orderSummary, setOrderSummary] = useState({
    location: '',
    center: '',
    sport: '',
    selectedDate: null,
    timeSlots: [],
    totalPrice: 0,
    userInfo: {
      name: '',
      phone: '',
      email: '',
    },
    paymentMethod: '',
    receiptType: '',
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
          {/* 最後確認 */}
          <section className="flex flex-col gap-6">
            {/* 預訂成功訊息 */}
            <section>
              <div className="flex flex-col items-center gap-4 py-4 md:py-8">
                {isSuccess ? (
                  <>
                    <div className="rounded-full bg-highlight p-4">
                      <FaCheck className="text-4xl text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-accent">預訂成功</h2>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-highlight p-4">
                      <FaXmark className="text-4xl text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-accent">預訂失敗</h2>
                  </>
                )}
              </div>
            </section>

            {/* 訂單確認 */}
            <section className="w-full flex justify-center">
              <div className="w-full md:max-w-lg">
                <h2 className="text-xl font-semibold mb-4">您的訂單</h2>
                {/* 訂單摘要卡片 */}
                <Card>
                  <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
                    {/* 場館資訊 */}
                    <div className="space-y-2 order-2 md:order-1">
                      <h4 className="font-medium text-accent-foreground">
                        場館資訊
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>地區: {orderSummary.location || '未選擇'}</div>
                        <div>中心: {orderSummary.center || '未選擇'}</div>
                        <div>運動: {orderSummary.sport || '未選擇'}</div>
                      </div>
                    </div>
                    {data.image && (
                      <div className="w-full md:w-50 min-w-0 flex-shrink-0 overflow-hidden rounded-lg order-1">
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
                              <div className="font-medium">
                                {slot.courtName}
                              </div>
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
                        <span className="font-medium text-foreground">
                          總計
                        </span>
                        <span className="text-lg font-bold text-primary">
                          NT$ {orderSummary.totalPrice}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 訂單詳細 */}
            <section className="w-full flex justify-center">
              <div className="w-full md:max-w-lg">
                <h2 className="text-xl font-semibold mb-4">付款資訊</h2>
                {/* 訂單摘要卡片 */}
                <Card>
                  <CardContent className="space-y-4">
                    {/* 訂單人資料 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-accent-foreground">
                        訂單人資料
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          姓名: {orderSummary.userInfo?.name || '未填寫'}
                        </div>
                        <div>
                          電話: {orderSummary.userInfo?.phone || '未填寫'}
                        </div>
                        <div>
                          Email: {orderSummary.userInfo?.email || '未填寫'}
                        </div>
                      </div>
                    </div>

                    {/* 付款方式 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-accent-foreground">
                        付款方式
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        {orderSummary.paymentMethod || '未選擇'}
                      </div>
                    </div>

                    {/* 發票類型 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-accent-foreground">
                        發票類型
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        {orderSummary.receiptType || '未選擇'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end mt-10">
                  <Link href="/venue" className="w-full sm:w-auto">
                    <Button variant="highlight" size="lg" className="w-full">
                      返回場館列表
                      <ClipboardCheck />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
