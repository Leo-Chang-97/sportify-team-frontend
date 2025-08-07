'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link' // 保留 Link 元件
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner, { SearchField } from '@/components/hero-banner'
import { Button } from '@/components/ui/button'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

const cn = (...inputs) => {
  return twMerge(clsx(inputs))
}
const Table = ({ className, ...props }) => {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-lg shadow-lg border-2 border-secondary-foreground"
    >
      <table
        data-slot="table"
        className={cn(
          'w-full caption-bottom text-sm bg-card dark:bg-card-foreground',
          className
        )}
        {...props}
      />
    </div>
  )
}

const TableHeader = ({ className, ...props }) => {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  )
}

const TableBody = ({ className, ...props }) => {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

const TableRow = ({ className, ...props }) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
        className
      )}
      {...props}
    />
  )
}

const TableHead = ({ className, ...props }) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-12 px-4 text-center align-middle text-lg text-gray-700 dark:text-ring bg-gray-50 dark:bg-gray-900 whitespace-nowrap',
        className
      )}
      {...props}
    />
  )
}

const TableCell = ({ className, ...props }) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'p-4 align-middle text-gray-800 dark:text-gray-200 text-center',
        className
      )}
      {...props}
    />
  )
}

const TableCaption = ({ className, ...props }) => {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        'text-muted-foreground bg-card text-base text-center whitespace-nowrap',
        className
      )}
      {...props}
    />
  )
}

// Mock data to simulate fetching from a database
// 這是模擬的資料庫資料，用來在應用程式中呈現。
// 實際應用中，您會從資料庫中獲取這些資料。
const mockTeams = [
  {
    id: 1,
    teamName: '雄獅籃球隊',
    establishmentDate: '2023-01-15',
    memberCount: 12,
    sport: '籃球',
    venue: '台北市立體育館',
  },
  {
    id: 2,
    teamName: '飛羽隊',
    establishmentDate: '2022-05-20',
    memberCount: 8,
    sport: '羽球',
    venue: '新北羽球館',
  },
  {
    id: 3,
    teamName: '桌球達人',
    establishmentDate: '2021-09-01',
    memberCount: 6,
    sport: '桌球',
    venue: '台中運動中心',
  },
  {
    id: 4,
    teamName: '網球旋風',
    establishmentDate: '2020-03-10',
    memberCount: 15,
    sport: '網球',
    venue: '高雄小巨蛋',
  },
  {
    id: 5,
    teamName: '排球戰神',
    establishmentDate: '2022-07-07',
    memberCount: 10,
    sport: '排球',
    venue: '台南體育場',
  },
]

export default function ourTeam() {
  // const router = useRouter() // <--- 移除 useRouter Hook

  // 處理儲存的點擊事件（您可以將您的表單提交邏輯放在這裡）
  const handleSave = () => {
    console.log('儲存按鈕被點擊！')
    // 在這裡處理表單資料並發送到後端
  }

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/team-banner.jpg"
        title="馬上加入團隊"
        overlayOpacity="bg-primary/10"
      ></HeroBanner>
      <div className="container mx-auto max-w-screen-xl px-4 gap-8">
        <div className="w-full h-[814px] max-w-[1140px] py-20 flex flex-col justify-center items-center gap-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-popover dark:text-popover-foreground">
            你隸屬的隊伍資訊
          </h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">隊伍名稱</TableHead>
                <TableHead>隊伍成立時間</TableHead>
                <TableHead>隊伍人數</TableHead>
                <TableHead>運動種類</TableHead>
                <TableHead>運動場館地點</TableHead>
                <TableHead>傳送門</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium text-lg text-blue-600 dark:text-blue-400">
                    {team.teamName}
                  </TableCell>
                  <TableCell className="text-muted-foreground dark:text-ring">
                    {team.establishmentDate}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {team.memberCount}
                  </TableCell>
                  <TableCell className="text-muted-foreground dark:text-ring">
                    {team.sport}
                  </TableCell>
                  <TableCell className="text-muted-foreground dark:text-ring">
                    {team.venue}
                  </TableCell>
                  <TableCell>
                    <Link href="/team/ourteam/teampage" passHref>
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-gradient-to-r from-highlight to-primary relative group"
                      >
                        {/* 遮罩效果 */}
                        <div
                          className="absolute inset-0 bg-popover-foreground opacity-0 transition-opacity duration-300 ease-in-out
                                 group-hover:opacity-30 pointer-events-none z-0"
                        ></div>
                        {/* 按鈕文字 */}
                        <span className="justify-start text-popover font-bold leading-7 z-10">
                          Door
                        </span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              <TableCaption className="text-muted-foreground dark:text-ting">
                一份模擬的運動隊伍列表。
              </TableCaption>
            </TableBody>
          </Table>

          {/* <--- 這裡開始是按鈕群組的修改 ---> */}
          <div className="self-stretch inline-flex justify-between items-start">
            {/* 使用 <Link> 包裹 <Button>，導航至 /team */}
            <Link href="/team" passHref>
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-highlight to-primary relative group"
              >
                {/* 遮罩效果 */}
                <div
                  className="absolute inset-0 bg-popover-foreground opacity-0 transition-opacity duration-300 ease-in-out
                                 group-hover:opacity-30 pointer-events-none z-0"
                ></div>
                {/* 按鈕文字 */}
                <span className="justify-start text-popover font-bold leading-7 z-10">
                  返回上一頁
                </span>
              </Button>
            </Link>

            {/* 「儲存」按鈕 */}
            <Button
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-highlight to-primary relative group"
            >
              {/* 遮罩效果 */}
              <div
                className="absolute inset-0 bg-popover-foreground opacity-0 transition-opacity duration-300 ease-in-out
                                 group-hover:opacity-30 pointer-events-none z-0"
              ></div>
              {/* 按鈕文字 */}
              <span className="justify-start text-popover font-bold leading-7 z-10">
                儲存
              </span>
            </Button>
          </div>
          {/* <--- 按鈕群組的修改結束 ---> */}
        </div>
      </div>
      <Footer />
    </>
  )
}
