import { apiClient } from '@/api/axios'

export const fetchCourtTimeSlots = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await apiClient.get(`/venue/court-time-slot?${query}`)
  return res.data
}

export const fetchCourtTimeSlotsByCenterAndSport = async (
  centerId,
  sportId
) => {
  const res = await apiClient.get(
    `/venue/court-time-slot/by-center-sport?centerId=${centerId}&sportId=${sportId}`
  )
  return res.data
}

export const fetchAvailableCourtTimeSlotsByMonth = async (
  centerId,
  sportId,
  yearMonth
) => {
  const res = await apiClient.get(
    `/venue/court-time-slot/available-court-time-slots?centerId=${centerId}&sportId=${sportId}&yearMonth=${yearMonth}`
  )
  return res.data
}

export const fetchCourtTimeSlot = async (id) => {
  const res = await apiClient.get(`/venue/court-time-slot/${id}`)
  return res.data
}

export const createCourtTimeSlot = async (data) => {
  const res = await apiClient.post('/venue/court-time-slot', data)
  return res.data
}

export const updateCourtTimeSlot = async (id, data) => {
  const res = await apiClient.put(`/venue/court-time-slot/${id}`, data)
  return res.data
}

export const deleteCourtTimeSlot = async (deletedId) => {
  const res = await apiClient.delete(`/venue/court-time-slot/${deletedId}`)
  return res.data
}

export const deleteMultipleCourtTimeSlots = async (checkedItems) => {
  const res = await apiClient.delete('/venue/court-time-slot/multi', {
    data: { checkedItems },
  })
  return res.data
}

// 批次設定價格（依條件）
export const batchSetCourtTimeSlotPrice = async (data) => {
  const res = await apiClient.post(
    '/venue/court-time-slot/batch-set-price',
    data
  )
  return res.data
}
