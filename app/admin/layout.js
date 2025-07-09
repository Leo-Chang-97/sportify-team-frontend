'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function AdminLayout({ children }) {
  const { user, isInitialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isInitialized, user, router, pathname])

  // 尚未初始化時不渲染內容，避免閃爍
  if (!isInitialized) return null
  // 沒有登入時也不渲染內容，避免閃爍
  if (!user) return null

  return children
}
