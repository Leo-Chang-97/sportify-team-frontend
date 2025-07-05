import { fetcher } from './fetcher'
import { API_SERVER_ADMIN } from '@/config/api-path'

export const fetchCenters = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetcher(`${API_SERVER_ADMIN}/venue/center?${query}`)
}

export const fetchCenter = async (id) => {
  return fetcher(`${API_SERVER_ADMIN}/venue/center/${id}`)
}

export const fetchLocations = async () => {
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
