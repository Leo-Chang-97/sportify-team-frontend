'use client'

import { useAuth } from '@/contexts/auth-context'
import { LoginForm } from '@/components/login-form'
import { Button } from '@/components/ui/button'

export default function QuickLoginPage() {
  const { user, login, logout } = useAuth()
  return (
    <>
      <p className="mt-4">
        <Button
          variant="outline"
          onClick={() => {
            login({ email: 'admin@gmail.com', password: '123456' })
          }}
        >
          登入 admin@gmail.com
        </Button>
      </p>

      <p className="mt-4">
        <Button variant="outline" onClick={() => logout()}>
          登出
        </Button>
      </p>

      <p className="mt-4">登入者: {user ? user.name : '未登入'}</p>
    </>
  )
}
