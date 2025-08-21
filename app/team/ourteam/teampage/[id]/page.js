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
  Trash2,
  InfoIcon,
  Link,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import { teamService } from '@/api/team/team'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { jwtDecode } from 'jwt-decode'
import TeamLink from '@/components/card/team-link'

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
  const [currentUser, setCurrentUser] = useState(null) // 用來存放當前登入者資訊
  const [joinRequests, setJoinRequests] = useState([]) // 用來存放加入申請
  const [editingDate, setEditingDate] = useState(null) // 儲存當前正在編輯的日期字串
  const [noteInput, setNoteInput] = useState('') // 繫結到 input 輸入框的值

  useEffect(() => {
    try {
      const token = localStorage.getItem('sportify-auth')
      if (token) {
        // 使用 jwtDecode 解碼 token，取出 payload 中的使用者資訊
        const userData = jwtDecode(token)
        setCurrentUser(userData)
      }
    } catch (error) {
      console.error('從 localStorage 解碼 JWT 失敗:', error)
    }

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

  // --- 【新增】另一個 useEffect 來專門處理從 teamData 中提取資料 ---
  // 這樣可以確保在 teamData 和 currentUser 都更新後才執行
  useEffect(() => {
    if (teamData) {
      setJoinRequests(teamData.joinRequests || [])
    }
  }, [teamData]) // 當 teamData 變化時觸發

  // isCaptain 的判斷邏輯維持不變，但現在 currentUser 會有值了
  const captain = teamData?.TeamMember?.[0]?.member
  const isCaptain = currentUser?.id === captain?.id

  // --- 【新增】處理管理功能的函式 ---
  const handleKickMember = async (memberIdToKick) => {
    if (!window.confirm('您確定要將此成員踢出隊伍嗎？')) return
    try {
      // --- 【修改這裡的呼叫】 ---
      // 現在需要傳入 teamId 和 memberIdToKick
      await teamService.kickMember(teamId, memberIdToKick)
      alert('成員已成功踢除')
      window.location.reload() // 重新整理頁面
    } catch (error) {
      console.error('踢除成員時發生錯誤:', error)
      alert(`踢除失敗：${error.response?.data?.error || error.message}`)
    }
  }

  const handleReviewRequest = async (requestId, status) => {
    try {
      // 呼叫我們在 team.js 中新增的 API 服務函式
      const result = await teamService.reviewRequest(requestId, { status })

      if (result) {
        alert(`申請已成功 ${status === 'APPROVED' ? '批准' : '拒絕'}`)

        // 更新成功後，需要讓畫面上的資料同步
        // 方法一：簡單粗暴，直接重新整理頁面
        window.location.reload()

        // 方法二 (進階)：重新獲取資料並更新 state，體驗更好
        // setJoinRequests(prevRequests =>
        //   prevRequests.filter(req => req.id !== requestId)
        // );
        // 如果是批准，可能還需要重新獲取成員列表
        // loadTeamDetails(); // 假設 loadTeamDetails 已被定義
      }
    } catch (error) {
      console.error('審核申請時發生錯誤:', error)
      alert(`審核失敗：${error.response?.data?.error || error.message}`)
    }
  }

  const currentYear = displayDate.getFullYear()
  const currentMonth = displayDate.getMonth()
  const calendarDays = generateCalendarDays(currentYear, currentMonth)

  const handleMonthChange = (offset) => {
    setDisplayDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + offset)
      return newDate
    })
    setEditingDate(null) // 切換月份時，取消編輯狀態
    setNoteInput('') // 並清空輸入框
  }

  const handleDayClick = (day) => {
    // 如果不是隊長，或點擊的不是當月日期，則不執行任何操作
    if (!isCaptain || !day.isCurrentMonth) return

    const dateString = toYYYYMMDD(day.date)
    setEditingDate(dateString) // 將點擊的日期設為正在編輯的日期

    // 檢查這一天是否已經有記事，如果有，就將內容填入輸入框
    const existingNote = eventsForCurrentMonth.find(
      (e) => toYYYYMMDD(e.dateObj) === dateString
    )
    setNoteInput(existingNote?.note || '')
  }

  // --- 【新增】儲存記事的函式 ---
  const handleSaveNote = async () => {
    if (!editingDate) return

    // 這裡您需要呼叫一個新的後端 API 來儲存或更新記事
    try {
      await teamService.saveCalendarMark({
        teamId,
        date: editingDate,
        note: noteInput,
      })
      alert(`已成功為 ${editingDate} 新增/更新記事！`)
      window.location.reload() // 重新整理頁面以看到最新資料
    } catch (error) {
      console.error('儲存記事失敗:', error)
      alert(`儲存失敗：${error.response?.data?.error || error.message}`)
    }
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

  // --- 【新增】處理「修改」按鈕點擊的函式 ---
  const handleEditNote = (event) => {
    // 將該事件的日期和內容，設定到編輯區的 state 中
    const dateString = toYYYYMMDD(new Date(event.date)) // 確保日期格式正確
    setEditingDate(dateString)
    setNoteInput(event.note || '')
    // 讓頁面滾動到編輯區，方便使用者操作
    // 您需要為編輯區的 div 加上一個 id="note-editor"
    document
      .getElementById('note-editor')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  // --- 【新增】處理「刪除」按鈕點擊的函式 ---
  const handleDeleteNote = async (markId) => {
    if (!window.confirm('您確定要刪除這則記事嗎？')) return

    try {
      await teamService.deleteCalendarMark(markId)
      alert('記事已成功刪除！')
      window.location.reload() // 重新整理頁面
    } catch (error) {
      console.error('刪除記事失敗:', error)
      alert(`刪除失敗：${error.response?.data?.error || error.message}`)
    }
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
                {teamData.TeamMember?.map((teamMember, index) => (
                  <div
                    key={teamMember.member.id} // 改用 teamMember.member.id
                    ref={(el) =>
                      memberRefs.current.set(teamMember.member.id, el)
                    }
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <img
                      src={
                        teamMember.member.avatar || // 改用 teamMember.member.avatar
                        'https://placehold.co/48x48/E0E0E0/333333?text=user'
                      }
                      alt={teamMember.member.name} // 改用 teamMember.member.name
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-800">
                          {teamMember.member.name}{' '}
                          {/* 改用 teamMember.member.name */}
                        </span>
                        {/* 隊長判斷邏輯也需要修正，直接使用 isCaptain 欄位 */}
                        {teamMember.isCaptain && (
                          <span
                            className="flex items-center gap-1 text-yellow-500 bg-yellow-100 px-2 py-0.5 rounded-full text-xs"
                            title="隊長"
                          >
                            <Crown className="w-3 h-3" /> 隊長
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {teamMember.member.email}
                      </p>{' '}
                      {/* 改用 teamMember.member.email */}
                      <p className="text-sm text-gray-500">
                        {teamMember.member.phone}
                      </p>{' '}
                      {/* 改用 teamMember.member.phone */}
                    </div>
                    {/* 踢除按鈕邏輯 */}
                    {isCaptain && currentUser?.id !== teamMember.member.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-ring hover:bg-destructive hover:text-chart-5 mr-6"
                        onClick={() => handleKickMember(teamMember.member.id)} // 改用 teamMember.member.id
                      >
                        <Trash2 className="w-5 h-5" />
                        踢除隊員
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- 【新增】整個申請審核區塊，只有隊長看得到 --- */}
          {isCaptain && ( // 只有隊長看得到這個區塊
            <section className="bg-white border border-gray-300 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-300 text-gray-600">
                待審核的加入申請
              </h2>
              {/* 判斷 joinRequests 是否為空 */}
              {joinRequests.length > 0 ? (
                <div className="overflow-y-auto h-[300px] border border-gray-300 rounded-lg p-2">
                  <div className="flex flex-col gap-4">
                    {joinRequests.map(({ member, id: requestId }) => (
                      <div
                        key={requestId}
                        className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50"
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
                          <span className="font-bold text-lg text-gray-800">
                            {member.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-500 hover:bg-green-100"
                            onClick={() =>
                              handleReviewRequest(requestId, 'APPROVED')
                            }
                          >
                            <CheckCircle className="w-6 h-6" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-100"
                            onClick={() =>
                              handleReviewRequest(requestId, 'REJECTED')
                            }
                          >
                            <XCircle className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // 如果 joinRequests 是空的，顯示提示訊息
                <div className="text-center text-gray-500 py-10">
                  目前沒有人申請加入隊伍
                </div>
              )}
            </section>
          )}

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
            {isCaptain && (
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
            )}
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
                const isEditing = dateString === editingDate
                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`p-2 rounded-full transition-colors duration-200 text-center relative 
          ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} 
          ${isSelected ? 'bg-red-500 text-white' : ''} 
          ${isEditing ? 'ring-2 ring-blue-500' : ''} 
          ${isToday && !isSelected ? 'border-2 border-blue-500' : ''}
          ${isCaptain && day.isCurrentMonth ? 'cursor-pointer hover:bg-blue-200' : ''}
        `}
                  >
                    {day.date.getDate()}
                  </div>
                )
              })}
            </div>
            {isCaptain && editingDate && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">
                  為 {editingDate} 新增/編輯記事
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="輸入事件內容..."
                    className="flex-1 p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg"
                  />
                  <Button onClick={handleSaveNote}>儲存記事</Button>
                </div>
              </div>
            )}
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
                      <p className="flex-1 text-gray-600 pt-1">{event.note}</p>

                      {/* --- 【新增】只有隊長能看到的修改和刪除按鈕 --- */}
                      {isCaptain && (
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-ring hover:bg-chart-2 dark:hover:bg-chart-2"
                            onClick={() => handleEditNote(event)}
                          >
                            修改
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-ring hover:bg-destructive dark:hover:bg-destructive"
                            onClick={() => handleDeleteNote(event.id)}
                          >
                            刪除
                          </Button>
                        </div>
                      )}
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
          <TeamLink />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default TeamDetailPage
