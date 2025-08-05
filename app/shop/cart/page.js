'use client'

import { Minus, Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getProductImageUrl } from '@/api/admin/shop/image'

const steps = [
  { id: 1, title: '確認購物車', active: true },
  { id: 2, title: '填寫付款資訊', completed: false },
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
  const handleQuantityChange = React.useCallback((newQty) => {
    setQuantity((prev) => (newQty >= 1 ? newQty : prev))
  }, [])

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
                  <TableHead className="font-bold w-1/2 text-accent-foreground p-2">
                    商品名稱
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-accent-foreground p-2">
                    單價
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-accent-foreground text-center p-2">
                    數量
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-right hidden md:table-cell text-accent-foreground p-2">
                    總計
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
                          <span className="text-sm whitespace-normal text-accent-foreground">
                            {product.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-accent-foreground">
                        ${product.price}
                      </TableCell>
                      <TableCell className="text-accent-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className="cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-110"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              quantity > 1 && handleQuantityChange(quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </span>
                          <span className="w-12 text-center select-none">
                            {quantity}
                          </span>
                          <span
                            className="cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-110"
                            aria-label="Increase quantity"
                            onClick={() => handleQuantityChange(quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell text-accent-foreground">
                        ${product.price}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
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
                    <TableCell className="text-base text-accent-foreground">
                      未選擇
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-base pr-10 text-accent-foreground">
                      商品小計
                    </TableCell>
                    <TableCell className="text-base font-bold text-accent-foreground">
                      $2250
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex justify-between">
            <Link href="/shop/list">
              <Button variant="outline" className="w-[120px]">
                繼續購物
              </Button>
            </Link>
            <Link href="/shop/pay">
              <Button variant="highlight" className="w-[120px]">
                填寫付款資訊
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
