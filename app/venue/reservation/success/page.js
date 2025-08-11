'use client'

// hooks
import React, { useState, useEffect, useMemo } from 'react'

// Icon
import { FaXmark, FaCheck } from 'react-icons/fa6'

// API 請求
import { fetchReservation } from '@/api/venue/reservation'
import { fetchCenter } from '@/api/venue/center'
import { getCenterImageUrl } from '@/api/venue/image'

// next 元件
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

// UI 元件
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AspectRatio } from '@/components/ui/aspect-ratio'

// 自訂元件
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
import { LoadingState, ErrorState } from '@/components/loading-states'

export default function SuccessPage() {
  // #region 路由和URL參數
  const searchParams = useSearchParams()

  // #region 狀態管理
  const [isSuccess, setIsSuccess] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [centerData, setCenterData] = useState(null)
  const [centerId, setCenterId] = useState('')
  const reservationId = searchParams.get('reservationId')
  const [reservationData, setReservationData] = useState(null)

  // #region 副作用處理

  // #region Reservation訂單資料
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!reservationId) {
        setError('未找到訂單 ID')
        setIsSuccess(false)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await fetchReservation(reservationId)

        if (result.success && result.record) {
          setReservationData(result.record)
          setIsSuccess(true)

          // 提取 centerId 並取得場館資料
          const firstSlot = result.record.courtTimeSlots?.[0]
          if (firstSlot && firstSlot.centerId) {
            setCenterId(firstSlot.centerId)
          }
        } else {
          setError(result.message || '取得訂單資料失敗')
          setIsSuccess(false)
        }
      } catch (err) {
        console.error('取得訂單資料錯誤:', err)
        setError('載入訂單資料時發生錯誤')
        setIsSuccess(false)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [reservationId])

  // #region Center中心資料
  useEffect(() => {
    const fetchCenterData = async () => {
      if (!centerId) return

      try {
        const centerResult = await fetchCenter(centerId)

        if (centerResult.success && centerResult.record) {
          setCenterData(centerResult.record)
        } else {
          console.error('取得 Center 資料失敗:', centerResult.message)
        }
      } catch (err) {
        console.error('Error fetching center detail:', err)
        console.error('載入場館資料失敗')
      }
    }

    fetchCenterData()
  }, [centerId])

  // 計算總金額 (從 courtTimeSlots 計算或使用 price)
  const totalPrice = reservationData?.price || 0

  // #region 載入和錯誤狀態處理
  if (loading) {
    return <LoadingState message="載入訂單資料中..." />
  }

  // #region 資料顯示選項
  const steps = [
    { id: 1, title: '選擇場地與時間', completed: true },
    { id: 2, title: '填寫付款資訊', completed: true },
    { id: 3, title: '完成訂單', active: true },
  ]

  // #region Markup
  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          {/* 步驟 */}
          <section>
            <Step
              steps={steps}
              orientation="horizontal"
              onStepClick={(step, index) => {}}
            />
          </section>
          {/* 預訂成功訊息 */}
          <section>
            <div className="flex flex-col items-center gap-4 py-4 md:py-8">
              {isSuccess ? (
                <>
                  <div className="rounded-full bg-highlight p-4">
                    <FaCheck className="text-4xl text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-accent">預訂成功</h2>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-highlight p-4">
                    <FaXmark className="text-4xl text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-accent">預訂失敗</h2>
                </>
              )}
            </div>
          </section>

          <div className="mx-auto md:max-w-screen-lg gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* 訂單詳細 */}
              <section className="flex-1 w-full">
                <h2 className="text-xl font-semibold mb-4">付款資訊</h2>
                {/* 訂單摘要卡片 */}
                <Card>
                  <CardContent className="space-y-4">
                    <Table className="w-full table-fixed">
                      <TableBody className="divide-y divide-foreground">
                        <TableRow className="border-b border-card-foreground">
                          <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                            訂單編號
                          </TableCell>
                          <TableCell
                            className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                            style={{ width: '100%' }}
                          >
                            {reservationId || '未知'}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b border-card-foreground">
                          <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                            預訂人
                          </TableCell>
                          <TableCell
                            className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                            style={{ width: '100%' }}
                          >
                            {reservationData?.memberName || '未知'}
                          </TableCell>
                        </TableRow>

                        <TableRow className="border-b border-card-foreground">
                          <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                            狀態
                          </TableCell>
                          <TableCell
                            className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                            style={{ width: '100%' }}
                          >
                            {reservationData?.status?.name || '未知'}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b border-card-foreground">
                          <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                            建立時間
                          </TableCell>
                          <TableCell
                            className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                            style={{ width: '100%' }}
                          >
                            {reservationData?.createdAt || '未知'}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b border-card-foreground">
                          <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                            發票號碼
                          </TableCell>
                          <TableCell
                            className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                            style={{ width: '100%' }}
                          >
                            {reservationData?.invoiceNumber || '未知'}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b border-card-foreground">
                          <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                            發票類型
                          </TableCell>
                          <TableCell
                            className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                            style={{ width: '100%' }}
                          >
                            {reservationData?.invoice.name || '未知'}
                            {reservationData?.invoiceId === 2 && (
                              <span className="ml-2 text-muted-foreground">
                                {reservationData?.tax
                                  ? `${reservationData.tax}`
                                  : ''}
                              </span>
                            )}
                            {reservationData?.invoiceId === 3 && (
                              <span className="ml-2 text-muted-foreground">
                                {reservationData?.carrier
                                  ? `${reservationData.carrier}`
                                  : ''}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b border-card-foreground">
                          <TableCell className="font-medium text-base py-2 text-accent-foreground align-top !w-[120px] !min-w-[120px] !max-w-[160px] whitespace-nowrap overflow-hidden">
                            付款方式
                          </TableCell>
                          <TableCell
                            className="text-base py-2 whitespace-normal text-accent-foreground align-top break-words"
                            style={{ width: '100%' }}
                          >
                            {reservationData?.payment?.name || '未知'}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </section>

              {/* 訂單確認 */}
              <section className="order-1 md:order-2 flex-1 w-full">
                <h2 className="text-xl font-semibold mb-4">您的訂單</h2>
                {/* 訂單摘要卡片 */}
                <Card>
                  <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
                    {/* 場館資訊 */}
                    <div className="space-y-2 order-2 md:order-1">
                      <h4 className="font-medium text-accent-foreground">
                        場館資訊
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          地區: {centerData?.location?.name || '載入中...'}
                        </div>
                        <div>地址: {centerData?.address || '載入中...'}</div>
                        <div>中心: {centerData?.name || '載入中...'}</div>
                        <div>
                          運動:{' '}
                          {reservationData?.courtTimeSlots[0]?.sportName ||
                            '載入中...'}
                        </div>
                      </div>
                    </div>
                    {/* 預約圖片 */}
                    {centerData &&
                    centerData.images &&
                    Array.isArray(centerData.images) &&
                    centerData.images.length > 0 ? (
                      <div className="w-full md:w-50 min-w-0 flex-shrink-0 overflow-hidden rounded-lg order-1">
                        <AspectRatio ratio={4 / 3} className="bg-muted">
                          <Image
                            alt={centerData.name || '場館圖片'}
                            className="object-cover"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 320px"
                            src={getCenterImageUrl(centerData.images[0])}
                          />
                        </AspectRatio>
                      </div>
                    ) : (
                      <div className="w-full md:w-50 min-w-0 flex-shrink-0 overflow-hidden rounded-lg order-1 bg-gray-200 flex items-center justify-center">
                        <AspectRatio
                          ratio={4 / 3}
                          className="bg-muted flex items-center justify-center"
                        >
                          <span className="text-gray-500">無圖片</span>
                        </AspectRatio>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 預約日期 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-accent-foreground">
                        預約日期
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        {reservationData?.date || '未知日期'}
                      </div>
                    </div>

                    {/* 場地時段 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-accent-foreground">
                        場地時段
                      </h4>
                      {reservationData?.courtTimeSlots?.length > 0 ? (
                        <div className="space-y-2">
                          {reservationData.courtTimeSlots.map((slot, index) => (
                            <div
                              key={index}
                              className="text-sm text-muted-foreground bg-muted p-2 rounded"
                            >
                              <div className="font-medium">
                                {slot.courtName}
                              </div>
                              <div className="flex justify-between">
                                <span>{slot.timeLabel}</span>
                                <span>{slot.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          無場地時段資料
                        </div>
                      )}
                    </div>

                    {/* 總計 */}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">
                          總計
                        </span>
                        <span className="text-lg font-bold text-primary">
                          NT$ {totalPrice}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
            {/* 按鈕區 */}
            <section className="mt-6">
              <div className="flex justify-between">
                <Link href="/venue/order">
                  <Button variant="outline">查看訂單</Button>
                </Link>
                <Link href="/venue">
                  <Button variant="highlight">返回列表頁</Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
