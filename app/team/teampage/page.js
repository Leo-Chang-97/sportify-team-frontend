'use client'

import React, { useState } from 'react'
import { UserIcon, PlusIcon } from 'lucide-react'

// Use this to get random user avatars
const avatarUrls = [
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/men/2.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
  'https://randomuser.me/api/portraits/men/4.jpg',
  'https://randomuser.me/api/portraits/women/5.jpg',
  'https://randomuser.me/api/portraits/men/6.jpg',
]

// Helper function to generate a calendar grid for a given month/year
const generateCalendarDays = (year, month) => {
  const days = []
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 for Sunday, 1 for Monday, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Fill in empty spaces for the days of the previous month
  for (let i = firstDayOfMonth; i > 0; i--) {
    days.push({ day: daysInPrevMonth - i + 1, isCurrentMonth: false })
  }

  // Fill in the days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true })
  }

  // Fill in empty spaces for the days of the next month
  const remainingDays = 42 - days.length // 6 weeks in total for a clean grid
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false })
  }

  return days
}

// Main component for the team page
const App = () => {
  // Mock data for the page, can be replaced with a database fetch later
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

  // Get current date to generate the calendar
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const calendarDays = generateCalendarDays(currentYear, currentMonth)

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      // Logic to add message (will be replaced by DB call)
      const newMsg = {
        id: messages.length + 1,
        name: 'You', // Placeholder for current user
        message: newMessage,
        avatar: avatarUrls[1], // Placeholder for current user avatar
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 font-['Noto_Sans_TC'] flex justify-center">
      <div className="container max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header - Team Name */}
        <header className="py-8 text-center border-b border-gray-700">
          <h1 className="text-3xl sm:text-4xl font-bold">你 · 的 · 隊 · 伍</h1>
        </header>

        {/* Main content wrapper */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Member Info Section */}
          <section className="bg-gray-800 rounded-lg p-6 md:col-span-3">
            <h2 className="text-xl font-bold mb-4">隊伍成員資訊</h2>
            <div className="flex flex-col gap-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-start gap-4 p-4 rounded-lg ${member.role === 'Leader' ? 'bg-gray-700' : 'bg-gray-700/50'}`}
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
                        <span className="text-sm font-medium text-blue-300">
                          Leader
                        </span>
                      )}
                    </div>
                    {member.skill && (
                      <p className="text-sm text-gray-400">{member.skill}</p>
                    )}
                    {member.email && (
                      <p className="text-sm text-gray-400">{member.email}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Calendar Section */}
          <section className="bg-gray-800 rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-700">
              團 · 練 · 時 · 間
            </h2>
            <div className="text-center text-2xl font-bold mb-4">
              Month {currentYear}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-gray-400 mb-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md transition-colors duration-200 cursor-pointer 
                             ${day.isCurrentMonth ? 'text-white hover:bg-blue-600' : 'text-gray-500'}`}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </section>

          {/* Message Board Section */}
          <section className="bg-gray-800 rounded-lg p-6 md:col-span-1 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-4 border-gray-700">
              Team XXXXXX
            </h2>
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto max-h-96 pr-2">
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-4">
                    <img
                      src={msg.avatar}
                      alt={msg.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src =
                          'https://placehold.co/40x40/E0E0E0/333333?text=user'
                      }}
                    />
                    <div>
                      <p className="font-bold">{msg.name}</p>
                      <p className="text-sm text-gray-300">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div className="mt-6 flex items-center gap-2">
              <img
                src={avatarUrls[1]} // Current user's avatar placeholder
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
                  className="flex-1 p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </main>

        <footer className="py-8 text-center border-t border-gray-700 mt-8">
          <p className="text-gray-400 text-sm">更 · 多 · 可 · 能</p>
        </footer>
      </div>
    </div>
  )
}

export default App
