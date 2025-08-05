'use client'
import { createContext, useContext, useState } from 'react'

const ReservationContext = createContext(null)

export const ReservationProvider = ({ children }) => {
  const [reservationData, setReservationData] = useState({
    location: '',
    center: '',
    sport: '',
    selectedDate: null,
    timeSlots: [],
    totalPrice: 0,
    userInfo: {
      name: '',
      phone: '',
      email: '',
    },
    paymentMethod: '',
    receiptType: '',
  })

  return (
    <ReservationContext.Provider
      value={{ reservationData, setReservationData }}
    >
      {children}
    </ReservationContext.Provider>
  )
}

// 自訂 hook
export function useReservation() {
  const context = useContext(ReservationContext)
  if (!context) {
    throw new Error('useReservation 必須在 ReservationProvider 中使用')
  }
  return context
}
