import { apiClient } from '@/api/axios'

// 更新用戶資料
export const updateUserProfile = async (userData) => {
  const res = await apiClient.put('/auth/profile', userData)
  return res.data
}

// 上傳用戶頭像
export const uploadUserAvatar = async (file) => {
  const formData = new FormData()
  formData.append('avatar', file)

  const res = await apiClient.post('/auth/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}
