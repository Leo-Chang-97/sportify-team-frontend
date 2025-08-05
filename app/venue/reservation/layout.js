import { ReservationProvider } from '@/contexts/reservation-context'

export default function ReservationLayout({ children }) {
  return <ReservationProvider>{children}</ReservationProvider>
}
