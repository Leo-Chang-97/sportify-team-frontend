'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { getCarts, getCheckoutData } from '@/api'

const CartContext = createContext()

CartContext.displayName = 'sportifyCartContext'

export function CartProvider({ children }) {
  const [carts, setCarts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 計算總價和總數量
  const totalPrice = carts.reduce((sum, cartItem) => {
    return sum + cartItem.product.price * cartItem.quantity
  }, 0)

  const itemCount = carts.reduce((sum, cartItem) => sum + cartItem.quantity, 0)

  // 獲取購物車資料
  const fetchCarts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await getCarts()
      if (result?.data?.cart?.cartItems) {
        setCarts(result.data.cart.cartItems)
      }
    } catch (err) {
      setError(err)
      console.error('獲取購物車失敗:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 獲取結帳資料
  const getCheckoutInfo = async () => {
    try {
      const result = await getCheckoutData()
      return result
    } catch (err) {
      console.error('獲取結帳資料失敗:', err)
      throw err
    }
  }

  // 清空購物車狀態
  const clearCart = () => {
    setCarts([])
  }

  const value = {
    carts,
    setCarts,
    totalPrice,
    itemCount,
    isLoading,
    error,
    fetchCarts,
    getCheckoutInfo,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// 自訂 hook
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart 必須在 CartProvider 中使用')
  }
  return context
}
