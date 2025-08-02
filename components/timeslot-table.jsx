import { Circle, CircleCheckBig } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

// 模擬場地資料
const courts = [
  { id: 1, name: '場地1' },
  { id: 2, name: '場地2' },
  { id: 3, name: '場地3' },
  { id: 4, name: '場地4' },
]

// 模擬時間段資料
const timeSlots = [
  { id: 1, startTime: '09:00', endTime: '10:00' },
  { id: 2, startTime: '10:00', endTime: '11:00' },
  { id: 3, startTime: '11:00', endTime: '12:00' },
  { id: 4, startTime: '12:00', endTime: '13:00' },
  { id: 5, startTime: '13:00', endTime: '14:00' },
  { id: 6, startTime: '14:00', endTime: '15:00' },
  { id: 7, startTime: '15:00', endTime: '16:00' },
  { id: 8, startTime: '16:00', endTime: '17:00' },
]

// 模擬場地時間段價格資料
const courtTimeSlots = [
  { courtId: 1, timeSlotId: 1, price: 300 },
  { courtId: 1, timeSlotId: 2, price: 300 },
  { courtId: 1, timeSlotId: 3, price: 350 },
  { courtId: 1, timeSlotId: 4, price: 400 },
  { courtId: 1, timeSlotId: 5, price: 400 },
  { courtId: 1, timeSlotId: 6, price: 350 },
  { courtId: 1, timeSlotId: 7, price: 350 },
  { courtId: 1, timeSlotId: 8, price: 300 },

  { courtId: 2, timeSlotId: 1, price: 320 },
  { courtId: 2, timeSlotId: 2, price: 320 },
  { courtId: 2, timeSlotId: 3, price: 370 },
  { courtId: 2, timeSlotId: 4, price: 420 },
  { courtId: 2, timeSlotId: 5, price: 420 },
  { courtId: 2, timeSlotId: 6, price: 370 },
  { courtId: 2, timeSlotId: 7, price: 370 },
  { courtId: 2, timeSlotId: 8, price: 320 },

  { courtId: 3, timeSlotId: 1, price: 280 },
  { courtId: 3, timeSlotId: 2, price: 280 },
  { courtId: 3, timeSlotId: 3, price: 330 },
  { courtId: 3, timeSlotId: 4, price: 380 },
  { courtId: 3, timeSlotId: 5, price: 380 },
  { courtId: 3, timeSlotId: 6, price: 330 },
  { courtId: 3, timeSlotId: 7, price: 330 },
  { courtId: 3, timeSlotId: 8, price: 280 },

  { courtId: 4, timeSlotId: 1, price: 310 },
  { courtId: 4, timeSlotId: 2, price: 310 },
  { courtId: 4, timeSlotId: 3, price: 360 },
  { courtId: 4, timeSlotId: 4, price: 410 },
  { courtId: 4, timeSlotId: 5, price: 410 },
  { courtId: 4, timeSlotId: 6, price: 360 },
  { courtId: 4, timeSlotId: 7, price: 360 },
  { courtId: 4, timeSlotId: 8, price: 310 },
]

export function TimeSlotTable({ onSelectionChange }) {
  // 儲存選中的時間段 {courtId: number, timeSlotId: number}[]
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([])

  // 切換選擇狀態
  const toggleTimeSlot = (courtId, timeSlotId) => {
    setSelectedTimeSlots((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.courtId === courtId && item.timeSlotId === timeSlotId
      )

      if (existingIndex >= 0) {
        // 如果已選中，則移除
        return prev.filter((_, index) => index !== existingIndex)
      } else {
        // 如果未選中，則添加
        return [...prev, { courtId, timeSlotId }]
      }
    })
  }

  // 檢查是否已選中
  const isSelected = (courtId, timeSlotId) => {
    return selectedTimeSlots.some(
      (item) => item.courtId === courtId && item.timeSlotId === timeSlotId
    )
  }

  // 獲取場地時間段的價格
  const getPrice = (courtId, timeSlotId) => {
    const courtTimeSlot = courtTimeSlots.find(
      (item) => item.courtId === courtId && item.timeSlotId === timeSlotId
    )
    return courtTimeSlot ? courtTimeSlot.price : null
  }

  // 計算總價格
  const getTotalPrice = () => {
    return selectedTimeSlots.reduce((total, { courtId, timeSlotId }) => {
      const price = getPrice(courtId, timeSlotId)
      return total + (price || 0)
    }, 0)
  }

  // 當選擇變更時通知父組件
  useEffect(() => {
    if (onSelectionChange) {
      const selectionData = {
        selectedTimeSlots,
        totalPrice: getTotalPrice(),
        details: selectedTimeSlots.map(({ courtId, timeSlotId }) => {
          const court = courts.find((c) => c.id === courtId)
          const timeSlot = timeSlots.find((t) => t.id === timeSlotId)
          const price = getPrice(courtId, timeSlotId)
          return {
            courtId,
            timeSlotId,
            courtName: court?.name,
            timeRange: `${timeSlot?.startTime}~${timeSlot?.endTime}`,
            price,
          }
        }),
      }
      onSelectionChange(selectionData)
    }
  }, [selectedTimeSlots, onSelectionChange])

  return (
    <div className="relative flex flex-col bg-card border rounded-lg p-6 gap-4">
      <Table className="text-muted-foreground">
        {/* <TableCaption>選擇您要預約的場地時間段</TableCaption> */}

        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground w-[120px]">
              時間
            </TableHead>
            {courts.map((court) => (
              <TableHead
                key={court.id}
                className="text-muted-foreground text-center"
              >
                {court.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeSlots.map((timeSlot) => (
            <TableRow key={timeSlot.id}>
              <TableCell className="font-medium">
                {timeSlot.startTime}~{timeSlot.endTime}
              </TableCell>
              {courts.map((court) => {
                const price = getPrice(court.id, timeSlot.id)
                const selected = isSelected(court.id, timeSlot.id)

                return (
                  <TableCell key={court.id} className="text-center">
                    {price ? (
                      <Button
                        variant={selected ? 'default' : 'secondary'}
                        size="sm"
                        onClick={() => toggleTimeSlot(court.id, timeSlot.id)}
                        className={cn(
                          'w-full',
                          selected &&
                            'bg-primary/10 text-primary hover:bg-primary/20'
                        )}
                      >
                        <div className="flex gap-2">
                          <span className="text-xs">NT$ {price}</span>
                          <span style={{ width: 20, display: 'inline-block' }}>
                            {selected ? (
                              <CircleCheckBig />
                            ) : (
                              <span className="text-muted-foreground">
                                <Circle />
                              </span>
                            )}
                          </span>
                        </div>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        不可預約
                      </span>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* 顯示選中的時間段 */}
      {selectedTimeSlots.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-800">已選擇的時間段：</h3>
          <div className="space-y-1">
            {selectedTimeSlots.map(({ courtId, timeSlotId }, index) => {
              const court = courts.find((c) => c.id === courtId)
              const timeSlot = timeSlots.find((t) => t.id === timeSlotId)
              const price = getPrice(courtId, timeSlotId)
              return (
                <div key={index} className="text-sm text-blue-500">
                  {court?.name} - {timeSlot?.startTime}~{timeSlot?.endTime} (NT${' '}
                  {price})
                </div>
              )
            })}
          </div>
          <div className="mt-2 font-semibold text-blue-800">
            總計：NT$ {getTotalPrice()}
          </div>
        </div>
      )}
    </div>
  )
}
