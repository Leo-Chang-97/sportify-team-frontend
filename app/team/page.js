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
import { TeamCard } from '@/components/card/team-card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDownIcon, ArrowRight, Search } from 'lucide-react'

export default function TeamPage() {
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  // const [isDataLoading, setIsDataLoading] = useState(mode === 'edit')
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)

  const [locationId, setLocationId] = useState('')
  const [sportId, setSportId] = useState('')
  const [date, setDate] = useState(null)

  const [locations, setLocations] = useState([])
  const [sports, setSports] = useState([])

  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)

  // ===== 載入下拉選單選項 =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const locationData = await fetchLocationOptions()
        setLocations(locationData.rows || [])

        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])
      } catch (error) {
        console.error('載入球場/時段失敗:', error)
        toast.error('載入球場/時段失敗')
      }
    }
    loadData()
  }, [])

  const handleSearch = () => {
    // 搜尋邏輯
    console.log('搜尋:', { locationId, sportId, date })
  }

  // 定義 Hero Banner 搜尋欄位
  const searchFields = [
    {
      label: '地區',
      component: (
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-full bg-white !h-10">
            <SelectValue placeholder="請選擇地區" />
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
      label: '運動',
      component: (
        <Select value={sportId} onValueChange={setSportId}>
          <SelectTrigger className="w-full bg-white !h-10">
            <SelectValue placeholder="請選擇運動" />
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
      label: '關鍵字',
      component: (
        <div className="relative flex items-center">
          <Search
            className="absolute left-2 text-accent-foreground"
            size={20}
          />
          <Input
            type="search"
            className="w-full bg-accent text-accent-foreground !h-10 pl-8"
            placeholder="請輸入關鍵字"
          />
        </div>
      ),
    },
  ]

  // 做一個 onClick function
  const createTeam = () => {
    console.log('創建隊伍Create!')
  }

  const mockTeams = [
    {
      teamName: '先發一對',
      sportType: '籃球',
      currentMembers: 5,
      maxMembers: 12,
      location: '北投運動中心',
      time: '星期(一、三、六）  早上9點',
      skillLevel: '新手',
      isNews: true,
      imageUrl: 'https://placehold.co/256x192/94a3b8/ffffff?text=Team+A',
    },
    {
      teamName: '羽球高手團',
      sportType: '羽毛球',
      currentMembers: 8,
      maxMembers: 10,
      location: '內湖運動中心',
      time: '星期(二、四）  晚上7點',
      skillLevel: '熟手',
      isNews: false,
      imageUrl: 'https://placehold.co/256x192/b097b0/ffffff?text=Team+B',
    },
    {
      teamName: '快樂桌球隊',
      sportType: '桌球',
      currentMembers: 3,
      maxMembers: 4,
      location: '大安運動中心',
      time: '星期(五）  下午2點',
      skillLevel: '中手',
      isNews: true,
      imageUrl: 'https://placehold.co/256x192/98a3b5/ffffff?text=Team+C',
    },
    {
      teamName: '網球俱樂部',
      sportType: '網球',
      currentMembers: 10,
      maxMembers: 12,
      location: '天母網球場',
      time: '星期(六、日）  早上8點',
      skillLevel: '老手',
      isNews: false,
      imageUrl: 'https://placehold.co/256x192/83b593/ffffff?text=Team+D',
    },
  ]

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/team-banner.jpg"
        title="馬上加入團隊"
        overlayOpacity="bg-primary/10"
      >
        <SearchField
          fields={searchFields}
          onSearch={handleSearch}
          searchButtonText="搜尋"
        />
      </HeroBanner>
      <ScrollAreaSport />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <div className="self-stretch text-center justify-start text-white text-xl font-normal leading-loose tracking-[24px]">
            推·薦·隊·伍
          </div>
          {/* 這個 div 是包含「創建隊伍」按鈕和右側排序下拉菜單的容器 */}
          <div className="self-stretch flex justify-between items-center">
            {/* 創建隊伍按鈕 (使用 shadcn/ui 的 Button 組件) */}
            {/* 如果你想讓它變成可點擊的按鈕，建議使用 shadcn/ui 的 Button 元件 */}
            <Link href="/team/create" passHref>
              <Button
                onClick={createTeam}
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-blue-600"
              >
                創建隊伍
                <ArrowRight />
              </Button>
            </Link>

            {/* 右側的排序下拉菜單 (保持原樣，因為其結構看起來是完整的) */}
            {/* 這是你程式碼中的 Select 元件，我假設它能正常工作 */}
            <div className="flex-1 h-9 flex justify-end items-center gap-2">
              <div
                data-color="white"
                data-size="hug"
                data-state="search"
                className="inline-flex flex-col justify-start items-start"
              />
              <div
                data-color="white"
                data-size="hug"
                data-state="select"
                className="inline-flex flex-col justify-start items-start"
              >
                <div className="px-2 py-1 bg-white rounded-md outline-1 outline-offset-[-1px] outline-slate-900 inline-flex justify-start items-center">
                  <div className="pl-4 pr-2 flex justify-start items-center gap-2">
                    <div className="justify-start text-stone-300 text-base font-normal font-['Noto_Sans_TC'] leading-normal">
                      請選擇排序
                    </div>
                    {/* 排序下拉菜單的 ICON 保持原樣 */}
                    <div className="w-7 h-7 relative">
                      <div className="w-2 h-3.5 left-[7.5008px] top-[18.7504px] absolute origin-top-left -rotate-90 border border-slate-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* card-group */}
          {/* 使用 grid 系統來實現響應式兩欄佈局 */}
          {/* 在小螢幕上為單欄 (grid-cols-1)，在中型螢幕及以上為兩欄 (md:grid-cols-2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockTeams.map((team, index) => (
              // 渲染每一個 TeamCard 元件
              <TeamCard
                key={index}
                teamName={team.teamName}
                sportType={team.sportType}
                currentMembers={team.currentMembers}
                maxMembers={team.maxMembers}
                location={team.location}
                time={team.time}
                skillLevel={team.skillLevel}
                isNews={team.isNews}
                imageUrl={team.imageUrl}
              />
            ))}
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-8">
            <TeamCard></TeamCard>
            <TeamCard></TeamCard>
            <TeamCard></TeamCard>
            <TeamCard></TeamCard>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
