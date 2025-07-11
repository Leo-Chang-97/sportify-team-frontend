import { fetcher } from './fetcher'
import { API_SERVER, API_SERVER_ADMIN } from '@/lib/api-path'

// #region Common
export const fetchLocationOptions = async (options = {}) => {
  return fetcher(`${API_SERVER}/common/location`, options)
}

export const fetchTimePeriodOptions = async (options = {}) => {
  return fetcher(`${API_SERVER}/common/time-period`, options)
}

export const fetchCenterOptions = async (options = {}) => {
  return fetcher(`${API_SERVER}/common/center`, options)
}

export const fetchSportOptions = async (options = {}) => {
  return fetcher(`${API_SERVER}/common/sport`, options)
}

export const fetchCourtOptions = async (options = {}) => {
  return fetcher(`${API_SERVER}/common/court`, options)
}

export const fetchTimeSlotOptions = async (options = {}) => {
  return fetcher(`${API_SERVER}/common/time-slot`, options)
}
// #endregion Common

// #region Center
export const fetchCenters = async (params = {}, options = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/center?${query}`, options)
}

export const fetchCenter = async (id, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/${id}`, options)
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

// #region Court
export const fetchCourts = async (params = {}, options = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/court?${query}`, options)
}

export const fetchCourt = async (id, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court/${id}`, options)
}

export const createCourt = async (data, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  })
}

export const updateCourt = async (id, data, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  })
}

export const deleteCourt = async (deletedId, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court/${deletedId}`, {
    method: 'DELETE',
    ...options,
  })
}

export const deleteMultipleCourts = async (checkedItems, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court/multi`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify({ checkedItems }),
  })
}
// #endregion Court

// #region Court Time Slot
export const fetchCourtTimeSlots = async (params = {}, options = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot?${query}`, options)
}

export const fetchCourtTimeSlot = async (id, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot/${id}`, options)
}

export const createCourtTimeSlot = async (data, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  })
}

export const updateCourtTimeSlot = async (id, data, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  })
}

export const deleteCourtTimeSlot = async (deletedId, options = {}) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot/${deletedId}`, {
    method: 'DELETE',
    ...options,
  })
}

export const deleteMultipleCourtTimeSlots = async (
  checkedItems,
  options = {}
) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/court-time-slot/multi`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify({ checkedItems }),
  })
}
// #endregion Court Time Slot
