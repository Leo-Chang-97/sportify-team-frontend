'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaXmark, FaCheck } from 'react-icons/fa6'
// components/ui
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
// components
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
// api
import { getProductImageUrl } from '@/api/admin/shop/image'

const steps = [
  { id: 1, title: '確認購物車', completed: true },
  { id: 2, title: '填寫付款資訊', completed: true },
  { id: 3, title: '完成訂單', active: true },
]

export default function ProductSuccessPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()

  // ===== 組件狀態管理 =====
  const [orderData, setOrderData] = useState(null)
  const [isSuccess, setIsSuccess] = useState(true)

  // ===== URL 參數處理 =====
  useEffect(() => {
    const dataParam = searchParams.get('data')

    if (dataParam) {
      // 一般付款流程：從 data 參數中解析訂單數據
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam))
        setOrderData(parsedData)
        setIsSuccess(true) // 確保成功狀態
        // console.log('訂單數據 (一般付款):', parsedData) // Debug 用
      } catch (error) {
        console.error('解析訂單數據失敗:', error)
        setIsSuccess(false)
      }
    } else {
      // 綠界付款回來：嘗試從 localStorage 讀取訂單資料
      try {
        const storedOrderData = localStorage.getItem('ecpay_order_data')
        if (storedOrderData) {
          const parsedStoredData = JSON.parse(storedOrderData)
          setOrderData(parsedStoredData)
          setIsSuccess(true) // 確保成功狀態
          // console.log('訂單數據 (綠界付款 - localStorage):', parsedStoredData) // Debug 用

          // 清除 localStorage 中的訂單資料（避免重複使用）
          localStorage.removeItem('ecpay_order_data')
        } else {
          // 如果沒有數據，可能是直接訪問頁面
          // console.log('沒有找到訂單參數或 localStorage 資料')
          setIsSuccess(false)
        }
      } catch (error) {
        console.error('讀取 localStorage 訂單數據失敗:', error)
        setIsSuccess(false)
      }
    }
  }, [searchParams])

  // 如果沒有訂單數據，顯示載入中
  if (!orderData) {
    return (
      <>
        <Navbar />
        <BreadcrumbAuto />
        <section className="px-4 md:px-6 py-10 ">
          <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
            <div className="text-center py-20">載入中...</div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  // 建立訂單詳情物件
  const orderDetails = {
    訂單編號: orderData.orderId || '尚未分配',
    收件人: orderData.userInfo?.recipient || '',
    手機號碼: orderData.userInfo?.phone || '',
    // 只有當物流方式是宅配時才顯示收件地址
    ...(orderData.deliveryMethod?.includes('宅配') && {
      收件地址: orderData.userInfo?.address || '',
    }),
    ...(orderData.deliveryMethod?.includes('7-11') && {
      取貨門市: orderData.userInfo?.storeName || '',
    }),
    物流方式: orderData.deliveryMethod || '',
    付款方式: orderData.paymentMethod || '',
    發票類型: orderData.receiptType || '',
    統一編號: orderData.userInfo?.companyId || '',
    載具號碼: orderData.userInfo?.carrierId || '',
    訂單金額: orderData.totalPrice || 0,
  }

  // 格式化價格，加上千分位逗號
  const formatPrice = (price) => {
    return Number(price).toLocaleString('zh-TW')
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
          <div className="flex flex-col items-center gap-4 py-4 md:py-8">
            {isSuccess ? (
              <>
                <div className="rounded-full bg-highlight p-4">
                  <FaCheck className="text-4xl text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-accent">已完成訂購</h2>
              </>
            ) : (
              <>
                <div className="rounded-full bg-highlight p-4">
                  <FaXmark className="text-4xl text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-accent">訂單失敗</h2>
              </>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* 左側卡片 - 訂單詳情 */}
            <div className="flex-1">
              <Card>
                <CardContent>
                  <Table className="w-full table-fixed">
                    <TableBody className="divide-y divide-foreground">
                      {Object.entries(orderDetails)
                        .filter(
                          ([key, value]) =>
                            value !== '' &&
                            value !== null &&
                            value !== undefined
                        )
                        .map(([key, value]) => (
                          <TableRow
                            key={key}
                            className="border-b border-card-foreground"
                          >
                            <TableCell className="font-bold text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                              {key}
                            </TableCell>
                            <TableCell
                              className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                              style={{ width: '100%' }}
                            >
                              {key === '訂單金額'
                                ? `NTD$${formatPrice(value)}`
                                : value}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            {/* 右側卡片 - 商品明細 */}
            <div className="flex-1">
              <Card>
                <CardContent>
                  <Table className="w-full table-fixed">
                    <TableHeader className="border-b-2 border-card-foreground">
                      <TableRow className="text-lg">
                        <TableHead className="font-bold w-1/2 text-accent-foreground p-2">
                          商品名稱
                        </TableHead>
                        <TableHead className="font-bold w-1/4 text-accent-foreground p-2">
                          單價
                        </TableHead>
                        <TableHead className="font-bold w-1/4 text-accent-foreground text-center p-2">
                          數量
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-card-foreground">
                      {orderData.carts && orderData.carts.length > 0 ? (
                        orderData.carts.map((cartItem) => {
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
                            沒有商品資料
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between">
            <Link href={`/shop/order/${orderData.orderId || '1'}`}>
              <Button variant="default" className="w-[120px]">
                查看訂單
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="highlight" className="w-[120px]">
                瀏覽新商品
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
