'use client'
import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function useAuthGuard() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  const fullPath = query ? `${pathname}?${query}` : pathname

  useEffect(() => {
    const token = localStorage.getItem('sportify-auth')
    if (!token) {
      // router.push(`/auth/login?redirect=${encodeURIComponent(fullPath)}`)
      router.push(`/quick-login`)
    }
  }, [user, router, pathname, fullPath])

  // return { user }
}
