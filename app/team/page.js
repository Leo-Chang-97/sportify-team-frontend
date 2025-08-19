'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TeamCard } from '@/components/card/team-card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import { fetchSportOptions } from '@/api'
import HeroBanner, { SearchField } from '@/components/hero-banner'
import ScrollAreaSport from '@/components/scroll-area-sport'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ArrowRight, Search } from 'lucide-react'
import { teamService } from '@/api/team/team'
import { PaginationBar } from '@/components/pagination-bar'

// --- 修改開始 (1/2): 新增格式化函式 ---
/**
 * 格式化練習時程陣列為可讀字串
 * @param {Array} schedules - 包含練習時程物件的陣列
 * @returns {string} - 格式化後的字串
 */
const formatSchedules = (schedules) => {
  // 如果沒有時程資料或陣列是空的，回傳預設文字
  if (!schedules || schedules.length === 0) {
    return '練習時間未定'
  }

  // 建立星期的對照表
  const dayMap = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
  }

  // 格式化單筆時程的時間部分
  const timeFormatter = new Intl.DateTimeFormat('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei', // 確保時區一致
  })

  // 將所有時程轉換為 "週X HH:mm" 的格式
  const formattedStrings = schedules.map((s) => {
    const day = dayMap[s.dayOfWeek] || '？'
    const startTime = timeFormatter.format(new Date(s.startTime))
    return `週${day} ${startTime}`
  })

  // 將所有格式化後的字串用「、」連接起來
  return formattedStrings.join('、')
}
// --- 修改結束 (1/2) ---

export default function TeamPage() {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null)
  const [teams, setTeams] = useState([])
  const [sports, setSports] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [expandedTeamDetails, setExpandedTeamDetails] = useState(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // 從 URL 讀取初始值，或使用預設值
  const [locationId, setLocationId] = useState(
    searchParams.get('locationId') || 'all'
  )
  const [sportId, setSportId] = useState(searchParams.get('sportId') || 'all')
  const [minRating, setMinRating] = useState(
    searchParams.get('minRating') || 'all'
  )
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')

  const [locations, setLocations] = useState([]) // 用於存放地區選項

  const handleSearch = (keyword, customSportId) => {
    const newParams = new URLSearchParams(searchParams.toString())
    // 地區
    if (locationId && locationId !== 'all') {
      newParams.set('locationId', locationId)
    } else {
      newParams.delete('locationId')
    }
    // 運動
    const sportValue = customSportId ?? sportId
    if (sportValue && sportValue !== 'all') {
      newParams.set('sportId', sportValue)
    } else {
      newParams.delete('sportId')
    }
    // 評分
    if (minRating && minRating !== 'all') {
      newParams.set('minRating', minRating)
    } else {
      newParams.delete('minRating')
    }
    // 關鍵字
    if (keyword) {
      newParams.set('keyword', keyword)
    } else {
      newParams.delete('keyword')
    }
    newParams.set('page', '1') // 搜尋時重設分頁
    router.push(`?${newParams.toString()}`)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])
      } catch (error) {
        console.error('載入選項失敗:', error)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    const loadTeams = async () => {
      setIsLoading(true)
      setError(null)
      try {
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
        setExpandedCardIndex(null)
      }
    }
    loadTeams()
  }, [currentPage, sortBy])

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handleToggleExpand = async (index, teamId) => {
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null)
      setExpandedTeamDetails(null)
      return
    }

    setExpandedCardIndex(index)
    setExpandedTeamDetails(null)
    setIsDetailLoading(true)

    try {
      const result = await teamService.fetchById(teamId)
      if (result.success) {
        setExpandedTeamDetails(result.team)
      } else {
        throw new Error(result.error || '無法載入隊伍詳情')
      }
    } catch (err) {
      console.error(`獲取隊伍 ${teamId} 詳細資料失敗:`, err)
      setError(`無法載入隊伍詳情: ${err.message}`)
    } finally {
      setIsDetailLoading(false)
    }
  }

  const searchFields = [
    {
      label: '地區',
      component: (
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
            <SelectValue placeholder="請選擇地區" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              全部
            </SelectItem>
            {locations.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
            ) : (
              locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id.toString()}>
                  {loc.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '運動',
      component: (
        <Select value={sportId} onValueChange={setSportId}>
          <SelectTrigger className="w-full bg-accent text-accent-foreground !h-10">
            <SelectValue placeholder="請選擇運動" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              全部
            </SelectItem>
            {sports?.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
            ) : (
              sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id.toString()}>
                  {sport.name || sport.id}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '關鍵字',
      component: (
        <div className="relative flex items-center">
          <Search
            className="absolute left-3 text-accent-foreground/50"
            size={20}
          />
          <Input
            type="search"
            className="w-full bg-accent text-accent-foreground !h-10 pl-10"
            placeholder="請輸入關鍵字"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(keyword)
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/team-banner.jpg"
        title="馬上加入團隊"
        overlayOpacity="bg-primary/50"
      >
        <SearchField
          fields={searchFields}
          onSearch={() => handleSearch(keyword)}
          searchButtonText="搜尋"
        />
      </HeroBanner>
      <ScrollAreaSport
        sportItems={sports}
        onSportSelect={(id) => {
          setSportId(id)
          handleSearch(keyword, id)
        }}
      />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <div className="self-stretch text-center justify-start text-foreground text-xl font-normal leading-loose tracking-[24px]">
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
            <div className="text-center text-foreground py-20 text-lg">
              載入隊伍中，請稍候...
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-20 text-lg">
              載入失敗：{error}
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center text-foreground py-20 text-lg">
              目前沒有任何隊伍。
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {teams.map((team, index) => (
                  <TeamCard
                    key={team.id}
                    isExpanded={expandedCardIndex === index}
                    onToggleExpand={() => handleToggleExpand(index, team.id)}
                    teamName={team.name}
                    sportType={team.court?.sport?.name || '未知運動'}
                    currentMembers={team._count?.TeamMember || 0}
                    maxMembers={team.capacity || 12}
                    location={team.court?.center?.name || '未知地點'}
                    time={formatSchedules(team.schedules)}
                    skillLevel={team.level?.name || '未知等級'}
                    isNews={team.isFeatured}
                    imageUrl={team.coverImageUrl}
                    // --- 修改開始: 傳遞 description 和詳細資料 ---
                    description={team.description} // 將隊伍描述傳入
                    details={
                      expandedCardIndex === index ? expandedTeamDetails : null
                    }
                    isDetailLoading={
                      expandedCardIndex === index && isDetailLoading
                    }
                  />
                ))}
              </div>
              <div className="pt-5 mt-auto">
                <PaginationBar
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
