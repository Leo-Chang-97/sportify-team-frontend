'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaXmark, FaCheck } from 'react-icons/fa6'
import { IconCircleCheckFilled, IconLoader } from '@tabler/icons-react'
// components/ui
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

  // 格式化價格，加上千分位逗號
  const formatPrice = (price) => {
    return Number(price).toLocaleString('zh-TW')
  }

  const summaries = [
    {
      key: '訂單編號',
      value: orderData.orderId || '尚未分配',
    },
    {
      key: '收件人',
      value: orderData.userInfo?.recipient || '未知',
    },
    {
      key: '手機號碼',
      value: orderData.userInfo?.phone || '未知',
    },
    // 物流方式相關
    ...(orderData.deliveryMethod?.includes('宅配')
      ? [
          {
            key: '收件地址',
            value: orderData.userInfo?.address || '未知',
          },
        ]
      : []),
    ...(orderData.deliveryMethod?.includes('7-11')
      ? [
          {
            key: '取貨門市',
            value: orderData.userInfo?.storeName || '未知',
          },
        ]
      : []),
    {
      key: '物流方式',
      value: orderData.deliveryMethod || '未知',
    },
    {
      key: '付款方式',
      value: orderData.paymentMethod || '未知',
    },
    {
      key: '發票類型',
      value: orderData.receiptType || '未知',
    },
    {
      key: '訂單狀態',
      value: (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {orderData.status?.name === '已付款' ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 mr-1" />
          ) : (
            <IconLoader className="mr-1" />
          )}
          {orderData.status?.name || '未知'}
        </Badge>
      ),
    },
    {
      key: '統一編號',
      value: orderData.userInfo?.companyId || '',
    },
    {
      key: '載具號碼',
      value: orderData.userInfo?.carrierId || '',
    },
    {
      key: '訂單金額',
      value: (
        <span className="text-lg font-bold text-primary">
          NT$ {formatPrice(orderData.totalPrice || 0)}
        </span>
      ),
    },
  ]

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
          <div className="mx-auto md:max-w-2xl gap-6">
            <div className="flex flex-col gap-6">
              {/* 訂單詳情 */}
              <div>
                <Card className="gap-0">
                  <CardHeader>
                    <h2 className="text-lg font-semibold">訂單詳情</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Table className="w-full table-fixed">
                      <TableBody>
                        {summaries
                          .filter(
                            (summary) =>
                              summary.value !== '' &&
                              summary.value !== null &&
                              summary.value !== undefined
                          )
                          .map((summary) => (
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
                    </Table>
                  </CardContent>
                </Card>
              </div>
              {/* 商品明細 */}
              <div>
                <Card className="gap-0">
                  <CardHeader>
                    <h2 className="text-lg font-semibold">商品明細</h2>
                  </CardHeader>
                  <CardContent>
                    <Table className="w-full table-fixed">
                      <TableHeader className="border-b-2 border-card-foreground">
                        <TableRow className="text-base">
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
                                    <span className="text-sm whitespace-normal text-accent-foreground">
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
            <div className="flex justify-between mt-6">
              <Link href={`/shop/order/${orderData.orderId || '1'}`}>
                <Button variant="outline">查看訂單</Button>
              </Link>
              <Link href="/shop">
                <Button variant="highlight">瀏覽新商品</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
