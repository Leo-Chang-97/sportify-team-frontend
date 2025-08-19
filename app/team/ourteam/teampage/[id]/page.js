'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import {
  UserIcon,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle,
  Crown,
  InfoIcon,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import { teamService } from '@/api/team/team'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// 保持這個不受時區影響的日期格式化函式
const toYYYYMMDD = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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

  useEffect(() => {
    if (!teamId) return

    const loadTeamDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await teamService.fetchById(teamId)

        if (result.team?.calendarMarks) {
          const calendarMarksSet = new Set(
            result.team.calendarMarks.map((mark) => mark.date.split('T')[0])
          )
        }

        if (result.success && result.team) {
          setTeamData(result.team)

          // --- ★★★ 最終修改點 ★★★ ---
          // 從 API 來的日期字串，我們直接使用 split('T')[0] 取得日期部分
          // 這是最穩定的方式，因為它不經過瀏覽器的 new Date() 解析，避免了時區問題
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
    const dateString = toYYYYMMDD(day.date)
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
    setNewMessage('')
  }

  // 在 render 之前，根據 displayDate 過濾出當月事件
  const eventsForCurrentMonth =
    teamData?.calendarMarks
      ?.map((mark) => ({
        ...mark,
        dateObj: new Date(mark.date), // 建立 Date 物件以便比較
      }))
      .filter(
        (mark) =>
          mark.dateObj.getFullYear() === displayDate.getFullYear() &&
          mark.dateObj.getMonth() === displayDate.getMonth()
      )
      .sort((a, b) => a.dateObj - b.dateObj) || [] // 依日期排序

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
  if (!teamData) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-gray-400">找不到隊伍資料。</div>
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
              {teamData.name}
            </h2>
          </header>

          <section className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-300 text-gray-600">
              隊伍成員資訊
            </h2>
            <div className="overflow-y-auto h-[300px] border border-gray-300 rounded-lg p-2">
              <div className="flex flex-col gap-4">
                {teamData.TeamMember?.map(({ member }, index) => (
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
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-800">
                          {member.name}
                        </span>
                        {index === 0 && (
                          <span className="flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                            <Crown className="w-3 h-3" />
                            隊長
                          </span>
                        )}
                      </div>
                      {member.email && (
                        <p className="text-sm text-gray-600">{member.email}</p>
                      )}
                      {member.phone && (
                        <p className="text-sm text-gray-600">{member.phone}</p>
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
                const dateString = toYYYYMMDD(day.date)
                const isSelected = selectedDates.has(dateString)
                const isToday = toYYYYMMDD(day.date) === toYYYYMMDD(new Date())
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-700 mb-2">本月記事</h3>
              {eventsForCurrentMonth.length > 0 ? (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {eventsForCurrentMonth.map((event) => (
                    <li
                      key={event.id}
                      className="flex items-start gap-3 text-sm p-2 rounded-md hover:bg-gray-50"
                    >
                      <span className="font-semibold text-gray-800 bg-gray-200 px-2 py-1 rounded">
                        {event.dateObj.getDate()}日
                      </span>
                      <p className="text-gray-600 pt-1">{event.note}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">本月尚無特殊記事。</p>
              )}
            </div>
          </section>

          <section className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col h-[450px]">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-300  text-gray-600">
              {teamData.name} 留言板
            </h2>
            <div className="flex justify-center -space-x-2 mb-4">
              {teamData.TeamMember?.map(({ member }) => (
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
                {teamData.messages?.map((msg) => (
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
