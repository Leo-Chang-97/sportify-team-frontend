'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

function AuthGuard({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // 未登入，重導向到登入頁
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      } else if (user?.role !== 'admin') {
        // 已登入但不是 admin 角色，重導向到首頁或顯示無權限頁面
        router.push('/')
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router])

  if (isLoading) return null // 或 return <LoadingSpinner />
  if (!isAuthenticated) return null
  if (user?.role !== 'admin') return null // 不是 admin 就不顯示內容

  return children
}

export default function AdminLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>
}
