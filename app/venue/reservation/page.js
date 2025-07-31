'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import Step from '@/components/step'
import Footer from '@/components/footer'
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from '@/components/date-picker-calendar'

const steps = [
  { id: 1, title: '選擇場館', completed: true },
  { id: 2, title: '選擇時間', completed: true },
  { id: 3, title: '填寫資料', active: true },
  { id: 4, title: '付款確認', completed: false },
]

// 日期狀態設定
const dateStatuses = {
  available: {
    label: '可預約',
    color: 'bg-green-100 text-green-800',
    clickable: true,
  },
  full: { label: '已額滿', color: 'bg-red-100 text-red-800', clickable: false },
  closed: {
    label: '未開放',
    color: 'bg-gray-100 text-gray-500',
    clickable: false,
  },
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// 生成隨機 ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// 生成隨機日期
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

// 生成帶狀態的日期資料
const generateDateWithStatus = () => {
  const today = new Date()
  const dateData = {}

  // 生成未來30天的資料
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = date.toISOString().split('T')[0]

    // 隨機分配狀態
    const statusKeys = Object.keys(dateStatuses)
    const randomStatus =
      statusKeys[Math.floor(Math.random() * statusKeys.length)]

    dateData[dateKey] = {
      date: date,
      status: randomStatus,
      availableSlots:
        randomStatus === 'available' ? Math.floor(Math.random() * 10) + 1 : 0,
    }
  }

  return dateData
}

const dateData = generateDateWithStatus()

// 計算年份範圍
const currentYear = new Date().getFullYear()
const earliestYear = currentYear - 1
const latestYear = currentYear + 2

export default function ReservationPage() {
  const [selectedDate, setSelectedDate] = useState(null)

  const handleDateSelect = (date, dateInfo) => {
    if (dateInfo && dateStatuses[dateInfo.status].clickable) {
      setSelectedDate(date)
      console.log('選擇的日期:', date, '狀態:', dateInfo.status)
    }
  }

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <section>
            <Step
              steps={steps}
              orientation="horizontal"
              onStepClick={(step, index) => console.log('Clicked step:', step)}
            />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">選擇預約日期</h2>
            <CalendarProvider
              dateData={dateData}
              dateStatuses={dateStatuses}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            >
              <CalendarDate>
                <CalendarDatePicker>
                  <CalendarMonthPicker />
                  <CalendarYearPicker end={latestYear} start={earliestYear} />
                </CalendarDatePicker>
                <CalendarDatePagination />
              </CalendarDate>
              <CalendarHeader />
              <CalendarBody
                dateData={dateData}
                dateStatuses={dateStatuses}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </CalendarProvider>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
