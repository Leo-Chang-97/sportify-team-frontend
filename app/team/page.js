'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { TeamCard } from '@/components/card/team-card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner from '@/components/hero-banner'
import ScrollAreaSport from '@/components/scroll-area-sport'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

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

// 分頁選單元件 (維持不變)
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="icon"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function TeamPage() {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null)
  const [teams, setTeams] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // ===== 【核心修改 1】新增狀態來管理排序選項 =====
  const [sortBy, setSortBy] = useState('newest') // 預設為 "由新到舊"
  

  // ===== 【核心修改 2】更新 useEffect 的依賴，當排序或頁碼改變時重新載入資料 =====
  useEffect(() => {
    const loadTeams = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // 將 sortBy 參數加入 API 請求中
        const data = await fetchAPI(
          `/api/team/teams?page=${currentPage}&limit=12&sortBy=${sortBy}`
        )
        setTeams(data.teams || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        setError(err.message)
        console.error('載入隊伍列表失敗:', err)
      } finally {
        setIsLoading(false)
        setExpandedCardIndex(null)
      }
    }
    loadTeams()
  }, [currentPage, sortBy]) // 當 currentPage 或 sortBy 改變時，重新執行

  // 當排序選項改變時，將頁碼重設回第一頁
  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handleToggleExpand = (index) => {
    setExpandedCardIndex((prevIndex) => (prevIndex === index ? null : index))
  }

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/team-banner.jpg"
        title="馬上加入團隊"
        overlayOpacity="bg-primary/10"
      />
      <ScrollAreaSport />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <div className="self-stretch text-center justify-start text-white text-xl font-normal leading-loose tracking-[24px]">
            推·薦·隊·伍
          </div>

          {/* ===== 【核心修改 3】調整版面佈局 ===== */}
          <div className="self-stretch flex justify-between items-center gap-4">
            {/* 左側按鈕群組 */}
            <div className="flex items-center gap-2">
              <Link href="/team/create" passHref>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-highlight transition-all duration-300 bg-[size:200%_auto] hover:bg-[position:right_center]"
                >
                  創建隊伍 <ArrowRight />
                </Button>
              </Link>
              <Link href="/team/ourteam" passHref>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-highlight transition-all duration-300 bg-[size:200%_auto] hover:bg-[position:right_center]"
                >
                  我的隊伍 <ArrowRight />
                </Button>
              </Link>
            </div>
            {/* 右側排序選單 */}
            <div className="w-48">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full bg-card text-card-foreground">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">由新到舊 (時間)</SelectItem>
                  <SelectItem value="oldest">由舊到新 (時間)</SelectItem>
                  <SelectItem value="members_desc">人數由多到少</SelectItem>
                  <SelectItem value="members_asc">人數由少到多</SelectItem>
                  <SelectItem value="level_desc">等級由高到低</SelectItem>
                  <SelectItem value="level_asc">等級由低到高</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-white py-20 text-lg">
              載入隊伍中，請稍候...
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-20 text-lg">
              載入失敗：{error}
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center text-gray-400 py-20 text-lg">
              目前沒有任何隊伍。
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {teams.map((team, index) => (
                  <TeamCard
                    key={team.id}
                    isExpanded={expandedCardIndex === index}
                    onToggleExpand={() => handleToggleExpand(index)}
                    teamName={team.name}
                    sportType={team.court?.sport?.name || '未知運動'}
                    currentMembers={team.memberCount}
                    maxMembers={team.capacity || 12}
                    location={team.court?.center?.name || '未知地點'}
                    time={team.practiceTime}
                    skillLevel={team.level?.name || '未知等級'}
                    isNews={team.isFeatured}
                    imageUrl={team.coverImageUrl}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
