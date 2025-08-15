'use client'

import React, { useState, useEffect } from 'react'
import { FaXmark, FaCheck } from 'react-icons/fa6'
import { IconCircleCheckFilled, IconLoader } from '@tabler/icons-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'

const steps = [
  { id: 1, title: '選擇課程', completed: true },
  { id: 2, title: '填寫付款資訊', completed: true },
  { id: 3, title: '完成訂單', active: true },
]

export default function CourseSuccessPage() {
  const searchParams = useSearchParams()

  // 訂單資訊狀態
  const [orderData, setOrderData] = useState({
    // 課程資訊
    courseName: '桌球基礎班',
    courseType: '團體課程',
    instructor: '王教練',
    duration: '一期十堂',
    schedule: '週二 18:30-19:00',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-04-08'),
    location: '體育館青少年A教室',
    courseImage: '/course-pic/volleyball-course.png',

    // 訂單資訊
    orderNumber: '1234567890',
    orderDate: new Date(),
    totalPrice: 4800,

    // 用戶資訊
    userInfo: {
      name: '張美美',
      phone: '0912345678',
      email: 'example@email.com',
    },

    // 付款資訊
    paymentMethod: '線上付款',
    receiptType: '個人發票',
  })

  // 從 URL 參數讀取訂單資訊
  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam))
        // 處理日期字串轉換
        if (decodedData.startDate) {
          decodedData.startDate = new Date(decodedData.startDate)
        }
        if (decodedData.endDate) {
          decodedData.endDate = new Date(decodedData.endDate)
        }
        if (decodedData.orderDate) {
          decodedData.orderDate = new Date(decodedData.orderDate)
        }

        // 生成訂單編號（如果沒有的話）
        if (!decodedData.orderNumber) {
          decodedData.orderNumber = Date.now().toString()
        }

        setOrderData((prev) => ({ ...prev, ...decodedData }))
      } catch (error) {
        console.error('解析訂單資料失敗:', error)
      }
    }
  }, [searchParams])
  const summaries = [
    {
      key: '訂單編號',
      value: orderData.orderNumber || '未知',
    },
    {
      key: '預訂人',
      value: orderData.userInfo.name || '未知',
    },
    {
      key: '電話號碼',
      value: orderData.userInfo.phone || '未知',
    },
    {
      key: '建立時間',
      value: orderData.createdAt || '未知',
    },
    {
      key: '發票號碼',
      value: orderData?.invoiceNumber || '未知',
    },
    {
      key: '發票類型',
      value: (
        <>
          {orderData.receiptType || '未知'}
          {orderData.receiptType === 2 && (
            <span className="ml-2 text-muted-foreground">
              {orderData?.tax ? `${orderData.tax}` : ''}
            </span>
          )}
          {orderData.receiptType === 3 && (
            <span className="ml-2 text-muted-foreground">
              {orderData?.carrier ? `${orderData.carrier}` : ''}
            </span>
          )}
        </>
      ),
    },
    {
      key: '付款方式',
      value: orderData.paymentMethod || '未知',
    },
    {
      key: '狀態',
      value: (
        <>
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {orderData?.status?.name === '已付款' ? (
              <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
            ) : (
              <IconLoader />
            )}
            {orderData?.status?.name || '未知'}
          </Badge>
        </>
      ),
    },
    {
      key: '訂單金額',
      value: (
        <span className="text-lg font-bold text-primary">
          NT$ {orderData.totalPrice || '未知'}
        </span>
      ),
    },
  ]
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

          {/* 主要內容區域 */}
          <section>
            <div className="flex flex-col items-center gap-4 py-4 md:py-8">
              {/* 成功圖標和標題 */}
              <div className="rounded-full bg-highlight p-4">
                <FaCheck className="text-4xl text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-accent">已完成預訂</h2>
            </div>
          </section>
          <div className="mx-auto md:max-w-2xl gap-6">
            {/* 雙欄布局 */}
            <div className="flex flex-col gap-6">
              {/* 訂單詳情 */}
              <Card className="gap-0">
                <CardHeader>
                  <h2 className="text-lg font-semibold">訂單詳情</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Table className="w-full table-fixed">
                    {/* <TableCaption>
                        A list of your recent invoices.
                      </TableCaption> */}
                    <TableHeader>
                      {/* <TableRow>
                          <TableHead className="w-[100px]">Invoice</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow> */}
                    </TableHeader>
                    <TableBody>
                      {summaries.map((summary) => (
                        <TableRow
                          key={summary.key}
                          className="border-b border-muted-foreground/30"
                        >
                          <TableCell className="font-medium">
                            {summary.key}
                          </TableCell>
                          <TableCell className="text-right">
                            {summary.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    {/* <TableFooter>
                        <TableRow>
                          <TableCell colSpan={3}>Total</TableCell>
                          <TableCell className="text-right">
                            $2,500.00
                          </TableCell>
                        </TableRow>
                      </TableFooter> */}
                  </Table>
                </CardContent>
              </Card>
              {/* 左側：課程資訊 */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">課程資訊</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 課程圖片 */}
                  {orderData.courseImage && (
                    <div className="w-full min-w-0 flex-shrink-0 overflow-hidden rounded-lg">
                      <AspectRatio ratio={16 / 9} className="bg-muted">
                        <Image
                          alt={orderData.courseName}
                          className="object-cover rounded"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          src={orderData.courseImage}
                        />
                      </AspectRatio>
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">課程名稱:</span>
                      <span className="font-medium text-blue-600">
                        {orderData.courseName}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">授課教練:</span>
                      <span className="font-medium">
                        {orderData.instructor}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">開課日期:</span>
                      <span className="font-medium">
                        {orderData.startDate?.toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">上課時段:</span>
                      <span className="font-medium">{orderData.schedule}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 按鈕區域 */}
            <div className="flex justify-between gap-4 mt-8">
              <Link href="/course">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-white border-gray-300 hover:bg-gray-50"
                >
                  返回總覽
                </Button>
              </Link>
              <Link href="/member/orders">
                <Button
                  size="lg"
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  查看訂單
                </Button>
              </Link>
            </div>
          </div>
          {/* 提醒訊息
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 max-w-2xl mx-auto">
                <p className="text-sm text-blue-800 text-center">
                  <strong>提醒：</strong>
                  我們已將訂單確認信寄至您的電子郵件 <span className="font-medium">{orderData.userInfo.email}</span>，
                  請查收並保留此訂單資訊。如有任何問題，請聯繫客服。
                </p>
              </div> */}
        </div>
      </main>
      <Footer />
    </>
  )
}
