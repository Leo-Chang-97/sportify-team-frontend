'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthProvider, useAuth } from '@/contexts/auth-context'

function AuthGuard({ children }) {
  const { user, isInitialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isInitialized && !user) {
      console.log('AuthGuard: 未登入，導向到登入頁面', {
        pathname,
        user,
        isInitialized,
      })
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isInitialized, user, router, pathname])

  // 還未初始化時顯示載入狀態
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">載入中...</div>
        </div>
      </div>
    )
  }

  // 未登入時顯示載入狀態（避免閃爍）
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">正在驗證身份...</div>
        </div>
      </div>
    )
  }

  return children
}

export default function AdminLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>
}
