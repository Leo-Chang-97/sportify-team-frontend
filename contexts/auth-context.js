'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { API_SERVER } from '@/lib/api-path'

const AuthContext = createContext()

AuthContext.displayName = 'sportifyAuthContext'
const storageKey = 'sportify-auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async ({ email, password }) => {
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
        localStorage.setItem(storageKey, result.token)
        setUser(result.user)
        return { success: true, user: result.user }
      } else {
        return {
          success: false,
          issues: result.issues || [],
          message: result.message || '登入失敗',
        }
      }
    } catch (error) {
      console.error('登入發生錯誤:', error)
      return {
        success: false,
        issues: [],
        message: '網路錯誤，請稍後再試',
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(storageKey)
  }

  const checkAuth = async () => {
    setIsLoading(true)
    const token = localStorage.getItem(storageKey)
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const res = await fetch(`${API_SERVER}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setUser(result.user)
      } else {
        setUser(null)
        localStorage.removeItem(storageKey)
      }
    } catch (error) {
      setUser(null)
      localStorage.removeItem(storageKey)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
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
