import { auth, googleProvider } from '@/app/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GoogleLoginButton() {
  const { googleLogin, user, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const idToken = await user.getIdToken() // Firebase ID Token

      // 使用認證上下文中的 Google 登入函數
      const response = await googleLogin(idToken)

      if (response.success) {
        alert('Google 登入成功！歡迎回來！')

        // 等待一下讓認證狀態更新
        setTimeout(() => {
          // 重新導向到會員中心或首頁
          router.push('/member')
        }, 100)
      } else {
        console.error('後端驗證失敗:', response)
        alert(`後端驗證失敗: ${response.message || '未知錯誤'}`)
      }
    } catch (error) {
      // 如果是用戶主動關閉視窗，直接返回，不顯示任何錯誤訊息
      if (error.code === 'auth/popup-closed-by-user') {
        return
      }

      console.error('Google 登入失敗:', error)
      console.error('錯誤代碼:', error.code)
      console.error('錯誤訊息:', error.message)

      // 檢查是否是後端 API 錯誤
      if (error.response) {
        console.error('後端錯誤詳情:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        })

        // 顯示詳細的後端錯誤信息
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          '後端服務錯誤'
        alert(`後端錯誤 (${error.response.status}): ${errorMessage}`)
        return
      }

      // 根據錯誤類型提供更具體的錯誤信息
      let errorMessage = '登入失敗'

      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage = '登入視窗被瀏覽器阻擋，請允許彈出視窗'
          break
        case 'auth/cancelled-popup-request':
          errorMessage = '登入請求被取消'
          break
        case 'auth/configuration-not-found':
          errorMessage = 'Firebase 配置錯誤，請檢查專案設定'
          break
        case 'auth/unauthorized-domain':
          errorMessage = '未授權的網域，請在 Firebase Console 中添加此網域'
          break
        case 'auth/network-request-failed':
          errorMessage = '網路連線失敗，請檢查網路連線'
          break
        default:
          errorMessage = `登入失敗: ${error.message}`
      }

      alert(errorMessage)
    }
  }

  // 監聽認證狀態變化
  useEffect(() => {
    // 移除認證狀態變化的日誌
  }, [user, isAuthenticated])

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      使用 Google 登入
    </button>
  )
}
