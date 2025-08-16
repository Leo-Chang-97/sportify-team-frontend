'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { API_SERVER } from '@/lib/api-path'

const AuthContext = createContext()

AuthContext.displayName = 'sportifyAuthContext'
const storageKey = 'sportify-auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasInitialized, setHasInitialized] = useState(false)

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
      console.log('登入 API 回應:', result)

      if (res.ok && result.success) {
        localStorage.setItem(storageKey, result.token)
        console.log('Token 已儲存:', result.token)

        // 登入成功後，立即獲取完整的用戶資料
        console.log('登入成功，開始獲取完整用戶資料')
        try {
          console.log('調用 /auth/verify API...')
          const verifyRes = await fetch(`${API_SERVER}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${result.token}`,
            },
          })
          console.log('verify API 狀態:', verifyRes.status)

          const verifyResult = await verifyRes.json()
          console.log('verify API 回應:', verifyResult)

          if (verifyRes.ok && verifyResult.success) {
            console.log('獲取完整用戶資料成功:', verifyResult.user)
            setUser(verifyResult.user)
            return { success: true, user: verifyResult.user }
          } else {
            console.log('獲取完整用戶資料失敗，使用登入回傳的資料')
            console.log('登入回傳的用戶資料:', result.user)
            setUser(result.user)
            return { success: true, user: result.user }
          }
        } catch (verifyError) {
          console.error('獲取完整用戶資料時發生錯誤:', verifyError)
          console.log('使用登入回傳的資料作為備用:', result.user)
          setUser(result.user)
          return { success: true, user: result.user }
        }
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

  const register = async ({
    email,
    password,
    name,
    phone,
    confirmPassword,
  }) => {
    try {
      const res = await fetch(`${API_SERVER}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, phone, confirmPassword }),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        localStorage.setItem(storageKey, result.token)

        // 註冊成功後，立即獲取完整的用戶資料
        console.log('註冊成功，開始獲取完整用戶資料')
        try {
          const verifyRes = await fetch(`${API_SERVER}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${result.token}`,
            },
          })
          const verifyResult = await verifyRes.json()
          if (verifyRes.ok && verifyResult.success) {
            console.log('獲取完整用戶資料成功:', verifyResult.user)
            setUser(verifyResult.user)
            return { success: true, user: verifyResult.user }
          } else {
            console.log('獲取完整用戶資料失敗，使用註冊回傳的資料')
            setUser(result.user)
            return { success: true, user: result.user }
          }
        } catch (verifyError) {
          console.error('獲取完整用戶資料時發生錯誤:', verifyError)
          setUser(result.user)
          return { success: true, user: result.user }
        }
      } else {
        return {
          success: false,
          issues: result.issues || [],
          message: result.message || '註冊失敗',
        }
      }
    } catch (error) {
      console.error('註冊發生錯誤:', error)
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
    if (hasInitialized) {
      console.log('已經初始化過，跳過 checkAuth')
      return
    }

    setIsLoading(true)
    const token = localStorage.getItem(storageKey)
    if (!token) {
      setUser(null)
      setIsLoading(false)
      setHasInitialized(true)
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
        console.log('checkAuth 成功，設置用戶資料:', result.user)
      } else {
        setUser(null)
        localStorage.removeItem(storageKey)
      }
    } catch (error) {
      setUser(null)
      localStorage.removeItem(storageKey)
    }
    setIsLoading(false)
    setHasInitialized(true)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const updateUserProfile = async (userData) => {
    try {
      const token = localStorage.getItem(storageKey)
      if (!token) {
        return { success: false, message: '未登入' }
      }

      const res = await fetch(`${API_SERVER}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        // 後端現在會回傳更新後的用戶資料
        if (result.user) {
          setUser(result.user)
          return { success: true, user: result.user }
        } else {
          // 如果後端沒有回傳用戶資料，手動更新本地狀態
          const updatedUser = {
            ...user,
            ...userData,
          }
          setUser(updatedUser)
          return { success: true, user: updatedUser }
        }
      } else {
        return {
          success: false,
          issues: result.issues || [],
          message: result.message || '更新失敗',
        }
      }
    } catch (error) {
      console.error('更新用戶資料發生錯誤:', error)
      return {
        success: false,
        issues: [],
        message: '網路錯誤，請稍後再試',
      }
    }
  }

  const uploadAvatar = async (file) => {
    try {
      const token = localStorage.getItem(storageKey)
      if (!token) {
        return { success: false, message: '未登入' }
      }

      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch(`${API_SERVER}/auth/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await res.json()

      if (res.ok && result.success) {
        // 如果後端沒有回傳 avatar 欄位，我們手動添加
        let updatedUser = result.user
        if (!updatedUser.avatar) {
          // 假設後端將圖片存儲為檔案名稱
          const fileName = file.name
          const avatarUrl = `http://localhost:3005/avatars/${fileName}`
          updatedUser = {
            ...result.user,
            avatar: avatarUrl,
          }
        }

        setUser(updatedUser)
        return { success: true, user: updatedUser }
      } else {
        return {
          success: false,
          message: result.message || '上傳失敗',
        }
      }
    } catch (error) {
      console.error('上傳頭像發生錯誤:', error)
      return {
        success: false,
        message: '網路錯誤，請稍後再試',
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUserProfile,
        uploadAvatar,
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
