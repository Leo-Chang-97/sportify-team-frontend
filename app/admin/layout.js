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
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isInitialized, user, router, pathname])

  if (!isInitialized) return null
  if (!user) return null

  return children
}

export default function AdminLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>
}
