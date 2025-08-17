'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { TeamCard } from '@/components/card/team-card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import { fetchSportOptions } from '@/api'
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
import { teamService } from '@/api/team/team'

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
  const [sports, setSports] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  // ===== 【新增】用於儲存展開卡片的詳細資訊 =====
  const [expandedTeamDetails, setExpandedTeamDetails] = useState(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])
      } catch (error) {
        console.error('載入選項失敗:', error)
        toast.error('載入選項失敗')
      }
    }
    loadData()
  }, [])
  useEffect(() => {
    const loadTeams = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // ===== 【修改 2】使用 teamService.fetchAll 來獲取隊伍列表 =====
        const data = await teamService.fetchAll({
          page: currentPage,
          limit: 12,
          sortBy: sortBy,
        })
        setTeams(data.teams || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        setError(err.message || '載入隊伍列表失敗')
        console.error('載入隊伍列表失敗:', err)
      } finally {
        setIsLoading(false)
        setExpandedCardIndex(null) // 每次重新載入列表時，收合所有卡片
      }
    }
    loadTeams()
  }, [currentPage, sortBy])

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  // ===== 【修改 3】重構 handleToggleExpand，使其在展開時獲取詳細資料 =====
  const handleToggleExpand = async (index, teamId) => {
    // 如果是關閉當前已展開的卡片
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null)
      setExpandedTeamDetails(null)
      return
    }

    // 如果是打開新的卡片
    setExpandedCardIndex(index)
    setExpandedTeamDetails(null) // 先清除舊資料
    setIsDetailLoading(true)

    try {
      // 使用 teamService.fetchById 來獲取單一隊伍的詳細資料
      const result = await teamService.fetchById(teamId)
      if (result.success) {
        setExpandedTeamDetails(result.team) // 後端回傳的資料在 result.team 中
      } else {
        throw new Error(result.error || '無法載入隊伍詳情')
      }
    } catch (err) {
      console.error(`獲取隊伍 ${teamId} 詳細資料失敗:`, err)
      // 可選擇性地在 UI 上顯示錯誤
      setError(`無法載入隊伍詳情: ${err.message}`)
    } finally {
      setIsDetailLoading(false)
    }
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
      <ScrollAreaSport sportItems={sports} />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <div className="self-stretch text-center justify-start text-white text-xl font-normal leading-loose tracking-[24px]">
            推·薦·隊·伍
          </div>

          <div className="self-stretch flex justify-between items-center gap-4">
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
                    // ===== 【修改 4】將 team.id 傳入 onToggleExpand =====
                    onToggleExpand={() => handleToggleExpand(index, team.id)}
                    teamName={team.name}
                    sportType={team.court?.sport?.name || '未知運動'}
                    currentMembers={team._count?.TeamMember || 0}
                    maxMembers={team.capacity || 12}
                    location={team.court?.center?.name || '未知地點'}
                    time={team.practiceTime}
                    skillLevel={team.level?.name || '未知等級'}
                    isNews={team.isFeatured}
                    imageUrl={team.coverImageUrl}
                    // ===== 【修改 5】將詳細資料和載入狀態傳遞給卡片 =====
                    details={
                      expandedCardIndex === index ? expandedTeamDetails : null
                    }
                    isDetailLoading={
                      expandedCardIndex === index && isDetailLoading
                    }
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
