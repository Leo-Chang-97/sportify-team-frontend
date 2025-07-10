export const fetcher = async (url, options = {}) => {
  // 合併 headers，確保 Authorization header 被正確傳遞
  const mergedOptions = {
    ...options,
    headers: {
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
