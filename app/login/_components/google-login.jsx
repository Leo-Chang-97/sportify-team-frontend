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
      console.log('開始 Google 登入流程...')
      console.log('Auth 狀態:', auth)
      console.log('Google Provider:', googleProvider)

      const result = await signInWithPopup(auth, googleProvider)
      console.log('Google 登入成功:', result)

      const user = result.user
      console.log('用戶資訊:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })

      const idToken = await user.getIdToken() // Firebase ID Token
      console.log('ID Token 獲取成功')

      // 使用認證上下文中的 Google 登入函數
      console.log('準備發送請求到後端 API')
      const response = await googleLogin(idToken)

      console.log('後端回應:', response)

      if (response.success) {
        console.log('後端驗證成功:', response)
        alert('Google 登入成功！歡迎回來！')

        // 等待一下讓認證狀態更新
        setTimeout(() => {
          console.log('當前認證狀態:', { user, isAuthenticated })
          // 重新導向到會員中心或首頁
          router.push('/member')
        }, 100)
      } else {
        console.error('後端驗證失敗:', response)
        alert(`後端驗證失敗: ${response.message || '未知錯誤'}`)
      }
    } catch (error) {
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
        case 'auth/popup-closed-by-user':
          errorMessage = '登入視窗被關閉'
          break
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
    console.log('認證狀態變化:', { user, isAuthenticated })
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
