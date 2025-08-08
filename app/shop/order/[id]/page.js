'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FaXmark, FaCheck } from 'react-icons/fa6'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
import { getProductImageUrl } from '@/api/admin/shop/image'
import { getOrderDetail } from '@/api'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const steps = [
  { id: 1, title: '待出貨', completed: true },
  { id: 2, title: '已出貨', completed: false },
  { id: 3, title: '已完成', completed: false },
]

export default function OrderDetailPage() {
  // ===== 路由和搜尋參數處理 =====
  const router = useRouter()
  const { id } = useParams()

  // ===== 組件狀態管理 =====
  const [isSuccess, setIsSuccess] = useState(true)
  const [order, setOrder] = useState(null)
  const [members, setMembers] = useState([])

  // ===== 數據獲取 =====
  const {
    data,
    isLoading: isDataLoading,
    error,
    mutate,
  } = useSWR(id ? ['order', id] : null, () => getOrderDetail(id))

  // ===== 載入選項 =====
  useEffect(() => {
    if (data && data.data) {
      setOrder(data.data)
      console.log('Order loaded:', data.data) // Debug用
    }
  }, [data])

  // 處理訂單資料
  const orderDetails = order
    ? [
        { key: '訂單編號', value: order.id },
        order.recipient && { key: '收件人', value: order.recipient },
        order.phone && { key: '手機號碼', value: order.phone },
        order.address && { key: '收件地址', value: order.address },
        order.delivery_name && { key: '物流方式', value: order.delivery_name },
        order.payment_name && { key: '付款方式', value: order.payment_name },
        order.invoice &&
          order.invoice.name && { key: '發票類型', value: order.invoice.name },
        order.invoice &&
          order.invoice.number && {
            key: '統一編號',
            value: order.invoice.number,
          },
        { key: '訂單金額', value: order.total },
      ].filter(Boolean)
    : []

  const products = order?.items || []

  // 如果正在載入，顯示載入狀態
  if (isDataLoading) {
    return (
      <>
        <Navbar />
        <BreadcrumbAuto />
        <section className="px-4 md:px-6 py-10">
          <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
            <div className="text-center">載入中...</div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  // 如果發生錯誤
  if (error) {
    return (
      <>
        <Navbar />
        <BreadcrumbAuto />
        <section className="px-4 md:px-6 py-10">
          <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
            <div className="text-center text-red-500">
              載入訂單資料時發生錯誤
            </div>
          </div>
        </section>
        <Footer />
      </>
    )
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
          <div className="bg-card rounded-lg p-6">
            <Table className="w-full table-fixed">
              <TableBody className="divide-y divide-foreground">
                {orderDetails.map(({ key, value }) => (
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
                      {key === '訂單金額' ? `NTD$${value}` : value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-card rounded-lg p-6">
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
                {products.map((item, index) => {
                  // 從 item.product 取得商品資料
                  const product = item.product || item

                  // 處理圖片路徑：從 product.images[0].url 取得
                  const imageFileName =
                    product.images?.[0]?.url || product.img || product.image

                  return (
                    <TableRow key={item.id || product.id || index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 overflow-hidden flex-shrink-0">
                            <Image
                              className="object-cover w-full h-full"
                              src={getProductImageUrl(imageFileName)}
                              alt={product.name || `商品 ${index + 1}`}
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
                        ${item.price || product.price}
                      </TableCell>
                      <TableCell className="text-accent-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-12 text-center select-none">
                            {item.quantity || 1}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center">
            <Link href="/shop/order">
              <Button variant="highlight" className="w-[120px]">
                返回我的訂單
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
