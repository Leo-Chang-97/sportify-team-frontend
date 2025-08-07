'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ClipboardCheck } from 'lucide-react'
import { FaXmark, FaCheck } from 'react-icons/fa6'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useVenue } from '@/contexts/venue-context'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  const { venueData } = useVenue()
  const [isSuccess, setIsSuccess] = useState(true)
  // 使用 context 中的訂單資料
  const orderSummary = venueData

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
          <div className="flex flex-col mx-auto md:max-w-screen-lg gap-6">
            {/* 訂單確認 */}
            <section>
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
                      {/* <div>地區: {orderSummary.location || '未選擇'}</div> */}
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

            {/* 訂單詳細 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">付款資訊</h2>
              {/* 訂單摘要卡片 */}
              <Card>
                <CardContent className="space-y-4">
                  <Table className="w-full table-fixed">
                    <TableBody className="divide-y divide-foreground">
                      <TableRow className="border-b border-card-foreground">
                        <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                          預訂人
                        </TableCell>
                        <TableCell
                          className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                          style={{ width: '100%' }}
                        >
                          {orderSummary.userInfo?.name || '未填寫'}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-card-foreground">
                        <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                          電話
                        </TableCell>
                        <TableCell
                          className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                          style={{ width: '100%' }}
                        >
                          {orderSummary.userInfo?.phone || '未填寫'}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-card-foreground">
                        <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                          Email
                        </TableCell>
                        <TableCell
                          className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                          style={{ width: '100%' }}
                        >
                          {orderSummary.userInfo?.email || '未填寫'}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-card-foreground">
                        <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                          付款方式
                        </TableCell>
                        <TableCell
                          className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                          style={{ width: '100%' }}
                        >
                          {orderSummary.paymentMethod || '未選擇'}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-card-foreground">
                        <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                          發票類型
                        </TableCell>
                        <TableCell
                          className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                          style={{ width: '100%' }}
                        >
                          {orderSummary.receiptType || '未選擇'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                          訂單金額
                        </TableCell>
                        <TableCell
                          className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                          style={{ width: '100%' }}
                        >
                          {`NT$${orderSummary.totalPrice}` || 'NT$0'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* 按鈕區 */}
            <section>
              <div className="flex justify-between">
                <Link href="/venue/order">
                  <Button variant="outline">查看訂單</Button>
                </Link>
                <Link href="/venue">
                  <Button variant="highlight">返回列表頁</Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
