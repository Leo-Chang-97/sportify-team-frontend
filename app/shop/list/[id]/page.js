'use client'

import { Minus, Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useParams, useRouter } from 'next/navigation'
import products from '../../datas.json'
import { getProductImageUrl } from '@/api/shop/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const CURRENCY_FORMATTER = new Intl.NumberFormat('zh-TW', {
  currency: 'TWD',
})

export default function ProductListPage() {
  // 新增：目前選中的大圖 index
  const [selectedIndex, setSelectedIndex] = useState(0)
  const totalImages = 10
  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }
  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % totalImages)
  }
  const { id } = useParams()
  const [quantity, setQuantity] = React.useState(1)
  const product = React.useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [id]
  )
  const handleQuantityChange = React.useCallback((newQty) => {
    setQuantity((prev) => (newQty >= 1 ? newQty : prev))
  }, [])

  // 處理圖片路徑：如果 img 是物件，取出 url 屬性；如果是字串，直接使用
  const image = product?.img
  const imageFileName =
    typeof image === 'object' && image !== null ? image.url : image

  const handleViewDetails = React.useCallback(() => {
    if (!product) return
    toast.success(`查看 ${product.name} 的詳細資訊`)
    // 這裡可以添加其他邏輯，比如跳轉到詳細頁面或顯示更多資訊
  }, [product])

  const imageGroup = (
    <div className="w-full max-w-[350px] md:max-w-[400px] lg:max-w-[450px] flex items-center justify-center mb-4 md:mb-6">
      {imageFileName ? (
        <img
          src={getProductImageUrl(imageFileName)}
          alt={product.name}
          className="w-full h-full object-contain"
          key={selectedIndex}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          無商品圖片
        </div>
      )}
    </div>
  )

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <section className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            {/* 左側商品圖片區塊 */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* 上方大圖 */}
              <div className="w-full max-w-[400px] md:max-w-[450px] lg:max-w-[500px] flex items-center justify-center mb-4">
                {imageFileName ? (
                  <img
                    src={getProductImageUrl(imageFileName)}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    key={selectedIndex}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    無商品圖片
                  </div>
                )}
              </div>
              {/* 下方小圖輪播 */}
              <div className="flex w-full max-w-[280px] md:max-w-[320px] lg:max-w-[360px] relative items-center">
                <Carousel opts={{ align: 'start' }} className="w-full px-10">
                  <CarouselContent>
                    {[...Array(totalImages)].map((_, idx) => (
                      <CarouselItem
                        key={idx}
                        className="basis-1/5 flex justify-center"
                      >
                        <button
                          onClick={() => setSelectedIndex(idx)}
                          style={{
                            border:
                              selectedIndex === idx ? '1px solid gray' : 'none',
                          }}
                        >
                          <img
                            src={getProductImageUrl(imageFileName)}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious
                    onClick={handlePrev}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center"
                  />
                  <CarouselNext
                    onClick={handleNext}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center"
                  />
                </Carousel>
              </div>
            </div>
            {/* 右側商品資訊區*/}
            <div className="flex-1 flex flex-col items-center md:items-start justify-start gap-6 md:gap-8 lg:gap-10 mt-6 lg:mt-0 w-full">
              {/* Title*/}
              <div className="flex flex-col gap-2 md:gap-3">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                  {product.name}
                </h1>
                <p className="text-base md:text-lg font-medium text-muted-foreground">
                  {product.sport_name}/{product.brand_name}
                </p>
                <div className="mt-1 md:mt-2 flex items-center gap-2">
                  <span className="text-lg md:text-xl lg:text-2xl font-bold text-destructive">
                    NTD${CURRENCY_FORMATTER.format(product.price)}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold mb-2 md:mb-3">
                  配送方式
                </h1>
                <div className="flex gap-2 mb-1">
                  <p className="text-sm md:text-base font-regular">宅配</p>
                  <p className="text-sm md:text-base font-regular text-muted-foreground">
                    NTD$100
                  </p>
                </div>
                <div className="flex gap-2 mb-1">
                  <p className="text-sm md:text-base font-regular">7-11取貨</p>
                  <p className="text-sm md:text-base font-regular text-muted-foreground">
                    NTD$60
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="text-sm md:text-base font-regular">全家取貨</p>
                  <p className="text-sm md:text-base font-regular text-muted-foreground">
                    NTD$60
                  </p>
                </div>
              </div>
              {/* Quantity */}
              <div className="flex items-center justify-between rounded-sm gap-2 bg-foreground w-[300px] md:w-full">
                <Button
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => handleQuantityChange(quantity - 1)}
                  size="icon"
                  variant="secondary"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center select-none text-muted-foreground">
                  {quantity}
                </span>
                <Button
                  aria-label="Increase quantity"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  size="icon"
                  variant="secondary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3 md:gap-4">
                <Button className="w-[300px] md:w-auto flex-1 text-sm md:text-base">
                  加入最愛
                </Button>
                <Button className="w-[300px] md:w-auto flex-1 text-sm md:text-base">
                  加入購物車
                </Button>
              </div>
            </div>
          </div>
          <Tabs defaultValue="imgs" className="w-full items-center">
            <TabsList className="mb-6 md:mb-8">
              <TabsTrigger value="imgs" className="text-sm md:text-base">
                商品圖片
              </TabsTrigger>
              <TabsTrigger value="spec" className="text-sm md:text-base">
                詳細規格
              </TabsTrigger>
            </TabsList>
            <TabsContent value="imgs">
              {imageGroup}
              {imageGroup}
              {imageGroup}
              {imageGroup}
              {imageGroup}
            </TabsContent>
            <TabsContent value="spec">
              <div className="bg-card rounded-lg p-5">
                <Table className="w-full table-fixed">
                  <TableBody className="divide-y divide-foreground">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <TableRow
                        key={key}
                        className="border-b border-card-foreground"
                      >
                        <TableCell className="font-bold text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </TableCell>
                        <TableCell
                          className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                          style={{ width: '100%' }}
                        >
                          {value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </>
  )
}
