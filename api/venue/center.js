import { apiClient } from '@/api/axios'

// 前台使用者 - 取得場館中心列表 (通常會有篩選、分頁等)
export const getCenters = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await apiClient.get(`/venue/center?${query}`)
  return res.data
}

// 前台使用者 - 取得單一場館中心詳細資訊
export const getCenterDetail = async (id) => {
  const res = await apiClient.get(`/venue/center/${id}`)
  return res.data
}

// 前台使用者 - 取得場館中心的營業時間
export const getCenterBusinessHours = async (id) => {
  const res = await apiClient.get(`/venue/center/${id}/business-hours`)
  return res.data
}

// 前台使用者 - 取得場館中心的設施資訊
export const getCenterFacilities = async (id) => {
  const res = await apiClient.get(`/venue/center/${id}/facilities`)
  return res.data
}

// 前台使用者 - 搜尋附近的場館中心
export const searchNearbyCenters = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await apiClient.get(`/venue/center/search?${query}`)
  return res.data
}

// 前台使用者 - 取得熱門場館中心
export const getPopularCenters = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await apiClient.get(`/venue/center/popular?${query}`)
  return res.data
}

// 前台使用者 - 取得場館中心評價
export const getCenterReviews = async (id, params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await apiClient.get(`/venue/center/${id}/reviews?${query}`)
  return res.data
}
