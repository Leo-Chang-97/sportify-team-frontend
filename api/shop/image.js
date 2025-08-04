import { API_SERVER_ADMIN } from '@/lib/api-path'

/**
 * 取得商品圖片的完整 URL
 * @param {string} imageName - 圖片檔案名稱 (例如: "product-1234567890-abc-def.jpg")
 * @returns {string} 完整的圖片 URL
 */
export const getProductImageUrl = (imageName) => {
  if (!imageName) return '/product-pic/product-img.jpg' // 預設圖片
  // 經由後端 API 端點取得圖片
  return `${API_SERVER_ADMIN}/shop/product/image/${imageName}`
}

/**
 * 取得多張商品圖片的 URL 陣列
 * @param {Array} images - 圖片物件陣列，每個物件包含 url 屬性
 * @returns {Array} 圖片 URL 陣列
 */
export const getProductImageUrls = (images) => {
  if (!images || !Array.isArray(images)) return []

  return images
    .sort((a, b) => a.order - b.order) // 按照 order 排序
    .map((img) => getProductImageUrl(img.url))
}
