// firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// 詳細調試：檢查配置是否正確載入
console.log('=== Firebase 配置檢查 ===')
console.log('環境變數檢查:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '已設定' : '未設定',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    ? '已設定'
    : '未設定',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '已設定' : '未設定',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    ? '已設定'
    : '未設定',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    ? '已設定'
    : '未設定',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '已設定' : '未設定',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    ? '已設定'
    : '未設定',
})

console.log('Firebase 配置物件:', firebaseConfig)

// 檢查是否有必要的配置
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId
) {
  console.error('❌ Firebase 配置不完整！請檢查環境變數設定。')
  console.error('缺少的配置:', {
    apiKey: !firebaseConfig.apiKey,
    authDomain: !firebaseConfig.authDomain,
    projectId: !firebaseConfig.projectId,
  })
  throw new Error('Firebase 配置不完整')
}

// 檢查配置值的有效性
if (
  firebaseConfig.apiKey === 'your_api_key_here' ||
  firebaseConfig.projectId === 'your_project_id'
) {
  console.error('❌ Firebase 配置包含預設值，請設定正確的環境變數')
  throw new Error('Firebase 配置包含預設值')
}

console.log('✅ Firebase 配置檢查通過')

// 初始化 Firebase 應用
let app
try {
  app = initializeApp(firebaseConfig)
  console.log('✅ Firebase 應用初始化成功')
} catch (error) {
  console.error('❌ Firebase 應用初始化失敗:', error)
  throw error
}

// 初始化 Auth
let auth
try {
  auth = getAuth(app)
  console.log('✅ Firebase Auth 初始化成功')

  // 檢查 auth 配置
  console.log('Auth 配置:', {
    app: auth.app,
    config: auth.config,
    currentUser: auth.currentUser,
  })
} catch (error) {
  console.error('❌ Firebase Auth 初始化失敗:', error)
  throw error
}

// 配置 Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

console.log('✅ Google Auth Provider 配置完成')

// 添加錯誤處理
auth.onAuthStateChanged(
  (user) => {
    if (user) {
      console.log('👤 用戶已登入:', user.email)
    } else {
      console.log('👤 用戶已登出')
    }
  },
  (error) => {
    console.error('❌ Auth 狀態變更錯誤:', error)
  }
)

export { auth, googleProvider }
