import { adminApiClient } from '@/api/axios'

// 獲取所有訂單
export const fetchOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await adminApiClient.get(`/shop/order?${query}`)
  return res.data
}

// 獲取單一訂單
export const fetchOrder = async (id) => {
  const res = await adminApiClient.get(`/shop/order/${id}`)
  return res.data
}

// 創建新訂單
export const createOrder = async (data) => {
  const res = await adminApiClient.post('/shop/order', data)
  return res.data
}

// 更新訂單
export const updateOrder = async (id, data) => {
  const res = await adminApiClient.put(`/shop/order/${id}`, data)
  return res.data
}

// 刪除訂單
export const deleteOrder = async (deletedId) => {
  const res = await adminApiClient.delete(`/shop/order/${deletedId}`)
  return res.data
}

// 取得物流方式
export const fetchDelivery = async () => {
  const res = await adminApiClient.get('/shop/order/delivery')
  return res.data
}

// 取得付款方式
export const fetchPayment = async () => {
  const res = await adminApiClient.get('/shop/order/payment')
  return res.data
}

// 取得發票類型
export const fetchInvoice = async () => {
  const res = await adminApiClient.get('/shop/order/invoice')
  return res.data
}

// 取得訂單狀態
export const fetchOrderStatus = async () => {
  const res = await adminApiClient.get('/shop/order/status')
  return res.data
}
