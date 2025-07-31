'use client'

import { useState } from 'react'

export default function FormCard() {
  const [formData, setFormData] = useState({
    email: 'test@gmail.com', // 預設 email，實際使用時應該從 member 資料中讀取
    password: '',
    name: '',
    phone: '',
    gender: '',
    birthday: '',
    address: '',
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    console.log('表單資料:', formData)
    // 這裡可以添加提交邏輯
  }

  return (
    <div className="w-[800px] h-[1200px] bg-white rounded-lg shadow-lg p-8">
      <div className="flex flex-col gap-8">
        <div className="self-stretch py-4 border-b-2 border-slate-900 inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
            帳號設定
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-12">
          <div className="w-[627px] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              email帳號
            </div>
            <input
              type="email"
              value={formData.email}
              readOnly
              disabled
              className="self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] outline-gray-500 text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
          <div className="w-[627px] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              密碼
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="請輸入密碼"
              className="self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] outline-gray-500 text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-transparent focus:outline-orange-500 focus:outline-2"
            />
          </div>
        </div>
        <div className="self-stretch py-4 border-b-2 border-slate-900 inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
            個人檔案
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-12">
          <div className="w-[627px] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              姓名
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="請輸入姓名"
              className="self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] outline-gray-500 text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-transparent focus:outline-orange-500 focus:outline-2"
            />
          </div>
          <div className="w-[627px] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              手機
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="請輸入手機號碼"
              className="self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] outline-gray-500 text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-transparent focus:outline-orange-500 focus:outline-2"
            />
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              性別
            </div>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-80 px-2 py-1 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-slate-900 text-slate-900 font-normal font-['Noto_Sans_TC'] leading-normal focus:outline-orange-500 focus:outline-2"
            >
              <option value="">請選擇性別</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="other">不公開</option>
            </select>
          </div>
          <div className="w-[627px] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              生日
            </div>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
              className="self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] outline-gray-500 text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-transparent focus:outline-orange-500 focus:outline-2"
            />
          </div>
          <div className="w-[627px] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              聯絡地址
            </div>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="請輸入聯絡地址"
              className="self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] outline-gray-500 text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-transparent focus:outline-orange-500 focus:outline-2"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-12 py-4 rounded-lg outline outline-1 outline-orange-500 inline-flex justify-center items-center overflow-hidden hover:bg-orange-100 transition"
        >
          <div className="justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
            儲存
          </div>
        </button>
      </div>
    </div>
  )
}
