import { fetcher } from './fetcher'
import { API_SERVER, API_SERVER_ADMIN } from '@/lib/api-path'

// #region Common
export const fetchLocationOptions = async () => {
  return fetcher(`${API_SERVER}/common/location`)
}

export const fetchTimePeriodOptions = async () => {
  return fetcher(`${API_SERVER}/common/time-period`)
}

export const fetchCenterOptions = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    )
  ).toString()
  const url = query
    ? `${API_SERVER}/common/center?${query}`
    : `${API_SERVER}/common/center`
  return fetcher(url)
}

export const fetchSportOptions = async () => {
  return fetcher(`${API_SERVER}/common/sport`)
}

export const fetchCourtOptions = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    )
  ).toString()
  const url = query
    ? `${API_SERVER}/common/court?${query}`
    : `${API_SERVER}/common/court`
  return fetcher(url)
}

export const fetchTimeSlotOptions = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    )
  ).toString()
  const url = query
    ? `${API_SERVER}/common/time-slot?${query}`
    : `${API_SERVER}/common/time-slot`
  return fetcher(url)
}
// #endregion Common

// #region Center
export const fetchCenters = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/center?${query}`)
}

export const fetchCenter = async (id) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/${id}`)
}

export const createCenter = async (data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center`, {
    method: 'POST',
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
    body: JSON.stringify(data),
  })
}

export const deleteMultipleCenters = async (checkedItems) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/multi`, {
    method: 'DELETE',
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

export const createTimeSlot = async (data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot`, {
    method: 'POST',
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
    body: JSON.stringify(data),
  })
}

export const deleteMultipleTimeSlots = async (checkedItems) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/time-slot/multi`, {
    method: 'DELETE',
    body: JSON.stringify({ checkedItems }),
  })
}
// #endregion Time Slot

// #region Court
export const fetchCourts = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/court?${query}`)
}

export const fetchCourt = async (id) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court/${id}`)
}

export const createCourt = async (data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateCourt = async (id, data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteCourt = async (deletedId) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court/${deletedId}`, {
    method: 'DELETE',
  })
}

export const deleteMultipleCourts = async (checkedItems) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court/multi`, {
    method: 'DELETE',
    body: JSON.stringify({ checkedItems }),
  })
}
// #endregion Court

// #region Court Time Slot
export const fetchCourtTimeSlots = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot?${query}`)
}

export const fetchCourtTimeSlot = async (id) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot/${id}`)
}

export const createCourtTimeSlot = async (data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateCourtTimeSlot = async (id, data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteCourtTimeSlot = async (deletedId) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot/${deletedId}`, {
    method: 'DELETE',
  })
}

export const deleteMultipleCourtTimeSlots = async (checkedItems) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot/multi`, {
    method: 'DELETE',
    body: JSON.stringify({ checkedItems }),
  })
}

// 批次設定價格（依條件）
export const batchSetCourtTimeSlotPrice = async (data) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot/batch-set-price`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
// #endregion Court Time Slot
