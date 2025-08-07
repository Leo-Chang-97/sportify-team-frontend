'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
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
    location: '體育館青少年A教室-14號房間',
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

          {/* 訂單完成內容 */}
          <section className="flex justify-center">
            <Card className="w-full max-w-3xl">
              <CardHeader className="text-center pb-6">
                {/* 成功圖標 */}
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  已完成訂購！
                </h1>
                <p className="text-muted-foreground mt-2">
                  感謝您的訂購，我們已收到您的課程報名
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 課程資訊 */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-lg">課程資訊</h3>
                  
                  {/* 課程圖片和基本資訊 */}
                  <div className="flex gap-4">
                    {orderData.courseImage && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <AspectRatio ratio={1} className="bg-muted">
                          <Image
                            alt={orderData.courseName}
                            className="object-cover rounded"
                            fill
                            sizes="96px"
                            src={orderData.courseImage}
                          />
                        </AspectRatio>
                      </div>
                    )}
                    
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-muted-foreground">課程名稱：</span>
                        <span className="font-medium">{orderData.courseName}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-muted-foreground">開課日期：</span>
                        <span className="font-medium">
                          {orderData.startDate?.toLocaleDateString('zh-TW')}
                        </span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-muted-foreground">授課教練：</span>
                        <span className="font-medium">{orderData.instructor}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-muted-foreground">上課時段：</span>
                        <span className="font-medium">{orderData.schedule}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 訂單資訊表格 */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y">
                      <tr className="bg-muted/30">
                        <td className="px-4 py-3 text-sm font-medium">訂單編號</td>
                        <td className="px-4 py-3 text-sm">{orderData.orderNumber}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium">訂購人</td>
                        <td className="px-4 py-3 text-sm">{orderData.userInfo.name}</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="px-4 py-3 text-sm font-medium">手機號碼</td>
                        <td className="px-4 py-3 text-sm">{orderData.userInfo.phone}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium">付款方式</td>
                        <td className="px-4 py-3 text-sm">{orderData.paymentMethod}</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="px-4 py-3 text-sm font-medium">發票類型</td>
                        <td className="px-4 py-3 text-sm">{orderData.receiptType}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium">訂單金額</td>
                        <td className="px-4 py-3 text-sm font-semibold text-primary">
                          NT$ {orderData.totalPrice}
                        </td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="px-4 py-3 text-sm font-medium">訂單狀態</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            已確認
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 操作按鈕 */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link href="/course" className="flex-1">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      返回總覽
                    </Button>
                  </Link>
                  <Link href="/member/orders" className="flex-1">
                    <Button 
                      size="lg" 
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      查看訂單
                    </Button>
                  </Link>
                </div>

                {/* 提醒訊息 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>提醒：</strong>
                    我們已將訂單確認信寄至您的電子郵件 {orderData.userInfo.email}，
                    請查收並保留此訂單資訊。如有任何問題，請聯繫客服。
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}