export const fetcher = async (url, options = {}) => {
  const res = await fetch(url, options)
  const result = await res.json()

  if (!res.ok) {
    // 對於 4xx 錯誤（如驗證錯誤），返回包含詳細錯誤信息的結果
    if (res.status >= 400 && res.status < 500) {
      return result
    }

    // 對於其他錯誤（如 5xx），拋出異常
    const error = new Error('API fetch failed')
    error.status = res.status
    throw error
  }

  return result
}
