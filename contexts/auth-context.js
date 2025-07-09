'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_SERVER } from '@/config/api-path'

const AuthContext = createContext()

AuthContext.displayName = 'sportifyAuthContext'
const storageKey = 'sportify-auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const str = localStorage.getItem(storageKey)
    if (str) {
      try {
        const result = JSON.parse(str)
        setUser(result)
      } catch (ex) {
        // 忽略錯誤，可能是無效的 JSON
      }
    }
    // 新增：同步 token
    const token = localStorage.getItem(storageKey)
    if (token) {
      // 可選：你可以在 context value 加 token 欄位
    }
  }, [])

  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_SERVER}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        return false
      }

      const result = await res.json()

      if (result.success) {
        // 存 token
        localStorage.setItem(storageKey, result.token)
        setUser(result.user)
      } else {
        const error = new Error('登入失敗')
        error.issues = result.issues || []
        throw error
      }
    } catch (error) {
      console.error('登入發生錯誤:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(storageKey)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
