export const fetcher = async (url, options = {}) => {
  // 強制加上 Content-Type: application/json，確保 Express 能正確解析 body
  const mergedOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
