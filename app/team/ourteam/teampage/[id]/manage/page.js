'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  useParams, // <--- 1. 改為或新增引入 useParams
} from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner from '@/components/hero-banner'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table' // 請確認您的元件路徑是否正確
import { Button } from '@/components/ui/button' // Button 元件可能也需要引入

export default function TeamManagementPage() {
  const router = useRouter() // 這個 router 用於跳轉頁面
  const params = useParams() // 使用 useParams() 來獲取 URL 參數
  const teamId = params.id // 從 params 物件中讀取 id

  const [teamDetails, setTeamDetails] = useState(null)
  const [members, setMembers] = useState([])
  const [joinRequests, setJoinRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null) // 假設您有方法獲取當前登入者資訊

  useEffect(() => {
    console.log('useEffect 觸發，此時的 teamId:', teamId)

    // --- 【修改開始】安全的獲取使用者資訊 ---
    try {
      const loggedInUser = localStorage.getItem('auth')
      if (loggedInUser) {
        setCurrentUser(JSON.parse(loggedInUser))
        console.log(
          '成功從 localStorage 載入使用者資訊:',
          JSON.parse(loggedInUser)
        )
      } else {
        console.log('localStorage 中找不到 "auth" 項目。')
      }
    } catch (error) {
      console.error('從 localStorage 解析使用者資訊失敗:', error)
      // 即使解析失敗，也要確保流程繼續，而不是中斷
    }
    // --- 【修改結束】 ---

    if (!teamId) {
      console.log('teamId 不存在，暫停獲取隊伍資料。')
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `http://localhost:3005/api/team/teams/${teamId}/management`
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '無法載入隊伍資料')
        }
        const data = await response.json()

        setTeamDetails(data)
        setMembers(data.TeamMember || [])
        setJoinRequests(data.joinRequests || [])
      } catch (error) {
        console.error('載入管理資料失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [teamId])

  const isCaptain = members.find(
    (m) => m.isCaptain && m.member.id === currentUser?.id
  )

  const handleUpdateTeam = (formData) => {
    // 呼叫 PUT /api/team/teams/:id API
  }

  const handleKickMember = (memberId) => {
    // 呼叫 DELETE /api/team/members/:memberId API
  }

  const handleApproveRequest = (requestId) => {
    // 呼叫 PUT /api/team/join-requests/:requestId，並將狀態設為 APPROVED
  }

  const handleRejectRequest = (requestId) => {
    // 呼叫 PUT /api/team/join-requests/:requestId，並將狀態設為 REJECTED
  }
  // --- 【請在這裡加入或取消註解 console.log】 ---
  console.log('--- 渲染前的最終狀態檢查 ---')
  console.log('isLoading:', isLoading)
  console.log('teamDetails:', teamDetails)
  console.log('members:', members)
  console.log('joinRequests:', joinRequests)
  console.log('currentUser:', currentUser)
  console.log('isCaptain 的計算結果:', isCaptain) // 特別注意這一行
  console.log('--------------------------')
  // ------------------------------------

  if (isLoading) return <div>載入中...</div>

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/team-banner.jpg"
        title="馬上加入團隊"
        overlayOpacity="bg-primary/10"
      ></HeroBanner>
      <div className="container mx-auto max-w-screen-xl px-4 gap-8">
        <div className="w-full min-h-[814px] max-w-[1140px] py-20 flex flex-col justify-start items-center gap-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-popover">
            你隸屬的隊伍資訊
          </h1>
          <div>
            {/* 導覽列、頁尾等... */}
            <h1>管理你的隊伍：{teamDetails?.name}</h1>

            {/* 如果是隊長，顯示隊伍設定表單 */}
            {isCaptain && (
              <form onSubmit={handleUpdateTeam}>
                {/* 級別、描述等輸入框 */}
                <Button type="submit">更新隊伍資訊</Button>
              </form>
            )}

            <h2>成員列表</h2>
            {/* 使用您的 Table 元件來渲染 `members` 列表 */}
            {/* 在每一行後面，如果 isCaptain 為 true，顯示「踢除」按鈕 */}
            <Table>
              {/* ... 表格頭 ... */}
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    {/* ... 成員資訊 ... */}
                    <TableCell>
                      {isCaptain && member.memberId !== currentUser?.id && (
                        <Button onClick={() => handleKickMember(member.id)}>
                          踢除
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* 如果是隊長，顯示申請列表 */}
            {isCaptain && (
              <>
                <h2>加入申請</h2>
                {/* 使用您的 Table 元件來渲染 `joinRequests` 列表 */}
                {/* 在每一行後面，顯示「批准」和「拒絕」按鈕 */}
                <Table>
                  {/* ... 表格頭 ... */}
                  <TableBody>
                    {joinRequests
                      .filter((req) => req.status === 'PENDING')
                      .map((req) => (
                        <TableRow key={req.id}>
                          {/* ... 申請者資訊 ... */}
                          <TableCell>
                            <Button
                              onClick={() => handleApproveRequest(req.id)}
                            >
                              批准
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleRejectRequest(req.id)}
                            >
                              拒絕
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </>
            )}
          </div>

          <div className="self-stretch inline-flex justify-between items-start">
            <Link href="/team" passHref>
              <Button
                variant="default"
                size="lg"
                className="bg-muted-foreground relative group"
              >
                <div className="absolute inset-0 bg-popover-foreground opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-30 pointer-events-none z-0"></div>
                <span className="justify-start text-popover font-bold leading-7 z-10">
                  返回上一頁
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
