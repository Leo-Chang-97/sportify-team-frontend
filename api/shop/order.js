import { apiClient } from '@/api/axios'

// 獲取所有付款方式
export const getPaymentMethods = async () => {
  const res = await apiClient.get('/shop/order/methods')
  return res.data
}

// 獲取用戶所有訂單
export const getUserOrders = async (params = {}) => {
  const res = await apiClient.get('/shop/order/orders', { params })
  return res.data
}

// 取得單一訂單詳細
export const getOrderDetail = async (orderId) => {
  const res = await apiClient.get(`/shop/order/order/${orderId}`)
  return res.data
}

// 獲取物流方式選項
export const getDeliveryOptions = async () => {
  const res = await apiClient.get('/shop/order/delivery')
  return res.data
}

// 獲取發票類型選項
export const getInvoiceTypes = async () => {
  const res = await apiClient.get('/shop/order/invoice')
  return res.data
}
