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
import { useState } from 'react'

// ===== 組件參數定義 =====
export function RegisterForm({
  className,
  onSubmit,
  register,
  errors = {},
  isLoading = false,
  ...props
}) {
  // ===== 狀態管理 =====
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  })

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
      <Card className="overflow-hidden p-0 w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-row">
          <div
            className="relative hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/login/login.png')`,
              backgroundPosition: 'left center',
              backgroundSize: 'cover',
            }}
          ></div>
          <div className="w-full md:w-1/2 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">註冊帳號</h2>
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
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      className={errors.name ? 'border-red-500' : ''}
                      id="name"
                      type="text"
                      placeholder="請輸入您的姓名"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <div className="text-red-500 text-sm">{errors.name}</div>
                    )}
                  </div>

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
                    <Label htmlFor="phone">手機號碼</Label>
                    <Input
                      className={errors.phone ? 'border-red-500' : ''}
                      id="phone"
                      type="tel"
                      placeholder="請輸入手機號碼"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      disabled={isLoading}
                    />
                    {errors.phone && (
                      <div className="text-red-500 text-sm">{errors.phone}</div>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="password">密碼</Label>
                    <Input
                      className={errors.password ? 'border-red-500' : ''}
                      id="password"
                      type="password"
                      placeholder="請輸入密碼"
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

                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">確認密碼</Label>
                    <Input
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                      id="confirmPassword"
                      type="password"
                      placeholder="請再次輸入密碼"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange('confirmPassword', e.target.value)
                      }
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <div className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? '註冊中...' : '註冊'}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  已有帳號?{' '}
                  <a href="/login" className="underline underline-offset-4">
                    前往登入
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
