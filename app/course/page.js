'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  createReservation,
  fetchReservation,
  updateReservation,
  fetchMemberOptions,
  fetchLocationOptions,
  fetchTimePeriodOptions,
  fetchCenterOptions,
  fetchSportOptions,
  fetchCourtOptions,
  fetchTimeSlotOptions,
  fetchCourtTimeSlotOptions,
  fetchStatusOptions,
} from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner, { SearchField } from '@/components/hero-banner'
import ScrollAreaSport from '@/components/scroll-area-sport'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CourseCard from '@/components/card/course-card'
import { ChevronDownIcon } from 'lucide-react'

export default function VenueListPage() {
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)

  const [memberId, setMemberId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [centerId, setCenterId] = useState('')
  const [sportId, setSportId] = useState('')
  const [courtId, setCourtIds] = useState('')
  const [timePeriodId, setTimePeriodId] = useState('')
  const [timeSlotId, setTimeSlotIds] = useState('')
  const [courtTimeSlotId, setCourtTimeSlotIds] = useState('')
  const [statusId, setStatusId] = useState('')
  const [date, setDate] = useState(null)
  const [price, setPrice] = useState('')

  // ===== 新增：關鍵字搜尋狀態 =====
  const [keyword, setKeyword] = useState('')

  // ===== 新增：分頁相關狀態 =====
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6) // 每頁顯示6個課程
  const [displayedCourses, setDisplayedCourses] = useState([]) // 當前顯示的課程

  const [members, setMembers] = useState([])
  const [locations, setLocations] = useState([])
  const [centers, setCenters] = useState([])
  const [sports, setSports] = useState([])
  const [courts, setCourts] = useState([])
  const [timePeriods, setTimePeriods] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [courtTimeSlots, setCourtTimeSlots] = useState([])
  const [status, setStatus] = useState([])

  // ===== 課程資料狀態 =====
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])

  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)

  // ===== 擴展課程資料至12堂 =====
  const coursesData = [
    {
      id: 1,
      title: '羽球課程',
      description:
        '透過完整而有系統的訓練流程規劃，培養深度專業認知與教學能力，運用多元及創新思維，帶領孩子探索身體，體驗不同的功能性，設計多元性的運動發展能力。',
      image: '/product-pic/badminton-course.png',
      icon: '',
      price: 4800,
      duration: '6-8週',
      level: '初級',
      category: 'badminton',
    },
    {
      id: 2,
      title: '桌球課程',
      description:
        '學習桌球，從基礎開始培養運動技巧與身體能力，提供多元且充滿樂趣，重新認識、建立桌球基礎運動技能，循序漸進的課程訓練。',
      image: '/product-pic/tabletennis-course.jpg',
      icon: '',
      price: 4500,
      duration: '8週',
      level: '初級',
      category: 'table-tennis',
    },
    {
      id: 3,
      title: '網球課程',
      description:
        '專業網球訓練課程，從基本握拍到進階技巧，培養正確的網球技術與戰術思維，適合各年齡層學員參與學習。',
      image: '/product-pic/tennis-course.jpg',
      icon: '',
      price: 5200,
      duration: '10週',
      level: '中級',
      category: 'tennis',
    },
    {
      id: 4,
      title: '籃球課程',
      description:
        '全方位籃球技能訓練，包含基本功練習、戰術配合、體能訓練，培養團隊合作精神與競技能力。',
      image: '/product-pic/basketball-course.png',
      icon: '',
      price: 4800,
      duration: '6週',
      level: '初級',
      category: 'basketball',
    },
    {
      id: 5,
      title: '排球課程',
      description:
        '排球基礎與進階技術教學，學習發球、接球、扣球等技巧，培養團隊默契與運動精神。',
      image: '/product-pic/volleyball-course.png',
      icon: '',
      price: 4300,
      duration: '8週',
      level: '初級',
      category: 'volleyball',
    },
    {
      id: 6,
      title: '游泳課程',
      description:
        '從基礎水性到各式泳姿教學，安全的水上運動訓練，適合初學者到進階學員的完整游泳課程。',
      image: '/product-pic/squash-course.png',
      icon: '',
      price: 5500,
      duration: '12週',
      level: '初級',
      category: 'swimming',
    },
    // ===== 新增6堂課程 =====
    {
      id: 7,
      title: '羽球進階課程',
      description:
        '進階羽球技術訓練，專注於競賽技巧、戰術應用與心理素質培養，適合有基礎的學員進一步提升技能。',
      image: '/product-pic/badminton-course.png',
      icon: '',
      price: 5200,
      duration: '8週',
      level: '進階',
      category: 'badminton',
    },
    {
      id: 8,
      title: '桌球競技班',
      description:
        '競技級桌球訓練，強化發球、接發球技術，培養比賽經驗與臨場反應能力。',
      image: '/product-pic/tabletennis-course.jpg',
      icon: '',
      price: 4800,
      duration: '10週',
      level: '進階',
      category: 'table-tennis',
    },
    {
      id: 9,
      title: '網球雙打班',
      description:
        '專門針對雙打戰術的網球課程，學習配合技巧、站位策略與團隊默契培養。',
      image: '/product-pic/tennis-course.jpg',
      icon: '',
      price: 5500,
      duration: '8週',
      level: '中級',
      category: 'tennis',
    },
    {
      id: 10,
      title: '籃球戰術班',
      description:
        '深入籃球戰術教學，包含進攻戰術、防守體系、快攻配合等高階技巧訓練。',
      image: '/product-pic/basketball-course.png',
      icon: '',
      price: 5000,
      duration: '8週',
      level: '進階',
      category: 'basketball',
    },
    {
      id: 11,
      title: '排球扣球技巧班',
      description:
        '專門強化排球扣球技術，包含助跑、起跳、揮臂動作與扣球戰術應用。',
      image: '/product-pic/volleyball-course.png',
      icon: '',
      price: 4600,
      duration: '6週',
      level: '中級',
      category: 'volleyball',
    },
    {
      id: 12,
      title: '競技游泳班',
      description:
        '競技游泳訓練課程，專注於四式技術精進、轉身技巧與競賽策略培養。',
      image: '/product-pic/squash-course.png',
      icon: '',
      price: 6000,
      duration: '12週',
      level: '進階',
      category: 'swimming',
    },
  ]

  // ===== 分頁邏輯函數 =====
  const updateDisplayedCourses = (coursesToDisplay, page = 1) => {
    const startIndex = 0
    const endIndex = page * itemsPerPage
    const slicedCourses = coursesToDisplay.slice(startIndex, endIndex)
    setDisplayedCourses(slicedCourses)
  }

  // ===== 載入資料 =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])
        // 使用靜態資料代替
        setMembers([])
        setLocations([
          { id: 1, name: '羽球' },
          { id: 2, name: '桌球' },
          { id: 3, name: '網球' },
          { id: 4, name: '籃球' },
          { id: 5, name: '排球' },
          { id: 6, name: '游泳' },
        ])

        // 載入課程資料
        setCourses(coursesData)
        setFilteredCourses(coursesData)

        // 初始顯示前6個課程
        updateDisplayedCourses(coursesData, 1)
        setCurrentPage(1)
      } catch (error) {
        console.error('載入資料失敗:', error)
        // 確保課程資料還是能載入
        setCourses(coursesData)
        setFilteredCourses(coursesData)
        updateDisplayedCourses(coursesData, 1)
      }
    }
    loadData()
  }, [])

  // ===== 搜尋和篩選功能 =====
  const handleSearch = () => {
    console.log('搜尋:', { locationId, sportId, keyword })

    let filtered = coursesData

    // 根據運動類型篩選
    if (locationId) {
      const sportMapping = {
        1: 'badminton',
        2: 'table-tennis',
        3: 'tennis',
        4: 'basketball',
        5: 'volleyball',
        6: 'swimming',
      }

      const targetCategory = sportMapping[locationId]
      if (targetCategory) {
        filtered = filtered.filter(
          (course) => course.category === targetCategory
        )
      }
    }

    // 根據場館篩選
    if (sportId) {
      // 這裡可以根據 sportId 進一步篩選
    }

    // 根據關鍵字篩選
    if (keyword.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(keyword.toLowerCase()) ||
          course.description.toLowerCase().includes(keyword.toLowerCase()) ||
          course.level.toLowerCase().includes(keyword.toLowerCase())
      )
    }

    setFilteredCourses(filtered)
    // 重置分頁並顯示篩選後的前6個課程
    setCurrentPage(1)
    updateDisplayedCourses(filtered, 1)
  }

  // ===== 重設篩選功能 =====
  const handleResetFilter = () => {
    setLocationId('')
    setSportId('')
    setKeyword('')
    setDate(null)
    setFilteredCourses(coursesData)
    // 重置分頁
    setCurrentPage(1)
    updateDisplayedCourses(coursesData, 1)
  }

  // ===== 載入更多課程功能 =====
  const handleLoadMore = () => {
    setIsLoading(true)

    // 模擬載入延遲
    setTimeout(() => {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      updateDisplayedCourses(filteredCourses, nextPage)
      setIsLoading(false)
    }, 500) // 500ms 載入動畫
  }

  // ===== 檢查是否還有更多課程可載入 =====
  const hasMoreCourses = displayedCourses.length < filteredCourses.length

  // 定義 Hero Banner 搜尋欄位
  const searchFields = [
    {
      label: '運動',
      component: (
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-full bg-white !h-10 text-black ">
            <SelectValue placeholder="請選運動" />
          </SelectTrigger>
          <SelectContent>
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
      label: '場館',
      component: (
        <Select value={sportId} onValueChange={setSportId}>
          <SelectTrigger className="w-full bg-white !h-10 text-black ">
            <SelectValue placeholder="請選擇場館" />
          </SelectTrigger>
          <SelectContent>
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
      label: '快速查詢',
      component: (
        <Input
          type="text"
          placeholder="請輸入課程名稱或關鍵字"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full h-10 bg-white text-black"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
      ),
    },
  ]

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/class-banner.jpg"
        title="您的完美課程，就在這裡"
        overlayOpacity="bg-primary/50"
      >
        <SearchField
          fields={searchFields}
          onSearch={handleSearch}
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

      <section className="py-10">
        <div className="container mx-auto max-w-screen-xl px-4">
          {/* 標題和篩選結果資訊 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-600 mt-2">
                {keyword.trim() && <span>關鍵字「{keyword}」</span>}
                共找到 {filteredCourses.length} 門課程
                {filteredCourses.length > displayedCourses.length && (
                  <span className="ml-2 text-blue-600">
                    (顯示 {displayedCourses.length} 門)
                  </span>
                )}
              </p>
            </div>

            {/* 重設篩選按鈕 */}
            <Button
              variant="outline"
              onClick={handleResetFilter}
              className="text-sm"
              disabled={!locationId && !sportId && !keyword.trim()}
            >
              清除篩選
            </Button>
          </div>

          {/* 動態顯示課程卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {displayedCourses.length > 0 ? (
              displayedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">沒有找到符合條件的課程</p>
                <Button
                  variant="outline"
                  onClick={handleResetFilter}
                  className="mt-4"
                >
                  查看所有課程
                </Button>
              </div>
            )}
          </div>

          {/* 載入更多按鈕 */}
          {hasMoreCourses && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-8 py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    載入中...
                  </>
                ) : (
                  <>
                    載入更多課程
                    <span className="ml-2 text-sm text-gray-500">
                      ({filteredCourses.length - displayedCourses.length}{' '}
                      門課程)
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* 已載入完所有課程的提示 */}
          {displayedCourses.length > 0 &&
            !hasMoreCourses &&
            filteredCourses.length > 6 && (
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm">
                  已載入全部 {filteredCourses.length} 門課程
                </p>
              </div>
            )}
        </div>
      </section>

      <Footer />
    </>
  )
}
