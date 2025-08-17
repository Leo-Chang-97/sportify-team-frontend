'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner from '@/components/hero-banner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeftIcon, AlertCircle } from 'lucide-react'
import { teamService } from '@/api/team/team'
import {
  fetchTeamSportOptions,
  fetchTeamLevelOptions,
  fetchTeamCenterOptions,
} from '@/api/team/common'

export default function CreateTeamPage() {
  const router = useRouter()

  // 表單狀態
  const [teamName, setTeamName] = useState('')
  const [sportId, setSportId] = useState('')
  const [levelId, setLevelId] = useState('')
  const [practiceTime, setPracticeTime] = useState('')
  const [centerId, setCenterId] = useState('')

  // 選項列表狀態
  const [sports, setSports] = useState([])
  const [levels, setLevels] = useState([])
  const [centers, setCenters] = useState([])

  // UI 狀態
  const [isLoading, setIsLoading] = useState(true)
  const [isCenterLoading, setIsCenterLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // 載入運動類別和等級的下拉選單
  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [sportData, levelData] = await Promise.all([
          fetchTeamSportOptions(),
          fetchTeamLevelOptions(),
        ])

        // **關鍵修正點 1**: 確保 setSports 和 setLevels 的是陣列
        setSports(sportData.rows || [])
        setLevels(levelData.rows || [])
      } catch (err) {
        setError(err.message || '載入選項失敗')
        setSports([]) // 錯誤時也確保是空陣列
        setLevels([])
      } finally {
        setIsLoading(false)
      }
    }

    // **關鍵修正點 2**: 非同步操作在 useEffect 內部執行
    loadInitialOptions()
  }, []) // 空依賴陣列確保只在元件掛載後執行一次

  // 當 sportId 改變時，動態載入場館列表
  useEffect(() => {
    if (!sportId) {
      setCenters([])
      setCenterId('')
      return
    }

    const loadCenters = async () => {
      setIsCenterLoading(true)
      setFormError('')
      try {
        const centerData = await fetchTeamCenterOptions({ sportId: sportId })
        setCenters(centerData.rows || [])
      } catch (err) {
        setFormError('無法載入場館列表，請稍後再試。')
      } finally {
        setIsCenterLoading(false)
      }
    }
    loadCenters()
  }, [sportId])

  // 儲存隊伍資料
  async function handleSave() {
    setFormError('')
    if (!teamName || !sportId || !levelId || !practiceTime || !centerId) {
      setFormError('請完整填寫所有欄位')
      return
    }
    const payload = {
      name: teamName,
      sportId: Number(sportId),
      levelId: Number(levelId),
      practiceTime: practiceTime,
      centerId: Number(centerId),
    }

    setIsSubmitting(true)
    try {
      const response = await teamService.create(payload)

      if (response.success) {
        alert('隊伍建立成功！')
        router.push('/team')
      } else {
        throw new Error(response.error || '建立隊伍失敗')
      }
    } catch (err) {
      setFormError(err.message || '發生未知錯誤，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <p className="text-center p-8">{'載入中...'}</p>
  if (error)
    return (
      <p className="text-center p-8 text-red-600">{`載入錯誤：${error}`}</p>
    )

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/team-banner.jpg"
        title="馬上加入團隊"
        overlayOpacity="bg-primary/10"
      />
      <section className="py-20">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="w-full max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-popover-foreground text-2xl font-bold mb-8 text-center">
              {'創立您的隊伍'}
            </h1>
            <div className="flex flex-col gap-6">
              {/* 隊伍名稱 */}
              <div>
                <h2 className="text-sm font-semibold mb-2">{'隊伍名稱'}</h2>
                <Input
                  className="text-popover-foreground"
                  placeholder="請輸入隊伍名稱"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              {/* 運動類別 */}
              <div>
                <h2 className="text-sm font-semibold mb-2">{'運動類別'}</h2>
                <Select value={sportId} onValueChange={setSportId}>
                  <SelectTrigger className="text-popover-foreground">
                    <SelectValue placeholder="請選擇運動類別" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* 出沒場地 */}
              <div>
                <h2 className="text-sm font-semibold mb-2">{'出沒場地'}</h2>
                <Select
                  value={centerId}
                  onValueChange={setCenterId}
                  disabled={!sportId || isCenterLoading}
                >
                  <SelectTrigger className="text-popover-foreground">
                    <SelectValue
                      placeholder={
                        !sportId
                          ? '請先選擇運動類別'
                          : isCenterLoading
                            ? '場館載入中...'
                            : '請選擇出沒場地'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.length > 0 ? (
                      centers.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="__empty">
                        {!sportId ? '...' : '此運動類別無可用場館'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {/* 階級程度 */}
              <div>
                <h2 className="text-sm font-semibold mb-2">{'階級程度'}</h2>
                <Select value={levelId} onValueChange={setLevelId}>
                  <SelectTrigger className="text-popover-foreground">
                    <SelectValue placeholder="請選擇階級程度" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((lv) => (
                      <SelectItem key={lv.id} value={String(lv.id)}>
                        {lv.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* 團隊練習時段 */}
              <div>
                <h2 className="text-sm font-semibold mb-2">{'團隊練習時段'}</h2>
                <Input
                  className="text-popover-foreground"
                  placeholder="例如：週一、週三晚上 8 點"
                  value={practiceTime}
                  onChange={(e) => setPracticeTime(e.target.value)}
                />
              </div>
            </div>
            {formError && (
              <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{formError}</span>
              </div>
            )}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                asChild
                className="border-gray-300 text-gray-500 bg-gray-100 hover:bg-gray-500 hover:text-gray-900"
              >
                <Link href="/team" aria-label="返回上一頁">
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span className="ml-2">{'返回上一頁'}</span>
                </Link>
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting} size="lg">
                {isSubmitting ? '儲存中...' : '儲存'}
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
