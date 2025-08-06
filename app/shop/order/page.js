'use client'

import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
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
import { getCarts, addProductCart, updateCarts, removeCart } from '@/api'
import { toast } from 'sonner'

const steps = [
  { id: 1, title: '確認購物車', active: true },
  { id: 2, title: '填寫付款資訊', completed: false },
  { id: 3, title: '完成訂單', completed: false },
]

export default function CartListPage() {
  // ===== 路由和搜尋參數處理 =====
  const searchParams = useSearchParams()
  const router = useRouter()
  const { id } = useParams()

  // ===== 組件狀態管理 =====
  const [carts, setCarts] = useState([])
  const [members, setMembers] = useState([])

  // 計算總價和總數量
  const { totalPrice, itemCount } = useMemo(() => {
    const totalPrice = carts.reduce((sum, cartItem) => {
      return sum + cartItem.product.price * cartItem.quantity
    }, 0)
    const itemCount = carts.reduce(
      (sum, cartItem) => sum + cartItem.quantity,
      0
    )
    return { totalPrice, itemCount }
  }, [carts])

  // ===== URL 參數處理 =====
  const queryParams = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries())
    return entries
  }, [searchParams])

  // ===== 數據獲取 =====
  const {
    data,
    isLoading: isDataLoading,
    error,
    mutate,
  } = useSWR(['carts', queryParams], async ([, params]) => {
    const result = await getCarts(params)
    return result
  })

  // 處理商品數量變更
  const handleQuantityChange = useCallback(
    async (cartItemId, newQuantity) => {
      // 如果新數量小於 1，就刪除該項目
      if (newQuantity < 1) {
        // 先從 UI 移除項目 (樂觀更新 Optimistic Update)
        setCarts((prevCarts) =>
          prevCarts.filter((cartItem) => cartItem.id !== cartItemId)
        )

        try {
          // 呼叫 API 刪除項目
          await removeCart(cartItemId)
          // 重新獲取購物車資料確保同步
          mutate()
          toast('商品已從購物車移除', {
            style: {
              backgroundColor: '#ff671e',
              color: '#fff',
              border: 'none',
            },
          })
        } catch (error) {
          console.error('刪除項目失敗:', error)
          // 如果 API 失敗，恢復項目到 UI
          mutate() // 重新載入資料
          toast('刪除商品失敗，請稍後再試', {
            style: {
              backgroundColor: '#ff671e',
              color: '#fff',
              border: 'none',
            },
          })
        }
        return
      }

      setCarts((prevCarts) =>
        prevCarts.map((cartItem) =>
          cartItem.id === cartItemId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      )

      try {
        // 呼叫 API 更新後端數量
        await updateCarts(cartItemId, newQuantity)
        // 重新獲取購物車資料確保同步
        mutate()
      } catch (error) {
        console.error('更新數量失敗:', error)
        // 如果 API 失敗，回滾 UI 狀態
        setCarts((prevCarts) =>
          prevCarts.map((cartItem) =>
            cartItem.id === cartItemId
              ? { ...cartItem, quantity: cartItem.quantity } // 回復原本數量
              : cartItem
          )
        )
        toast('更新數量失敗，請稍後再試', {
          style: { backgroundColor: '#ff671e', color: '#fff', border: 'none' },
        })
      }
    },
    [mutate]
  )

  // ===== 載入選項 =====
  useEffect(() => {
    if (data?.data?.cart?.cartItems) {
      setCarts(data.data.cart.cartItems)
    }
  }, [data])

  // 載入狀態處理
  if (isDataLoading) {
    return (
      <>
        <Navbar />
        <BreadcrumbAuto />
        <section className="px-4 md:px-6 py-10">
          <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
            <div className="text-center py-20">載入中...</div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  // 錯誤狀態處理
  if (error) {
    return (
      <>
        <Navbar />
        <BreadcrumbAuto />
        <section className="px-4 md:px-6 py-10">
          <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
            <div className="text-center py-20 text-red-500">
              載入失敗: {error.message}
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
                {carts && carts.length > 0 ? (
                  carts.map((cartItem) => {
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
                          ${product.price}
                        </TableCell>
                        <TableCell className="text-accent-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className="cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-110"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                handleQuantityChange(
                                  cartItem.id,
                                  cartItem.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </span>
                            <span className="w-12 text-center select-none">
                              {cartItem.quantity}
                            </span>
                            <span
                              className="cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-110"
                              aria-label="Increase quantity"
                              onClick={() =>
                                handleQuantityChange(
                                  cartItem.id,
                                  cartItem.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell text-accent-foreground">
                          ${product.price * cartItem.quantity}
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      購物車是空的
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex flex-col">
              <span className="text-base text-right p-2 text-muted-foreground">
                共有{itemCount}件商品
              </span>
              <Table className="table-fixed flex justify-end">
                <TableBody>
                  <TableRow>
                    <TableCell className="text-base pr-10 text-accent-foreground">
                      商品金額
                    </TableCell>
                    <TableCell className="text-base font-bold text-accent-foreground">
                      ${totalPrice}
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
                      ${totalPrice}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex justify-between">
            <Link href="/shop">
              <Button variant="outline" className="w-[120px]">
                繼續購物
              </Button>
            </Link>
            <Link
              href={`/shop/order/pay?totalPrice=${totalPrice}&itemCount=${itemCount}`}
            >
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
