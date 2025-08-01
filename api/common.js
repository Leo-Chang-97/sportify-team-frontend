import { apiClient } from '@/api/axios'

export const fetchMemberOptions = async () => {
  const res = await apiClient.get('/common/member')
  return res.data
}

export const fetchStatusOptions = async () => {
  const res = await apiClient.get('/common/status')
  return res.data
}

export const fetchLocationOptions = async () => {
  const res = await apiClient.get('/common/location')
  return res.data
}

export const fetchTimePeriodOptions = async () => {
  const res = await apiClient.get('/common/time-period')
  return res.data
}

export const fetchCenterOptions = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    )
  ).toString()
  const url = query ? `/common/center?${query}` : '/common/center'
  const res = await apiClient.get(url)
  return res.data
}

export const fetchSportOptions = async () => {
  const res = await apiClient.get('/common/sport')
  return res.data
}

export const fetchCourtOptions = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    )
  ).toString()
  const url = query ? `/common/court?${query}` : '/common/court'
  const res = await apiClient.get(url)
  return res.data
}

export const fetchTimeSlotOptions = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    )
  ).toString()
  const url = query ? `/common/time-slot?${query}` : '/common/time-slot'
  const res = await apiClient.get(url)
  return res.data
}

export const fetchCourtTimeSlotOptions = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    )
  ).toString()
  const url = query
    ? `/common/court-time-slot?${query}`
    : '/common/court-time-slot'
  const res = await apiClient.get(url)
  return res.data
}
export const fetchBrandOptions = async () => {
  const res = await apiClient.get('/common/brand')
  return res.data
}
