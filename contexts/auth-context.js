'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_SERVER } from '@/config/api-path'

const AuthContext = createContext()

AuthContext.displayName = 'sportifyAuthContext'
const storageKey = 'sportify-auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  useEffect(() => {
    const str = localStorage.getItem(storageKey)
    if (str) {
      try {
        const userData = JSON.parse(str)
        setUser(userData)
      } catch (ex) {
        // 忽略錯誤，可能是無效的 JSON
        localStorage.removeItem(storageKey)
      }
    }
    // 無論是否有 token，都標記為已初始化
    setIsInitialized(true)
  }, [])

  const handleLogin = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_SERVER}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        // 存 user 資料到 localStorage
        localStorage.setItem(storageKey, JSON.stringify(result))
        setUser(result)
        // 回傳成功結果
        return { success: true, user: result.data }
      } else {
        // 回傳失敗結果，包含錯誤訊息
        return {
          success: false,
          issues: result.issues || [],
          message: result.message || '登入失敗',
        }
      }
    } catch (error) {
      console.error('登入發生錯誤:', error)
      // 網路錯誤或其他異常
      return {
        success: false,
        issues: [],
        message: '網路錯誤，請稍後再試',
      }
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem(storageKey)
  }

  return (
    <AuthContext.Provider
      value={{ user, handleLogin, handleLogout, isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 自訂 hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 中使用')
  }
  return context
}
