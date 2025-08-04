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
import { getProductImageUrl } from '@/api/shop/image'
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
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemContent,
  ChoiceboxItemHeader,
  ChoiceboxItemIndicator,
  ChoiceboxItemSubtitle,
  ChoiceboxItemTitle,
} from '@/components/ui/choicebox'

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

export default function ProductListPage() {
  const [quantity, setQuantity] = React.useState(1)
  const searchParams = useSearchParams()
  // 付款和發票選項狀態
  const [selectedPayment, setSelectedPayment] = useState('1')
  const [selectedReceipt, setSelectedReceipt] = useState('1')

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
                            <img
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
                <Label className="text-base font-medium">選擇付款方式</Label>
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
                        {selectedPayment === option.id && option.component && (
                          <div className="md:ml-6">{option.component}</div>
                        )}
                      </div>
                    ))}
                  </Choicebox>
                </div>
              </div>
              {/* 發票類型 */}
              <div className="space-y-3">
                <Label className="text-base font-medium">選擇發票類型</Label>
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
                        {selectedReceipt === option.id && option.component && (
                          <div className="md:ml-6">{option.component}</div>
                        )}
                      </div>
                    ))}
                  </Choicebox>
                </div>
              </div>
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
            <Link href="/shop/cart">
              <Button variant="outline" className="w-[120px]">
                返回購物車
              </Button>
            </Link>
            <Link href="/shop/success">
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
