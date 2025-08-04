'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemContent,
  ChoiceboxItemHeader,
  ChoiceboxItemIndicator,
  ChoiceboxItemSubtitle,
  ChoiceboxItemTitle,
} from '@/components/ui/choicebox'

// 發票選項組件
const CompanyReceiptForm = () => (
  <div className="space-y-4 p-4 bg-accent/50 rounded-lg mt-3">
    <div className="grid grid-cols-1 gap-3">
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="companyId">統一編號</Label>
        <Input
          type="text"
          id="companyId"
          placeholder="請輸入8位數統一編號"
          maxLength="8"
        />
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="companyName">公司名稱</Label>
        <Input type="text" id="companyName" placeholder="請輸入公司名稱" />
      </div>
    </div>
  </div>
)

const ElectronicCarrierForm = () => (
  <div className="space-y-4 p-4 bg-accent/50 rounded-lg mt-3">
    <div className="grid grid-cols-1 gap-3">
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="carrierId">載具號碼</Label>
        <Input
          type="text"
          id="carrierId"
          placeholder="請輸入載具號碼 (例：/XXXXXXX)"
        />
      </div>
    </div>
  </div>
)

const receiptOptions = [
  {
    id: '1',
    label: '一般發票',
    subtitle: '個人發票，無需額外資訊',
    component: null, // 不顯示額外選項
  },
  {
    id: '2',
    label: '統一編號',
    subtitle: '公司發票，需填寫統編',
    component: <CompanyReceiptForm />,
  },
  {
    id: '3',
    label: '電子載具',
    subtitle: '存入電子載具',
    component: <ElectronicCarrierForm />,
  },
]

/**
 * 發票類型選擇元件
 * @param {Object} props
 * @param {string} props.selectedReceipt - 當前選中的發票類型ID
 * @param {function} props.onReceiptChange - 發票類型變更回調函數
 * @param {string} props.className - 自定義樣式類名
 * @returns {JSX.Element}
 */
export default function ReceiptTypeSelector({
  selectedReceipt,
  onReceiptChange,
  className = '',
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-base font-medium">選擇發票類型</Label>
      <div className="space-y-2">
        <Choicebox value={selectedReceipt} onValueChange={onReceiptChange}>
          {receiptOptions.map((option) => (
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
              {selectedReceipt === option.id && option.component && (
                <div className="md:ml-6">{option.component}</div>
              )}
            </div>
          ))}
        </Choicebox>
      </div>
    </div>
  )
}

// 匯出發票選項資料供其他地方使用
export { receiptOptions }
