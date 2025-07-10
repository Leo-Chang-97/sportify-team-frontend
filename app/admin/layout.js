'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthProvider, useAuth } from '@/contexts/auth-context'

function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) return null // 或 return <LoadingSpinner />
  if (!isAuthenticated) return null

  return children
}

export default function AdminLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>
}
