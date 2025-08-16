'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBannerMember from '@/components/hero-banner-member'
import ScrollAreaMember from '@/components/scroll-area-member'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function FavoriteDataPage() {
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
        訂單金額: 4680,
      },
    },
  ]

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBannerMember
        backgroundImage="/banner/member-banner.jpg"
        title="會員中心"
        overlayOpacity="bg-primary/50"
      ></HeroBannerMember>
      <ScrollAreaMember />
      <section className="py-10">
        <div className="container flex justify-center mx-auto max-w-screen-xl px-4">
          <div className="bg-card rounded-lg p-6">
            <Table className="w-full table-fixed">
              <TableHeader className="border-b-2 border-card-foreground">
                <TableRow className="text-lg">
                  <TableHead className="font-bold w-1/2 text-accent-foreground">
                    訂單編號
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-accent-foreground">
                    進度
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-accent-foreground text-center">
                    訂單金額
                  </TableHead>
                  <TableHead className="font-bold w-1/4 text-accent-foreground text-center">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-foreground">
                {order.map((orderItem) => {
                  // 只顯示與 table header 對應的欄位
                  const filteredData = {
                    訂單編號: orderItem.item.訂單編號,
                    進度: '處理中', // 假設的進度狀態
                    訂單金額: orderItem.item.訂單金額,
                  }

                  return (
                    <TableRow
                      key={orderItem.id}
                      className="border-b border-card-foreground"
                    >
                      <TableCell className="font-bold text-base py-2 text-accent-foreground align-top">
                        {filteredData.訂單編號}
                      </TableCell>
                      <TableCell className="text-base py-2 text-accent-foreground align-top">
                        {filteredData.進度}
                      </TableCell>
                      <TableCell className="text-base py-2 text-accent-foreground align-top text-center">
                        NTD${filteredData.訂單金額}
                      </TableCell>
                      <TableCell className="py-2 align-top justify-center text-center flex gap-2">
                        <Button className="w-[80px] bg-transparent border border-primary text-primary hover:bg-transparent hover:text-primary">
                          取消
                        </Button>
                        <Button variant="outline" className="w-[80px]">
                          詳細
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
