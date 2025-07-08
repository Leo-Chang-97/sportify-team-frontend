export const fetcher = async (url, options = {}) => {
  // 取得 token
  const storageKey = 'sportify-auth'
  const token = localStorage.getItem(storageKey)
  console.log('fetcher token:', token)
  // 合併 headers
  options.headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  console.log('fetcher headers:', options.headers)

  const res = await fetch(url, options)
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
