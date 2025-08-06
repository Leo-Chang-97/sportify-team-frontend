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
import { useState, useEffect, useMemo } from 'react'

export function TimeSlotTable({ courtTimeSlots = [], onSelectionChange }) {
  // 儲存選中的時間段 {courtId: number, timeSlotId: number}[]
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([])

  // 從真實資料中提取唯一的場地和時間段
  const { courts, timeSlots } = useMemo(() => {
    if (!courtTimeSlots.length) {
      return { courts: [], timeSlots: [] }
    }

    // 提取唯一的場地
    const courtsMap = new Map()
    const timeSlotsMap = new Map()

    courtTimeSlots.forEach((item) => {
      // 提取場地資訊
      if (item.court && !courtsMap.has(item.court.id)) {
        courtsMap.set(item.court.id, {
          id: item.court.id,
          name: item.court.name,
        })
      }

      if (item.timeSlot && !timeSlotsMap.has(item.timeSlot.id)) {
        timeSlotsMap.set(item.timeSlot.id, {
          id: item.timeSlot.id,
          label: item.timeSlot.label,
        })
      }
    })

    const courtsArray = Array.from(courtsMap.values()).sort(
      (a, b) => a.id - b.id
    )
    const timeSlotsArray = Array.from(timeSlotsMap.values()).sort(
      (a, b) => a.id - b.id
    )

    return {
      courts: courtsArray,
      timeSlots: timeSlotsArray,
    }
  }, [courtTimeSlots])

  // 當 courtTimeSlots 改變時清除之前的選擇
  useEffect(() => {
    setSelectedTimeSlots([])
  }, [courtTimeSlots])

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
      (item) => item.court?.id === courtId && item.timeSlot?.id === timeSlotId
    )
    return courtTimeSlot ? courtTimeSlot.price : null
  }

  // 計算總價格
  const getTotalPrice = () => {
    return selectedTimeSlots.reduce((total, { courtId, timeSlotId }) => {
      const price = Number(getPrice(courtId, timeSlotId))
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
            timeRange: timeSlot?.label,
            price,
          }
        }),
      }
      onSelectionChange(selectionData)
    }
  }, [selectedTimeSlots, onSelectionChange])

  return (
    <div className="relative flex flex-col bg-card border rounded-lg p-6 gap-4">
      {courts.length === 0 || timeSlots.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>請先選擇場館和運動項目</p>
        </div>
      ) : (
        <>
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
                    {timeSlot.label}
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
                            onClick={() =>
                              toggleTimeSlot(court.id, timeSlot.id)
                            }
                            className={cn(
                              'w-full',
                              selected &&
                                'bg-primary/10 text-primary hover:bg-primary/20'
                            )}
                          >
                            <div className="flex gap-2">
                              <span className="text-xs">NT$ {price}</span>
                              <span
                                style={{ width: 20, display: 'inline-block' }}
                              >
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
        </>
      )}
    </div>
  )
}
