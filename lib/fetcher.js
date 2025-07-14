/* import { getAuthHeader } from '@/lib/utils'

export const fetcher = async (url, options = {}) => {
  // 自動加上 Content-Type: application/json 與授權 header
  const mergedOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  }

  const res = await fetch(url, mergedOptions)

  const result = await res.json()

  if (!res.ok) {
    if (res.status >= 400 && res.status < 500) {
      return result
    }
    const error = new Error('API fetch failed')
    error.status = res.status
    throw error
  }

  return result
}
 */
