'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { LoginForm } from '@/app/login/_components/login-form'
import { Navbar } from '@/components/navbar'

export default function Page() {
  const { user, login, isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'
  const router = useRouter()

  // ===== 狀態管理 =====
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // ===== 副作用處理 =====
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath)
    }
  }, [isAuthenticated, user, router, redirectPath])


  // ===== 事件處理函數 =====
  const handleSubmit = async (formData) => {
    setErrors({})
    setIsLoading(true)
    try {
      const result = await login(formData)

      if (!result.success) {
        const errs = {}
        const shown = {}

        result.issues?.forEach((issue) => {
          const field = issue.path[0]
          if (shown[field]) return // 避免重複顯示同欄位錯誤
          errs[field] = issue.message
          shown[field] = true
        })

        // 如果沒有特定欄位錯誤，顯示一般錯誤訊息
        if (Object.keys(errs).length === 0) {
          errs.general = result.message || '登入失敗，請稍後再試'
        }

        setErrors(errs)
      }
      // 登入成功不在這裡跳轉，交給 useEffect
    } catch (error) {
      console.error('登入錯誤:', error)
      setErrors({ general: '登入失敗，請稍後再試' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-svh w-full flex items-center justify-center overflow-hidden">
        {/* 背景影片 */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'blur(4px)' }}
          >
            <source src="/login/loginbg.mp4" type="video/mp4" />
            <source src="/videos/your-video.webm" type="video/webm" />
            您的瀏覽器不支援影片播放。
          </video>

          {/* 額外的模糊遮罩層 */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        </div>

        {/* 內容層 */}
        <div className="relative z-10 w-full max-w-4xl min-w-xl">
          <LoginForm
            onSubmit={handleSubmit}
            errors={errors}
            isLoading={isLoading}
            login={login}
          />
        </div>
      </div>
    </>
  )
}
