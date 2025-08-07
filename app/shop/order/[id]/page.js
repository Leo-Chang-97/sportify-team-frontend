'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FaXmark, FaCheck } from 'react-icons/fa6'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
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

const steps = [
  { id: 1, title: '待出貨', completed: true },
  { id: 2, title: '已出貨', completed: false },
  { id: 3, title: '已完成', completed: false },
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

const order = [
  {
    id: 1,
    item: {
      訂單編號: 1,
      收件人: '王淑華',
      手機號碼: '0945678901',
      收件地址: '台南市中西區民族路二段77號',
      物流方式: '7-11取貨',
      付款方式: 'Line Pay',
      發票類型: '統一編號',
      統一編號: '39497205',
      發票號碼: 'WB68570834',
      訂單金額: 4680,
    },
  },
]

export default function ProductListPage() {
  const [quantity, setQuantity] = React.useState(1)
  const [isSuccess, setIsSuccess] = useState(true)

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
                {Object.entries(order[0].item).map(([key, value]) => (
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
