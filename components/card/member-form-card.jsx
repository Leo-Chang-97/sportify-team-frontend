'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

export default function FormCard() {
  const { user, updateUserProfile } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    gender: '',
    birthday: '',
    address: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [errors, setErrors] = useState({})

  // 當用戶資料載入時，初始化表單資料
  useEffect(() => {
    if (user && !isInitialized) {
      console.log('載入用戶資料到表單:', user)
      console.log('用戶生日:', user.birth)

      // 處理日期格式
      let birthdayValue = ''
      if (user.birth) {
        // 如果後端回傳的是 ISO 日期字串，轉換為 YYYY-MM-DD 格式
        if (typeof user.birth === 'string') {
          try {
            const date = new Date(user.birth)
            if (!isNaN(date.getTime())) {
              birthdayValue = date.toISOString().split('T')[0]
            }
          } catch (error) {
            console.error('日期轉換錯誤:', error)
            birthdayValue = user.birth
          }
        } else {
          birthdayValue = user.birth
        }
      }

      setFormData({
        email: user.email || '',
        password: '', // 密碼不預填
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        birthday: birthdayValue,
        address: user.address || '',
      })
      setIsInitialized(true)
    }
  }, [user, isInitialized])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除該欄位的錯誤訊息
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  // 前端驗證函數
  const validateForm = () => {
    const newErrors = {}

    // 姓名驗證
    if (!formData.name.trim()) {
      newErrors.name = '姓名為必填欄位'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要2個字元'
    }

    // 手機號碼驗證
    if (formData.phone.trim()) {
      const phoneRegex = /^09\d{8}$/
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = '請輸入正確的手機號碼格式'
      }
    }

    // 密碼驗證（如果有輸入）
    if (formData.password.trim()) {
      if (formData.password.length < 6) {
        newErrors.password = '密碼至少需要6個字元'
      }
    }

    // 生日驗證（如果有輸入）
    if (formData.birthday) {
      const selectedDate = new Date(formData.birthday)
      const today = new Date()
      if (selectedDate > today) {
        newErrors.birthday = '生日不能是未來日期'
      }
    }

    return newErrors
  }

  const handleSubmit = async () => {
    if (!user) {
      alert('請先登入')
      return
    }

    // 清除之前的錯誤
    setErrors({})

    // 前端驗證
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    try {
      // 準備要更新的資料（排除密碼欄位，除非有輸入新密碼）
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        birth: formData.birthday,
        address: formData.address,
      }

      // 如果有輸入新密碼，加入更新資料中
      if (formData.password.trim()) {
        updateData.password = formData.password
      }

      console.log('要更新的資料:', updateData)

      // 使用 auth context 中的更新函數
      const result = await updateUserProfile(updateData)
      console.log('更新結果:', result)

      if (result.success) {
        alert('資料更新成功！')

        // 重新初始化表單資料
        if (result.user) {
          console.log('更新後的用戶資料:', result.user)

          // 處理生日欄位
          let birthdayValue = formData.birthday
          if (result.user.birth) {
            if (typeof result.user.birth === 'string') {
              try {
                const date = new Date(result.user.birth)
                if (!isNaN(date.getTime())) {
                  birthdayValue = date.toISOString().split('T')[0]
                }
              } catch (error) {
                console.error('日期轉換錯誤:', error)
                birthdayValue = result.user.birth
              }
            } else {
              birthdayValue = result.user.birth
            }
          }

          setFormData({
            email: result.user.email || user.email || '',
            password: '', // 清空密碼欄位
            name: result.user.name || '',
            phone: result.user.phone || '',
            gender: result.user.gender || '',
            birthday: birthdayValue,
            address: result.user.address || '',
          })
        } else {
          // 如果後端沒有回傳用戶資料，至少保持當前表單的值
          setFormData((prev) => ({
            ...prev,
            password: '', // 只清空密碼欄位
          }))
        }
      } else {
        // 處理後端錯誤
        const errs = {}
        const shown = {}

        result.issues?.forEach((issue) => {
          const field = issue.path[0]
          if (shown[field]) return // 避免重複顯示同欄位錯誤

          // 映射欄位名稱
          let mappedField = field
          if (field === 'birth') {
            mappedField = 'birthday'
          }

          errs[mappedField] = issue.message
          shown[mappedField] = true
        })

        // 如果沒有特定欄位錯誤，顯示一般錯誤訊息
        if (Object.keys(errs).length === 0) {
          errs.general = result.message || '更新失敗，請稍後再試'
        }

        setErrors(errs)
      }
    } catch (error) {
      console.error('更新錯誤:', error)
      setErrors({ general: '更新失敗，請稍後再試' })
    } finally {
      setIsLoading(false)
    }
  }

  // 如果還沒載入用戶資料，顯示載入中
  if (!user) {
    return (
      <div className="w-[800px] h-[1200px] bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    )
  }

  return (
    <div className="w-[800px] h-[1200px] bg-white rounded-lg shadow-lg p-8">
      <div className="flex flex-col gap-4">
        <div className="self-stretch py-3 border-b-2 border-slate-900 inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
            帳號設定
          </div>
        </div>

        {/* 一般錯誤訊息 */}
        {errors.general && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {errors.general}
          </div>
        )}

        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          <div className="w-[627px] flex flex-col justify-start items-start gap-2">
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
          <div className="w-[627px] flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              密碼
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="請輸入新密碼（留空表示不修改）"
              className={`self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] ${
                errors.password ? 'outline-red-500' : 'outline-gray-500'
              } text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-transparent focus:outline-orange-500 focus:outline-2`}
            />
            <div className="h-4 flex items-center">
              {errors.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}
            </div>
          </div>
        </div>
        <div className="self-stretch py-3 border-b-2 border-slate-900 inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
            個人檔案
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          <div className="w-[627px] flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              姓名
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="請輸入姓名"
              className={`self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] ${
                errors.name ? 'outline-red-500' : 'outline-gray-500'
              } text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-transparent focus:outline-orange-500 focus:outline-2`}
            />
            <div className="h-4 flex items-center">
              {errors.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}
            </div>
          </div>
          <div className="w-[627px] flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              手機
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="請輸入手機號碼"
              className={`self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] ${
                errors.phone ? 'outline-red-500' : 'outline-gray-500'
              } text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-transparent focus:outline-orange-500 focus:outline-2`}
            />
            <div className="h-4 flex items-center">
              {errors.phone && (
                <div className="text-red-500 text-sm">{errors.phone}</div>
              )}
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
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
            <div className="h-4 flex items-center">
              {/* 性別欄位目前沒有驗證，但保留空間以保持一致性 */}
            </div>
          </div>
          <div className="w-[627px] flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              生日
            </div>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
              className={`self-stretch px-2.5 py-2 rounded outline outline-1 outline-offset-[-1px] ${
                errors.birthday ? 'outline-red-500' : 'outline-gray-500'
              } text-slate-900 font-bold font-['Noto_Sans_TC'] leading-normal bg-transparent focus:outline-orange-500 focus:outline-2`}
            />
            <div className="h-4 flex items-center">
              {errors.birthday && (
                <div className="text-red-500 text-sm">{errors.birthday}</div>
              )}
            </div>
          </div>
          <div className="w-[627px] flex flex-col justify-start items-start gap-2">
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
            <div className="h-4 flex items-center">
              {/* 地址欄位目前沒有驗證，但保留空間以保持一致性 */}
            </div>
          </div>
        </div>
        <div className="w-full py-8">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-12 py-4 w-full rounded-lg outline outline-1 outline-orange-500 inline-flex justify-center items-center overflow-hidden transition ${
              isLoading
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'hover:bg-orange-500 hover:text-white'
            }`}
          >
            <div className="justify-start text-slate-900 text-xl font-bold font-['Noto_Sans_TC'] leading-normal">
              {isLoading ? '儲存中...' : '儲存'}
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
