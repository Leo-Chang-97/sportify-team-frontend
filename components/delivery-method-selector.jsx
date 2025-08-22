'use client'

// react
import React, { useState, useEffect } from 'react'
// ui components
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemContent,
  ChoiceboxItemHeader,
  ChoiceboxItemIndicator,
  ChoiceboxItemSubtitle,
  ChoiceboxItemTitle,
} from '@/components/ui/choicebox'

const DeliveryOptions = [
  {
    id: '1',
    label: '7-11取貨',
    subtitle: '運費$60',
    fee: 60,
    component: null, // 不顯示額外選項
  },
  {
    id: '2',
    label: '全家取貨',
    subtitle: '運費$60',
    fee: 60,
    component: null,
  },
  {
    id: '3',
    label: '宅配',
    subtitle: '運費$100',
    fee: 100,
    component: null,
  },
]

export default function DeliveryMethodSelector({
  selectedDelivery,
  onDeliveryChange,
  errors = {},
  className = '',
  formData = {},
  onInputChange,
  onInputBlur,
}) {
  // ===== 組件狀態管理 =====
  const [store, setStore] = useState(null)

  const sevenStore = () => {
    window.open(
      'https://emap.presco.com.tw/c2cemap.ashx?eshopid=870&&servicetype=1&url=' +
        encodeURIComponent('http://localhost:3005/api/shop/shipment'),
      '',
      'width=900,height=600'
    )
  }

  // 接收後端傳回的門市資料
  useEffect(() => {
    const handleMessage = (event) => {
      setStore(event.data)
      if (event.data && event.data.storename && onInputChange) {
        onInputChange('storeName', event.data.storename)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onInputChange])

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Label className="text-base font-medium">選擇物流方式</Label>
        {errors.delivery && (
          <span className="text-destructive text-sm">{errors.delivery}</span>
        )}
      </div>
      <div className="space-y-2">
        <Choicebox value={selectedDelivery} onValueChange={onDeliveryChange}>
          {DeliveryOptions.map((option) => (
            <div key={option.id}>
              <ChoiceboxItem value={option.id}>
                <ChoiceboxItemHeader>
                  <ChoiceboxItemTitle>
                    {option.label}
                    <ChoiceboxItemSubtitle>
                      {option.subtitle}
                    </ChoiceboxItemSubtitle>
                  </ChoiceboxItemTitle>
                </ChoiceboxItemHeader>
                <ChoiceboxItemContent>
                  <ChoiceboxItemIndicator />
                </ChoiceboxItemContent>
              </ChoiceboxItem>
              {/* 動態顯示選中選項的組件 */}
              {selectedDelivery === option.id && option.id === '1' && (
                <div
                  id="storeName"
                  className="ml-6 mt-3 flex gap-3 items-center"
                >
                  <Button variant="highlight" onClick={sevenStore}>
                    選擇門市
                  </Button>
                  {store && <div className="text-sm">{store.storename}</div>}
                  {errors.storeName && (
                    <span className="text-destructive text-sm">
                      {errors.storeName}
                    </span>
                  )}
                </div>
              )}
              {selectedDelivery === option.id && option.id === '3' && (
                <div className="ml-6 mt-3 space-y-2">
                  <Label htmlFor="address" className="text-sm">收件地址</Label>
                  <Input
                    type="text"
                    id="address"
                    placeholder="請填寫收件地址"
                    className={`w-full text-sm ${errors.address ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                    value={formData.address || ''}
                    onChange={(e) =>
                      onInputChange && onInputChange('address', e.target.value)
                    }
                    onBlur={(e) =>
                      onInputBlur && onInputBlur('address', e.target.value)
                    }
                  />
                  {errors.address && (
                    <span className="text-destructive text-sm">
                      {errors.address}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </Choicebox>
      </div>
    </div>
  )
}

// 匯出物流選項資料供其他地方使用
export { DeliveryOptions }
