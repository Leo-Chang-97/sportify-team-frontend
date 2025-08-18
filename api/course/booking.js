import { apiClient } from '@/api/axios'

// 取得 Booking 列表資料
export const fetchBookings = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await apiClient.get(`/course/booking?${query}`)
  return res.data
}

// 取得單筆 Booking 資料
export const fetchBooking = async (id) => {
  const res = await apiClient.get(`/course/booking/${id}`)
  return res.data
}

// 新增 Booking
export const createBooking = async (data) => {
  const res = await apiClient.post('/course/booking', data)
  return res.data
}

// 編輯 Booking
export const updateBooking = async (id, data) => {
  const res = await apiClient.put(`/course/booking/${id}`, data)
  return res.data
}

// 刪除單筆 Booking
export const deleteBooking = async (id) => {
  const res = await apiClient.delete(`/course/booking/${id}`)
  return res.data
}

// 多選刪除 Booking
export const deleteMultipleBookings = async (checkedItems) => {
  const res = await apiClient.delete('/course/booking/multi', {
    data: { checkedItems },
  })
  return res.data
}

// 取得某會員所有 Booking 資料
export const getUserBookings = async (params = {}) => {
  const res = await apiClient.get('/course/booking/member', { params })
  return res.data
}
