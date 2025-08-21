import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import GoogleLoginButton from './google-login'

// ===== 組件參數定義 =====
export function LoginForm({
  className,
  onSubmit,
  login,
  errors = {},
  isLoading = false,
  ...props
}) {
  // ===== 狀態管理 =====
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    const checkScreenSize = () => {
      // 當寬度 >= 976px 時使用大螢幕布局
      setIsLargeScreen(window.innerWidth >= 976)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // ===== 事件處理函數 =====
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Card
        className={`overflow-hidden p-0 w-full ${isLargeScreen ? 'max-w-4xl' : 'max-w-sm'}`}
      >
        <div className="flex flex-row">
          {isLargeScreen && (
            <div
              className="relative w-1/2 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/login/login2.jpg')`,
                backgroundPosition: 'left center',
                backgroundSize: 'cover',
              }}
            ></div>
          )}
          <div className={`p-6 ${isLargeScreen ? 'w-1/2' : 'w-full'}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">登入帳號</h2>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  {/* 一般錯誤訊息 */}
                  {errors.general && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                      {errors.general}
                    </div>
                  )}

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      className={errors.email ? 'border-red-500' : ''}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        忘記密碼?
                      </a>
                    </div>
                    <Input
                      className={errors.password ? 'border-red-500' : ''}
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <div className="text-red-500 text-sm">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={isLoading}
                      type="button"
                      onClick={() => {
                        if (onSubmit) {
                          onSubmit({
                            email: 'admin@gmail.com',
                            password: '123456',
                          })
                        }
                      }}
                    >
                      {isLoading ? 'Quick Logging in...' : 'Quick Login admin'}
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={isLoading}
                      type="button"
                      onClick={() => {
                        if (onSubmit) {
                          onSubmit({
                            email: 'user@gmail.com',
                            password: '123456',
                          })
                        }
                      }}
                    >
                      {isLoading ? 'Quick Logging in...' : 'Quick Login user'}
                    </Button>
                  </div>
                  <GoogleLoginButton />
                </div>
                <div className="mt-4 text-center text-sm">
                  沒有帳號?{' '}
                  <a href="/register" className="underline underline-offset-4">
                    前往註冊
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
