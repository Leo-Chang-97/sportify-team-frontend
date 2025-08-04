import { apiClient } from '@/api/axios'

// 前台使用者 - 取得商品列表 (通常會有篩選、分頁等)
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await apiClient.get(`/shop/product?${query}`)
  return res.data
}

// 前台使用者 - 取得單一商品詳細資訊
export const getProductDetail = async (id) => {
  const res = await apiClient.get(`/shop/product/${id}`)
  return res.data
}
