'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
import { Input } from '@/components/ui/input'
import { getProductImageUrl } from '@/api/admin/shop/image'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import PaymentMethodSelector, {
  paymentOptions,
} from '@/components/payment-method-selector'
import ReceiptTypeSelector, {
  receiptOptions,
} from '@/components/receipt-type-selector'

const steps = [
  { id: 1, title: '確認購物車', completed: true },
  { id: 2, title: '填寫付款資訊', active: true },
  { id: 3, title: '完成訂單', completed: false },
]

const products = [
  {
    id: 1,
    name: '極限飛馳籃球鞋',
    brand_name: 'Anta',
    sport_name: '籃球',
    price: 880,
    stock: 50,
    specs: {
      商品名稱: '極限飛馳籃球鞋',
      品牌: 'Anta',
      運動種類: '籃球',
      材質: '透氣網布與耐磨橡膠',
      尺寸: '27',
      重量: 380,
      產地: '越南',
    },
    img: 'spec01.jpeg', // 改為檔案名稱
  },
  {
    id: 2,
    name: '標準七號籃球',
    brand_name: 'Spalding',
    sport_name: '籃球',
    price: 650,
    stock: 100,
    specs: {
      商品名稱: '標準七號籃球',
      品牌: 'Spalding',
      運動種類: '籃球',
      材質: '高級合成皮革',
      尺寸: '24',
      重量: 600,
      產地: '泰國',
    },
    img: 'spec02.jpeg', // 改為檔案名稱
  },
  {
    id: 3,
    name: '7號籃球',
    brand_name: 'Spalding',
    sport_name: '籃球',
    price: 720,
    stock: 14,
    specs: {
      商品名稱: '7號籃球',
      品牌: 'Spalding',
      運動種類: '籃球',
      材質: '合成皮',
      尺寸: '24.5',
      重量: 600,
      產地: '中國',
    },
    img: 'spec03.jpeg', // 改為檔案名稱
  },
]

export default function ProductListPage() {
  const [quantity, setQuantity] = React.useState(1)
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
              <TableHeader className="border-b-2 border-card-foreground">
                <TableRow className="text-lg">
                  <TableHead className="font-bold w-1/2 text-accent-foreground">
                    商品名稱
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-accent-foreground">
                    單價
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-accent-foreground text-center">
                    數量
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-card-foreground">
                {products.map((product) => {
                  // 處理圖片路徑：如果 img 是物件，取出 url 屬性；如果是字串，直接使用
                  const image = product.img
                  const imageFileName =
                    typeof image === 'object' && image !== null
                      ? image.url
                      : image

                  return (
                    <TableRow key={product.id}>
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
                        ${product.price}
                      </TableCell>
                      <TableCell className="text-accent-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-12 text-center select-none">
                            {quantity}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="flex flex-col gap-6">
              {/* 預訂人資料 */}
              <div className="space-y-3">
                <Label className="text-base font-medium">訂單人資料</Label>
                <div className="space-y-2 grid gap-3">
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="recipient">收件人</Label>
                    <Input
                      type="text"
                      id="recipient"
                      placeholder="收件人姓名"
                      className="w-full"
                      value={formData.recipient}
                      onChange={(e) =>
                        handleInputChange('recipient', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="phone">電話</Label>
                    <Input
                      type="text"
                      id="phone"
                      placeholder="電話"
                      className="w-full"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="address">收件地址</Label>
                    <Input
                      type="text"
                      id="address"
                      placeholder="收件地址"
                      className="w-full"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
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
            <CardFooter className="flex justify-end">
              {/* <Link
                  href={`/venue/reservation/success?data=${encodeURIComponent(JSON.stringify(orderSummary))}`}
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" className="w-full">
                    確認付款
                    <ClipboardCheck />
                  </Button>
                </Link> */}
              <div className="flex flex-col">
                <span className="text-base text-right p-2 text-muted-foreground">
                  共有3件商品
                </span>
                <Table className="table-fixed flex justify-end">
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-base pr-10 text-accent-foreground">
                        商品金額
                      </TableCell>
                      <TableCell className="text-base font-bold text-accent-foreground">
                        $2250
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-b border-card-foreground">
                      <TableCell className="text-base pr-10 text-accent-foreground">
                        運費
                      </TableCell>
                      <TableCell className="text-base font-bold text-accent-foreground text-right">
                        $100
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-base pr-10 text-accent-foreground">
                        商品小計
                      </TableCell>
                      <TableCell className="text-base font-bold text-accent-foreground">
                        $2350
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardFooter>
          </Card>
          <div className="flex justify-between">
            <Link href="/shop/order">
              <Button variant="outline" className="w-[120px]">
                返回購物車
              </Button>
            </Link>
            <Link
              href={`/shop/order/success?data=${encodeURIComponent(
                JSON.stringify({
                  products: products,
                  userInfo: formData,
                  totalPrice: 2350,
                  itemCount: 3,
                  ...getSelectedOptions(),
                })
              )}`}
            >
              <Button variant="highlight" className="w-[120px]">
                付款
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
