'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner from '@/components/hero-banner'
import { Button } from '@/components/ui/button'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// --- 輔助元件 (維持不變) ---
const cn = (...inputs) => {
  return twMerge(clsx(inputs))
}
const Table = ({ className, ...props }) => (
  <div className="relative w-full overflow-x-auto rounded-lg shadow-lg border-2 border-secondary-foreground">
    <table
      className={cn(
        'w-full caption-bottom text-sm bg-card dark:bg-card-foreground',
        className
      )}
      {...props}
    />
  </div>
)
const TableHeader = ({ className, ...props }) => (
  <thead className={cn('[&_tr]:border-b', className)} {...props} />
)
const TableBody = ({ className, ...props }) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)
const TableRow = ({ className, ...props }) => (
  <tr
    className={cn(
      'border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
      className
    )}
    {...props}
  />
)
const TableHead = ({ className, ...props }) => (
  <th
    className={cn(
      'h-12 px-4 text-center align-middle text-lg text-gray-700 dark:text-ring bg-gray-50 dark:bg-gray-900 whitespace-nowrap',
      className
    )}
    {...props}
  />
)
const TableCell = ({ className, ...props }) => (
  <td
    className={cn(
      'p-4 align-middle text-gray-800 dark:text-gray-200 text-center',
      className
    )}
    {...props}
  />
)

// --- API 請求相關設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchAPI(url) {
  if (!API_BASE_URL) {
    throw new Error('前端環境變數 NEXT_PUBLIC_API_BASE_URL 未設定！')
  }
  const fullUrl = `${API_BASE_URL}${url}`
  const res = await fetch(fullUrl)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `請求 ${fullUrl} 失敗`)
  }
  return res.json()
}

// ===== 【新】分頁元件 =====
function Pagination({ currentPage, totalPages, onPageChange }) {
  // 如果總頁數小於等於1，則不顯示分頁
  if (totalPages <= 1) {
    return null
  }

  const handlePrev = () => {
    onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    onPageChange(currentPage + 1)
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        onClick={handlePrev}
        disabled={currentPage === 1}
        variant="outline"
        size="icon"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-white font-semibold">
        第 {currentPage} 頁 / 共 {totalPages} 頁
      </span>
      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        variant="outline"
        size="icon"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function OurTeamPage() {
  // ===== 【核心修改 1】新增狀態來管理從 API 獲取的資料 =====
  const [teams, setTeams] = useState([]) // 用來儲存真實的隊伍資料
  const [isLoading, setIsLoading] = useState(true) // 追蹤載入狀態
  const [error, setError] = useState(null) // 追蹤錯誤狀態
  const [currentPage, setCurrentPage] = useState(1) // 目前頁碼，預設為第1頁
  const [totalPages, setTotalPages] = useState(1) // 總頁數

  // ===== 【核心修改 2】使用 useEffect 在組件載入時，向後端請求資料 =====
  useEffect(() => {
    // 1. 定義一個非同步函式來獲取資料
    const loadTeams = async () => {
      setIsLoading(true) // 開始載入，顯示 "載入中..."
      setError(null)
      try {
        // 2. 呼叫 API 時，使用當前的 `currentPage` 狀態來請求對應頁面的資料
        const data = await fetchAPI(
          `/api/team/teams?page=${currentPage}&limit=12`
        ) // 每頁顯示12筆
        // 注意：您的 listTeams API 回傳的結構是 { teams: [...] }
        setTeams(data.teams || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        setError(err.message)
        console.error('載入隊伍列表失敗:', err)
      } finally {
        setIsLoading(false) //載入結束,無論成功或失敗
      }
    }

    // 3. 執行這個函式
    loadTeams()
  }, [currentPage]) // 4. 【最重要的部分】將 `currentPage` 加入依賴陣列。
  //    這告訴 React: "請監聽 currentPage，只要它一改變，就重新執行上面的所有程式碼！"

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
        <div className="w-full min-h-[814px] max-w-[1140px] py-20 flex flex-col justify-start items-center gap-8">
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
                <TableHead>練習場館</TableHead>
                <TableHead>隊伍專頁</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* ===== 【核心修改 3】根據載入狀態顯示不同內容 ===== */}
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan="6"
                    className="h-24 text-center text-muted-foreground"
                  >
                    資料載入中...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan="6"
                    className="h-24 text-center text-red-500"
                  >
                    載入失敗：{error}
                  </TableCell>
                </TableRow>
              ) : teams.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan="6"
                    className="h-24 text-center text-muted-foreground"
                  >
                    目前沒有任何隊伍。
                  </TableCell>
                </TableRow>
              ) : (
                // ===== 【核心修改 4】使用從 API 來的 teams 資料來渲染表格內容 =====
                teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium text-lg text-blue-600 dark:text-blue-400">
                      {team.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground dark:text-ring">
                      {/* 將 ISO 日期字串格式化為 YYYY-MM-DD */}
                      {new Date(team.createdAt).toLocaleDateString('zh-TW')}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {team.memberCount}
                    </TableCell>
                    <TableCell className="text-muted-foreground dark:text-ring">
                      {team.court?.sport?.name || '未知'}
                    </TableCell>
                    <TableCell className="text-muted-foreground dark:text-ring">
                      {team.court?.center?.name || '未知'}
                    </TableCell>
                    <TableCell>
                      <Link href={`/team/ourteam/teampage/${team.id}`} passHref>
                        <Button
                          variant="default"
                          size="lg"
                          className="bg-gradient-to-r from-highlight to-primary relative group"
                        >
                          <div className="absolute inset-0 bg-popover-foreground opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-30 pointer-events-none z-0"></div>
                          <span className="justify-start text-popover font-bold leading-7 z-10">
                            點擊
                          </span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <div className="self-stretch inline-flex justify-between items-start">
            <Link href="/team" passHref>
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-highlight to-primary relative group"
              >
                <div className="absolute inset-0 bg-popover-foreground opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-30 pointer-events-none z-0"></div>
                <span className="justify-start text-popover font-bold leading-7 z-10">
                  返回上一頁
                </span>
              </Button>
            </Link>

            <Button
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-highlight to-primary relative group"
            >
              <div className="absolute inset-0 bg-popover-foreground opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-30 pointer-events-none z-0"></div>
              <span className="justify-start text-popover font-bold leading-7 z-10">
                儲存
              </span>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
