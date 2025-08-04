'use client'

import React, { useState, useRef } from 'react'
import {
  UserIcon,
  PlusIcon,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle,
} from 'lucide-react'

// 使用這個來獲取隨機使用者頭像
const avatarUrls = [
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/men/2.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
  'https://randomuser.me/api/portraits/men/4.jpg',
  'https://randomuser.me/api/portraits/women/5.jpg',
  'https://randomuser.me/api/portraits/men/6.jpg',
]

// 輔助函數來為給定的月份/年份生成日曆網格
const generateCalendarDays = (year, month) => {
  const days = []
  const date = new Date(year, month, 1) // Start with the 1st of the month

  // 找到日曆視圖的第一個星期一
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
const App = () => {
  // 頁面的模擬數據，稍後可以用資料庫讀取取代
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: '洪XX',
      role: 'Leader',
      skill: '擅長籃球 / 程度中手',
      email: 'test1@gmail.com',
      avatar: avatarUrls[0],
    },
    {
      id: 2,
      name: '林XX',
      role: 'member',
      skill: '擅長足球 / 程度新手',
      avatar: avatarUrls[1],
    },
    {
      id: 3,
      name: '陳XX',
      role: 'member',
      skill: '擅長籃球 / 程度老手',
      avatar: avatarUrls[2],
    },
    { id: 4, name: '蔡XX', role: 'member', skill: '', avatar: avatarUrls[3] },
    { id: 5, name: '張XX', role: 'member', skill: '', avatar: avatarUrls[4] },
    { id: 6, name: '王XX', role: 'member', skill: '', avatar: avatarUrls[5] },
  ])

  const [messages, setMessages] = useState([
    {
      id: 1,
      name: 'name 1',
      message: 'message XXXXXXXX',
      avatar: avatarUrls[0],
    },
    {
      id: 2,
      name: 'name 2',
      message: 'message XXXXXXXX',
      avatar: avatarUrls[1],
    },
    {
      id: 3,
      name: 'name 3',
      message: 'message XXXXXXXX',
      avatar: avatarUrls[2],
    },
  ])

  const [newMessage, setNewMessage] = useState('')
  // 使用 useState 來管理日曆顯示的日期，預設為當前日期
  const [displayDate, setDisplayDate] = useState(new Date())
  // 新增狀態來追蹤已選擇的日期，使用 ISO 格式字串作為唯一鍵
  const [selectedDates, setSelectedDates] = useState(new Set())
  // 新增狀態來追蹤日曆的當前模式
  const [currentMode, setCurrentMode] = useState('select') // 'select' or 'clear'

  // 根據 displayDate 產生日曆
  const currentYear = displayDate.getFullYear()
  const currentMonth = displayDate.getMonth()
  const calendarDays = generateCalendarDays(currentYear, currentMonth)

  // 處理月份切換的函數
  const handleMonthChange = (offset) => {
    const newDate = new Date(displayDate)
    newDate.setMonth(newDate.getMonth() + offset)
    setDisplayDate(newDate)
  }

  // 處理日期點擊事件
  const handleDayClick = (day) => {
    // 只允許選擇當月日期
    if (!day.isCurrentMonth) return

    // 使用 ISO 字串作為唯一鍵來判斷日期
    const dateString = day.date.toISOString().split('T')[0]
    setSelectedDates((prevDates) => {
      const newDates = new Set(prevDates)
      if (currentMode === 'select') {
        // 在圈選模式下，點擊可選取或取消選取
        if (newDates.has(dateString)) {
          newDates.delete(dateString)
        } else {
          newDates.add(dateString)
        }
      } else if (currentMode === 'clear') {
        // 在清除模式下，點擊只會取消選取
        if (newDates.has(dateString)) {
          newDates.delete(dateString)
        }
      }
      return newDates
    })
  }

  // 處理切換到圈選模式
  const handleSelectMode = () => {
    setCurrentMode('select')
  }

  // 處理切換到清除模式
  const handleClearMode = () => {
    setCurrentMode('clear')
  }

  // 為每個隊員卡片創建引用
  const memberRefs = useRef(new Map())

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      // 添加訊息的邏輯 (將來會被資料庫呼叫取代)
      const newMsg = {
        id: messages.length + 1,
        name: 'You', // 當前使用者的佔位符
        message: newMessage,
        avatar: avatarUrls[1], // 當前使用者頭像的佔位符
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  // 處理點擊頭像時的平滑滾動
  const scrollToMember = (id) => {
    const node = memberRefs.current.get(id)
    if (node) {
      node.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8 font-['Noto_Sans_TC'] flex justify-center text-gray-900">
      <div className="container max-w-7xl mx-auto flex flex-col gap-8">
        {/* 標題 - 隊伍名稱 */}
        <header className="py-8 text-center border-b border-gray-700">
          <h2 className="text-2xl sm:text-2xl font-bold text-white">
            你 · 的 · 隊 · 伍
          </h2>
        </header>

        {/* 主要內容容器 (上下排列) */}
        <main className="flex flex-col gap-8">
          {/* 隊伍成員資訊區塊 */}
          <section className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">隊伍成員資訊</h2>
            {/* 滾動式表單容器 */}
            <div className="overflow-y-auto h-[300px] border border-gray-300 rounded-lg p-2">
              <div className="flex flex-col gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    ref={(node) => memberRefs.current.set(member.id, node)} // 附加引用
                    className={`flex items-start gap-4 p-4 rounded-lg border border-gray-200 ${member.role === 'Leader' ? 'bg-gray-100' : 'bg-gray-50'}`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src =
                          'https://placehold.co/48x48/E0E0E0/333333?text=user'
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-lg">{member.name}</div>
                        {member.role === 'Leader' && (
                          <span className="text-sm font-medium text-blue-600">
                            Leader
                          </span>
                        )}
                      </div>
                      {member.skill && (
                        <p className="text-sm text-gray-600">{member.skill}</p>
                      )}
                      {member.email && (
                        <p className="text-sm text-gray-600">{member.email}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 日曆區塊 */}
          <section className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-300">
              團 · 練 · 時 · 間
            </h2>
            <div className="flex justify-between items-center mb-4">
              {/* 月份切換按鈕 */}
              <button
                onClick={() => handleMonthChange(-1)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="上一個月"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              {/* 顯示當前年月 */}
              <div className="text-2xl font-bold text-gray-900">
                {displayDate.toLocaleDateString('zh-TW', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <button
                onClick={() => handleMonthChange(1)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="下一個月"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            {/* 新增的「圈選」和「清除」按鈕 */}
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={handleSelectMode}
                className={`flex items-center gap-1 text-sm rounded-lg px-2 py-1 transition-colors ${currentMode === 'select' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <CheckCircle className="w-4 h-4" />
                圈選
              </button>
              <button
                onClick={handleClearMode}
                className={`flex items-center gap-1 text-sm rounded-lg px-2 py-1 transition-colors ${currentMode === 'clear' ? 'bg-red-100 text-red-500' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <XCircle className="w-4 h-4" />
                清除
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
                    className={`
                      p-2 rounded-full transition-colors duration-200 cursor-pointer text-center relative
                      ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      ${isSelected ? 'bg-red-500 text-white' : 'hover:bg-blue-200'}
                      ${isToday && !isSelected ? 'border-2 border-blue-500 rounded-full' : ''}
                    `}
                  >
                    {day.date.getDate()}
                  </div>
                )
              })}
            </div>
          </section>

          {/* 訊息板區塊 */}
          <section className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-300">
              Team XXXXXX
            </h2>

            {/* 新增的隊員頭像列表 (點擊可滾動) */}
            <div className="flex justify-center -space-x-2 mb-4">
              {teamMembers.map((member) => (
                <img
                  key={member.id}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-110 transition-transform"
                  src={member.avatar}
                  alt={member.name}
                  onClick={() => scrollToMember(member.id)} // 添加點擊事件
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src =
                      'https://placehold.co/40x40/E0E0E0/333333?text=user'
                  }}
                />
              ))}
            </div>

            {/* 訊息容器，有固定高度和滾動條 */}
            <div className="flex-1 overflow-y-auto h-[200px] border border-gray-300 rounded-lg p-4 mb-4">
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-4">
                    <img
                      src={msg.avatar}
                      alt={msg.name}
                      className="w-8 h-8 rounded-full object-cover" // 縮小頭像尺寸
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src =
                          'https://placehold.co/32x32/E0E0E0/333333?text=user'
                      }}
                    />
                    <div>
                      <p className="font-bold">{msg.name}</p>
                      <p className="text-sm text-gray-600">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 訊息輸入框 */}
            <div className="mt-auto flex items-center gap-2">
              <img
                src={avatarUrls[1]} // 當前使用者的頭像佔位符
                alt="user avatar"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src =
                    'https://placehold.co/40x40/E0E0E0/333333?text=user'
                }}
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="請輸入訊息內容"
                  className="flex-1 p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage()
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  發送
                </button>
              </div>
            </div>
          </section>
          <h2 className="text-2xl font-bold mb-4 text-center border-b pb-4 border-gray-300 text-white">
            更 · 多 · 可 · 能
          </h2>
        </main>
      </div>
    </div>
  )
}

export default App
