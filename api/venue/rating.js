import { apiClient } from '@/api/axios'

export const getCenterRatings = async (centerId) => {
  const res = await apiClient.get(`/venue/rating/centers/${centerId}/ratings`)
  return res.data
}

// 新增評分
export const addRating = async (centerId, data) => {
  const res = await apiClient.post(`/venue/rating/${centerId}`, data)
  return res.data
}
