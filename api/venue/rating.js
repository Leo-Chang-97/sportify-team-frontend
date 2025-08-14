import { apiClient } from '@/api/axios'

// 新增評分
export const addRating = async (centerId, data) => {
  const res = await apiClient.post(`/venue/rating/${centerId}`, data)
  return res.data
}
