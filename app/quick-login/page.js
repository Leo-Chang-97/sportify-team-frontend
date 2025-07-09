'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'

export default function QuickLoginPage() {
  const { user, handleLogin, handleLogout } = useAuth()
  return (
    <>
      <p className="mt-4">
        <Button
          variant="outline"
          onClick={() => {
            handleLogin({ email: 'admin@gmail.com', password: '123456' })
          }}
        >
          登入 admin@gmail.com
        </Button>
      </p>

      <p className="mt-4">
        <Button variant="outline" onClick={() => handleLogout()}>
          登出
        </Button>
      </p>

      <p className="mt-4">登入者: {user ? user.data.name : '未登入'}</p>
    </>
  )
}
