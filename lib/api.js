import { fetcher } from './fetcher'
import { API_SERVER_ADMIN } from '@/lib/api-path'

// #region Center
export const fetchCenters = async (params = {}, options = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/center?${query}`, options)
}

export const fetchCenter = async (id, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/${id}`, options)
}

export const fetchLocation = async (options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/location`, options)
}

export const createCenter = async (data, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  })
}

export const deleteCenter = async (deletedId, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/${deletedId}`, {
    method: 'DELETE',
    ...options,
  })
}

export const updateCenter = async (id, data, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  })
}

export const deleteMultipleCenters = async (checkedItems, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/multi`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify({ checkedItems }),
  })
}
// #endregion Center

// #region Time Slot
export const fetchTimeSlots = async (params = {}, options = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot?${query}`, options)
}

export const fetchTimeSlot = async (id, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/${id}`, options)
}

export const fetchTimePeriod = async (options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/time-period`, options)
}

export const createTimeSlot = async (data, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  })
}

export const deleteTimeSlot = async (deletedId, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/${deletedId}`, {
    method: 'DELETE',
    ...options,
  })
}

export const updateTimeSlot = async (id, data, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  })
}

export const deleteMultipleTimeSlots = async (checkedItems, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/multi`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify({ checkedItems }),
  })
}
// #endregion Time Slot
