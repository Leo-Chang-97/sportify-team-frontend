'use client'

import React, { useState, useEffect } from 'react'
import { FaXmark, FaCheck } from 'react-icons/fa6'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
import { AspectRatio } from '@/components/ui/aspect-ratio'

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
    courseImage: '/product-pic/volleyball-course.png',
    
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
        
        setOrderData(prev => ({ ...prev, ...decodedData }))
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

          {/* 主要內容區域 */}
          <section className="flex justify-center">
            <div className="w-full max-w-4xl">
              
              {/* 成功圖標和標題 */}
              <div className="text-center mb-16 mt-8">
                <div className="flex justify-center mb-4 ">
                  <div className="rounded-full bg-highlight p-4">
                    <FaCheck className="w-8 h-8  " />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  感謝您的訂購，我們已收到您的課程報名
                </h1>
              </div>

              {/* 雙欄布局 */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* 左側：課程資訊 */}
                <Card>
                  <CardHeader className="pb-8">
                    <h2 className="text-lg font-semibold">課程資訊</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 課程圖片 */}
                    {orderData.courseImage && (
                      <div className="w-full h-48 mb-8">
                        <AspectRatio ratio={16/9} className="bg-muted">
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
                        <span className="font-medium text-blue-600">{orderData.courseName}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">授課教練:</span>
                        <span className="font-medium">{orderData.instructor}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">開課日期:</span>
                        <span className="font-medium">{orderData.startDate?.toLocaleDateString('zh-TW')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">上課時段:</span>
                        <span className="font-medium">{orderData.schedule}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 右側：訂單詳情 */}
                <Card>
                  <CardHeader className="pb-8">
                    <h2 className="text-lg font-semibold">訂單詳情</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">訂單編號</span>
                        <span className="font-medium">{orderData.orderNumber}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">訂購人</span>
                        <span className="font-medium">{orderData.userInfo.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">手機號碼</span>
                        <span className="font-medium">{orderData.userInfo.phone}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">付款方式</span>
                        <span className="font-medium">{orderData.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">發票類型</span>
                        <span className="font-medium">{orderData.receiptType}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">訂單金額</span>
                        <span className="font-bold text-lg text-blue-600">NT$ {orderData.totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">訂單狀態</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          已確認
                        </span>
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

              {/* 提醒訊息
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 max-w-2xl mx-auto">
                <p className="text-sm text-blue-800 text-center">
                  <strong>提醒：</strong>
                  我們已將訂單確認信寄至您的電子郵件 <span className="font-medium">{orderData.userInfo.email}</span>，
                  請查收並保留此訂單資訊。如有任何問題，請聯繫客服。
                </p>
              </div> */}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}