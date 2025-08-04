'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { RegisterForm } from '@/app/register/_components/register-form'

export default function Page() {
  const { user, register, isAuthenticated } = useAuth()
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
      const result = await register(formData)

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
          errs.general = result.message || '註冊失敗，請稍後再試'
        }

        setErrors(errs)
      }
      // 註冊成功不在這裡跳轉，交給 useEffect
    } catch (error) {
      console.error('註冊錯誤:', error)
      setErrors({ general: '註冊失敗，請稍後再試' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <RegisterForm
          onSubmit={handleSubmit}
          errors={errors}
          isLoading={isLoading}
          register={register}
        />
      </div>
    </div>
  )
}
