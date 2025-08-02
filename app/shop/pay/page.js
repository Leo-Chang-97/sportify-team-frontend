'use client'

import { Minus, Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const steps = [
  { id: 1, title: '確認購物車', completed: true },
  { id: 2, title: '填寫付款資訊', active: true },
  { id: 3, title: '完成訂購', completed: true },
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
    img: '/product-imgs/spec01.jpeg',
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
    img: '/product-imgs/spec02.jpeg',
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
    img: '/product-imgs/spec03.jpeg',
  },
]

export default function ProductListPage() {
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)
  const [members, setMembers] = useState([])
  const [quantity, setQuantity] = React.useState(1)
  const handleQuantityChange = React.useCallback((newQty) => {
    setQuantity((prev) => (newQty >= 1 ? newQty : prev))
  }, [])
  // ===== 載入下拉選單選項 =====
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const memberData = await fetchMemberOptions()
  //       setMembers(memberData.rows || [])

  //       const sportData = await fetchSportOptions()
  //       setSports(sportData.rows || [])

  //       const brandData = await fetchBrandOptions()
  //       setBrands(brandData.rows || [])
  //     } catch (error) {
  //       console.error('載入失敗:', error)
  //       toast.error('載入失敗')
  //     }
  //   }
  //   loadData()
  // }, [])

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <section className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <Step
            steps={steps}
            orientation="horizontal"
            onStepClick={(step, index) => console.log('Clicked step:', step)}
          />
          <Table className="w-full table-fixed">
            <TableHeader className="border-b-2 border-foreground">
              <TableRow className="text-lg">
                <TableHead className="font-bold w-1/2">商品名稱</TableHead>
                <TableHead className="font-bold w-1/4">單價</TableHead>
                <TableHead className="font-bold w-1/4 text-center">
                  數量
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-foreground">
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 overflow-hidden flex-shrink-0">
                        <Image
                          className="object-cover w-full h-full"
                          src={product.img}
                          alt={product.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <span className="text-base whitespace-normal">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-12 text-center select-none">
                        {quantity}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex flex-col">
            <span className="text-muted text-base text-right p-2">共有3件商品</span>
            <Table className="table-fixed flex justify-end">
              <TableBody>
                <TableRow>
                  <TableCell className="text-base pr-10">商品金額</TableCell>
                  <TableCell className="text-base font-bold">$2250</TableCell>
                </TableRow>
                <TableRow className="border-b">
                  <TableCell className="text-base pr-10">運費</TableCell>
                  <TableCell className="text-base font-bold">$100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-base pr-10">商品小計</TableCell>
                  <TableCell className="text-base font-bold">$2350</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex container mx-auto max-w-screen-xl min-h-screen gap-6 justify-between">
            <Link href="/shop/cart">
              <Button variant="outline" className="w-[120px]">返回購物車</Button>
            </Link>
            <Button variant="highlight" className="w-[120px]">結帳</Button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
