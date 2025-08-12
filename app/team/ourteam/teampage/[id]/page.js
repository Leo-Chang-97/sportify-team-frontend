'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import {
  UserIcon,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'

// --- API 請求相關設定 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchAPI(url, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('前端環境變數 NEXT_PUBLIC_API_BASE_URL 未設定！')
  }
  const fullUrl = `${API_BASE_URL}${url}`
  const res = await fetch(fullUrl, options)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `請求 ${fullUrl} 失敗`)
  }
  return res.json()
}

// 輔助函數來為給定的月份/年份生成日曆網格
const generateCalendarDays = (year, month) => {
  const days = []
  const date = new Date(year, month, 1)
  let startDay = new Date(date)
  startDay.setDate(
    startDay.getDate() - (startDay.getDay() === 0 ? 6 : startDay.getDay() - 1)
  )
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDay)
    currentDate.setDate(startDay.getDate() + i)
    days.push({
      date: currentDate,
      isCurrentMonth: currentDate.getMonth() === month,
    })
  }
  return days
}

// 團隊頁面主組件
const TeamDetailPage = () => {
  const params = useParams()
  const teamId = params.id

  const [teamData, setTeamData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newMessage, setNewMessage] = useState('')
  const [displayDate, setDisplayDate] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState(new Set())
  const [currentMode, setCurrentMode] = useState('select')
  const memberRefs = useRef(new Map())

  // 使用 useEffect 來從 API 載入隊伍資料
  useEffect(() => {
    if (!teamId) return

    const loadTeamDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // ===== 【唯一的修改點】 =====
        // 將 API 路徑從 /api/team/${teamId}
        // 改為符合後端自動化路由規則的 /api/team/details/${teamId}
        const result = await fetchAPI(`/api/team/teams/${teamId}`)

        if (result.success && result.team) {
          setTeamData(result.team)
          const calendarMarks = new Set(
            result.team.calendarMarks.map((mark) => mark.date.split('T')[0])
          )
          setSelectedDates(calendarMarks)
        } else {
          setError(result.error || '無法載入隊伍資料')
        }
      } catch (err) {
        setError(err.message)
        console.error('載入隊伍詳細資料失敗:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamDetails()
  }, [teamId])

  // 日曆相關函式
  const currentYear = displayDate.getFullYear()
  const currentMonth = displayDate.getMonth()
  const calendarDays = generateCalendarDays(currentYear, currentMonth)
  const handleMonthChange = (offset) => {
    const newDate = new Date(displayDate)
    newDate.setMonth(newDate.getMonth() + offset)
    setDisplayDate(newDate)
  }
  const handleDayClick = (day) => {
    if (!day.isCurrentMonth) return
    const dateString = day.date.toISOString().split('T')[0]
    setSelectedDates((prevDates) => {
      const newDates = new Set(prevDates)
      if (currentMode === 'select') {
        if (newDates.has(dateString)) {
          newDates.delete(dateString)
        } else {
          newDates.add(dateString)
        }
      } else if (currentMode === 'clear') {
        if (newDates.has(dateString)) {
          newDates.delete(dateString)
        }
      }
      return newDates
    })
  }
  const handleSelectMode = () => setCurrentMode('select')
  const handleClearMode = () => setCurrentMode('clear')
  const scrollToMember = (id) => {
    const node = memberRefs.current.get(id)
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  const handleSendMessage = () => {
    console.log('發送訊息:', newMessage)
    setNewMessage('')
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-white">載入隊伍資料中...</div>
        <Footer />
      </>
    )
  }
  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-red-400">載入失敗：{error}</div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6">
          <header className="py-8 text-center border-b border-gray-700">
            <h2 className="text-2xl sm:text-2xl font-bold text-white">
              {teamData?.name || '你的隊伍'}
            </h2>
          </header>
          <section className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-300 text-gray-600">
              隊伍成員資訊
            </h2>
            <div className="overflow-y-auto h-[300px] border border-gray-300 rounded-lg p-2">
              <div className="flex flex-col gap-4">
                {teamData?.TeamMember?.map(({ member }) => (
                  <div
                    key={member.id}
                    ref={(node) => memberRefs.current.set(member.id, node)}
                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <img
                      src={
                        member.avatar ||
                        'https://placehold.co/48x48/E0E0E0/333333?text=user'
                      }
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-lg text-muted-foreground">
                        {member.name}
                      </div>
                      {member.email && (
                        <p className="text-sm text-gray-600">{member.email}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-300 text-gray-600">
              團 · 練 · 時 · 間
            </h2>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => handleMonthChange(-1)}
                className="p-2 rounded-full hover:bg-gray-200"
                aria-label="上一個月"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-2xl font-bold text-gray-900">
                {displayDate.toLocaleDateString('zh-TW', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <button
                onClick={() => handleMonthChange(1)}
                className="p-2 rounded-full hover:bg-gray-200"
                aria-label="下一個月"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={handleSelectMode}
                className={`flex items-center gap-1 text-sm rounded-lg px-2 py-1 ${currentMode === 'select' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <CheckCircle className="w-4 h-4" /> 圈選
              </button>
              <button
                onClick={handleClearMode}
                className={`flex items-center gap-1 text-sm rounded-lg px-2 py-1 ${currentMode === 'clear' ? 'bg-red-100 text-red-500' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <XCircle className="w-4 h-4" /> 清除
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-gray-600 mb-2">
              <div>一</div>
              <div>二</div>
              <div>三</div>
              <div>四</div>
              <div>五</div>
              <div>六</div>
              <div>日</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dateString = day.date.toISOString().split('T')[0]
                const isSelected = selectedDates.has(dateString)
                const isToday =
                  day.date.toDateString() === new Date().toDateString()
                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`p-2 rounded-full transition-colors duration-200 cursor-pointer text-center relative ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isSelected ? 'bg-red-500 text-white' : 'hover:bg-blue-200'} ${isToday && !isSelected ? 'border-2 border-blue-500' : ''}`}
                  >
                    {day.date.getDate()}
                  </div>
                )
              })}
            </div>
          </section>

          <section className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col h-[450px]">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-300 text-card-foreground">
              {teamData?.name || '隊伍'} 留言板
            </h2>
            <div className="flex justify-center -space-x-2 mb-4">
              {teamData?.TeamMember?.map(({ member }) => (
                <img
                  key={member.id}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-110 transition-transform"
                  src={
                    member.avatar ||
                    'https://placehold.co/40x40/E0E0E0/333333?text=user'
                  }
                  alt={member.name}
                  onClick={() => scrollToMember(member.id)}
                />
              ))}
            </div>
            <div className="flex-1 overflow-y-auto h-[200px] border border-gray-300 rounded-lg p-4 mb-4">
              <div className="flex flex-col gap-4">
                {teamData?.messages?.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-4">
                    <img
                      src={'https://placehold.co/32x32/E0E0E0/333333?text=??'}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-card-foreground">匿名成員</p>
                      <p className="text-sm text-gray-600">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2">
              <img
                src={'https://placehold.co/40x40/E0E0E0/333333?text=You'}
                alt="user avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="請輸入訊息內容"
                  className="flex-1 p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage()
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                  發送
                </button>
              </div>
            </div>
          </section>
          <h2 className="text-2xl font-bold mb-4 text-center border-b pb-4 border-gray-300 text-white">
            更 · 多 · 可 · 能
          </h2>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default TeamDetailPage
