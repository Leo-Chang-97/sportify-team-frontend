import { fetcher } from './fetcher'
import { API_SERVER_ADMIN } from '@/config/api-path'

// #region Center
export const fetchCenters = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/center?${query}`)
}

export const fetchCenter = async (id) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/${id}`)
}

export const fetchLocation = async () => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/location`)
}

export const createCenter = async (data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export const deleteCenter = async (deletedId) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/${deletedId}`, {
    method: 'DELETE',
  })
}

export const updateCenter = async (id, data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export const deleteMultipleCenters = async (checkedItems) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/multi`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checkedItems }),
  })
}
// #endregion Center

// #region Time Slot
export const fetchTimeSlots = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot?${query}`)
}

export const fetchTimeSlot = async (id) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/${id}`)
}

export const fetchTimePeriod = async () => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/time-period`)
}

export const createTimeSlot = async (data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export const deleteTimeSlot = async (deletedId) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/${deletedId}`, {
    method: 'DELETE',
  })
}

export const updateTimeSlot = async (id, data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export const deleteMultipleTimeSlots = async (checkedItems) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/multi`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checkedItems }),
  })
}
// #endregion Time Slot
