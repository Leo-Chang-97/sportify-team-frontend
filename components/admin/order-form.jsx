'use client'

// ===== 依賴項匯入 =====
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { toast } from 'sonner'
import {
  getOrderById,
  createAdminOrder,
  updateOrder,
} from '@/api/admin/shop/order'
import {
  fetchDeliveryOptions,
  fetchPaymentOptions,
  fetchInvoiceOptions,
  fetchStatusOptions,
} from '@/api/common'
import { fetchAllProductsOrder } from '@/api/admin/shop/product'

export default function OrderForm({
  mode = 'add',
  orderId = null,
  title,
  description,
  submitButtonText,
  loadingButtonText,
  onSuccess,
  onCancel,
}) {
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(mode === 'edit')
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 防止載入時觸發運費重置
  const [errors, setErrors] = useState({})
  const [delivery, setDelivery] = useState([])
  const [payment, setPayment] = useState([])
  const [invoice, setInvoice] = useState([])
  const [orderStatus, setOrderStatus] = useState([])
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    memberId: '',
    total: '',
    recipient: '',
    phone: '',
    address: '',
    delivery: '',
    fee: '',
    payment: '',
    invoice: '',
    invoiceNumber: '',
    invoiceCarrier: '', // 載具號碼
    invoiceTaxId: '', // 統一編號
    status: '',
    items: [], // [{ productId, name, price, quantity }]
    // 信用卡相關欄位
    creditCardNumber: '',
    creditCardName: '',
    creditCardExpiry: '',
    creditCardCvc: '',
  })

  // ===== 載入下拉選單選項 =====
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [
          deliveryData,
          paymentData,
          invoiceData,
          orderStatusData,
          productData,
        ] = await Promise.all([
          fetchDeliveryOptions(),
          fetchPaymentOptions(),
          fetchInvoiceOptions(),
          fetchStatusOptions(),
          fetchAllProductsOrder(),
        ])

        setDelivery(deliveryData.rows || [])
        setPayment(paymentData.rows || [])
        setInvoice(invoiceData.rows || [])
        setOrderStatus(orderStatusData.rows || [])
        setProducts(productData.data || [])
      } catch (error) {
        console.error('載入選項失敗:', error)
        toast.error('載入選項失敗: ' + (error.message || '未知錯誤'))
      }
    }
    loadOptions()
  }, [])

  // ===== 載入現有訂單資料（僅編輯模式）=====
  useEffect(() => {
    if (
      mode !== 'edit' ||
      !orderId ||
      payment.length === 0 ||
      invoice.length === 0
    ) {
      if (mode !== 'edit') {
        setIsDataLoading(false)
        setIsInitialLoad(false)
      }
      return
    }
    const loadOrder = async () => {
      try {
        setIsDataLoading(true)
        const orderData = await getOrderById(orderId)

        if (orderData.code === 200 && orderData.data) {
          const data = orderData.data

          // 處理商品明細，使用快照資料
          const processedItems = (data.items || []).map((item) => ({
            item_id: item.item_id, // 保留 item_id 用於更新
            productId:
              item.product_id?.toString() || item.productId?.toString() || '',
            name: item.product_name || item.name || '', // 使用快照的商品名稱
            price: item.price?.toString() || '',
            quantity: item.quantity || 1,
            is_removed: item.is_removed || 0, // 商品是否已下架
            item_status: item.item_status || 'active', // 商品項目狀態
          }))

          const formDataToSet = {
            memberId: data.member_id?.toString() || '',
            total: data.total?.toString() || '',
            recipient: data.recipient || '',
            phone: data.phone || '',
            address: data.address || '',
            delivery: data.delivery_id?.toString() || '',
            fee: data.fee !== undefined ? data.fee.toString() : '',
            payment: data.payment_id?.toString() || '',
            invoice: data.invoice?.id?.toString() || '',
            invoiceNumber: data.invoice?.number || '',
            invoiceCarrier: data.invoice?.carrier || '',
            invoiceTaxId: data.invoice?.tax || '',
            status: data.status_id?.toString() || '',
            items: processedItems,
            // 信用卡相關欄位（目前不從後端載入，保持空值）
            creditCardNumber: '',
            creditCardName: '',
            creditCardExpiry: '',
            creditCardCvc: '',
          }

          setFormData(formDataToSet)
        }
      } catch (error) {
        console.error('載入訂單資料失敗:', error)
        toast.error('載入訂單資料失敗')
      } finally {
        setIsDataLoading(false)
        setIsInitialLoad(false)
      }
    }
    loadOrder()
  }, [mode, orderId, payment, invoice]) // 加入 invoice 依賴，確保 invoice 數據載入後再執行

  // ===== 事件處理函數 =====
  const handleInputChange = (name, value) => {
    // 選擇物流方式時自動帶入運費
    if (name === 'delivery' && !isInitialLoad) {
      let fee = ''
      // 根據物流方式 ID 設定運費
      if (value === '1' || value === '2')
        fee = 60 // 7-11 或全家
      else if (value === '3') fee = 100 // 宅配

      // 如果不是宅配，清空地址
      const addressValue = value === '3' ? formData.address : ''
      setFormData((prev) => ({
        ...prev,
        delivery: value,
        fee,
        address: addressValue,
      }))

      // 清除地址相關錯誤
      if (value !== '3') {
        setErrors((prev) => ({ ...prev, address: '' }))
      }
    } else if (name === 'delivery') {
      // 初始載入時的處理
      const addressValue = value === '3' ? formData.address : ''
      setFormData((prev) => ({
        ...prev,
        delivery: value,
        address: addressValue,
      }))
    } else if (name === 'invoice') {
      // 清空發票相關欄位當切換發票類型時
      setFormData((prev) => ({
        ...prev,
        invoice: value,
        invoiceCarrier: '',
        invoiceTaxId: '',
      }))
    } else if (name === 'payment') {
      // 清空信用卡相關欄位當切換付款方式時
      setFormData((prev) => ({
        ...prev,
        payment: value,
        creditCardNumber: '',
        creditCardName: '',
        creditCardExpiry: '',
        creditCardCvc: '',
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // ===== 商品明細操作函數 =====
  const handleItemChange = (idx, key, value) => {
    setFormData((prev) => {
      const items = [...prev.items]
      items[idx] = { ...items[idx], [key]: value }
      return { ...prev, items }
    })
  }
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: '',
          name: '',
          price: '',
          quantity: 1,
          is_removed: 0,
          item_status: 'active',
        },
      ],
    }))
  }
  const handleRemoveItem = (idx) => {
    setFormData((prev) => {
      const items = [...prev.items]
      items.splice(idx, 1)
      return { ...prev, items }
    })
  }

  const handleProductSelect = (idx, productId) => {
    const product = products.find((p) => p.id.toString() === productId)
    const price = product?.price || ''

    setFormData((prev) => {
      const items = [...prev.items]
      items[idx] = {
        ...items[idx], // 保留原有的 item_id 等資料
        productId,
        name: product?.name || '',
        price: price?.toString() || '',
        quantity: items[idx].quantity || 1, // 保持原有數量或預設為1
        is_removed: 0,
        item_status: 'active',
      }
      return { ...prev, items }
    })
  }

  // 計算單項商品總價
  const calculateItemTotal = (price, quantity) => {
    const p = parseFloat(price) || 0
    const q = parseInt(quantity) || 0
    return p * q
  }

  // 計算所有商品總價
  const calculateAllItemsTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + calculateItemTotal(item.price, item.quantity)
    }, 0)
  }

  // 計算訂單總金額（商品總價 + 運費）
  const calculateOrderTotal = () => {
    const itemsTotal = calculateAllItemsTotal()
    const fee = parseFloat(formData.fee) || 0
    return itemsTotal + fee
  }

  // ===== 表單送出處理 =====
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 清除之前的錯誤訊息
    setErrors({})

    setIsLoading(true)

    try {
      // 信用卡付款模擬處理（當付款方式為綠界金流時）
      // 綠界金流 (ID: 1)
      if (formData.payment === '1') {
        // TODO: 未來這裡會串接第三方支付API (如綠界、藍新等)
        // 目前暫時模擬信用卡付款成功
        console.log('模擬信用卡付款處理:', {
          cardNumber: formData.creditCardNumber.replace(/\s/g, ''),
          cardName: formData.creditCardName,
          expiry: formData.creditCardExpiry,
          cvc: formData.creditCardCvc,
        })

        // 模擬付款延遲
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 這裡可以加入付款成功/失敗的邏輯
        // if (paymentFailed) {
        //   toast.error('信用卡付款失敗，請檢查卡片資訊');
        //   return;
        // }
      }

      const submitData = {
        member_id: formData.memberId,
        total: calculateOrderTotal(),
        fee: Number(formData.fee),
        recipient: formData.recipient,
        phone: formData.phone,
        address: formData.delivery === '3' ? formData.address : '', // 只有宅配才送出地址
        deliveryId: formData.delivery,
        paymentId: formData.payment,
        statusId: formData.status,
        invoiceId: formData.invoice,
        carrier: formData.invoice === '3' ? formData.invoiceCarrier : null,
        tax: formData.invoice === '2' ? formData.invoiceTaxId : null,
        items: formData.items
          .filter((item) => {
            // 保留已下架的商品（有 item_id 且 is_removed 為 1）
            if (item.item_id && item.is_removed === 1) {
              return true
            }
            // 過濾掉未完成選擇的新商品
            return item.productId && item.name
          })
          .map((item) => ({
            ...(item.item_id && { item_id: item.item_id }),
            product_id: Number(item.productId),
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            is_removed: item.is_removed || 0,
            status: item.item_status || 'active',
          })),
        // 注意：信用卡資料不會送到後端資料庫
        // 實際串接第三方支付時，會透過安全的支付閘道處理
      }

      let result
      if (mode === 'edit' && orderId) {
        result = await updateOrder(orderId, submitData)
      } else {
        result = await createAdminOrder(submitData)
      }
      if (result.success || result.code === 200) {
        toast.success(mode === 'edit' ? '編輯訂單成功！' : '新增訂單成功！')
        onSuccess?.()
      } else {
        toast.error(result.message || '操作失敗')
      }
    } catch (error) {
      // axios 400 驗證錯誤處理
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data
      ) {
        const result = error.response.data
        const errs = {}
        const shown = {}
        result.issues?.forEach((issue) => {
          const field = issue.path[0]
          if (shown[field]) return
          errs[field] = issue.message
          shown[field] = true
        })
        setErrors(errs)
        if (Object.keys(errs).length === 0) {
          toast.error(result.message || '輸入資料有誤')
        }
        return
      }
      console.error(mode === 'edit' ? '編輯訂單失敗:' : '新增訂單失敗:', error)
      toast.error(error.message || '未知錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  // ===== 載入中狀態 =====
  if (isDataLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>載入中...</p>
        </CardContent>
      </Card>
    )
  }

  // ===== 主要表單渲染 =====
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberId">
                會員ID<span className="text-red-500">*</span>
              </Label>
              <Input
                id="memberId"
                type="text"
                value={formData.memberId}
                onChange={(e) => handleInputChange('memberId', e.target.value)}
                placeholder="請輸入會員ID"
                className={errors.memberId ? 'border-red-500' : ''}
              />
              {errors.memberId && (
                <p className="text-sm text-red-500 mt-1">{errors.memberId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">
                收件人<span className="text-red-500">*</span>
              </Label>
              <Input
                id="recipient"
                type="text"
                value={formData.recipient}
                onChange={(e) => handleInputChange('recipient', e.target.value)}
                placeholder="請輸入收件人"
                className={errors.recipient ? 'border-red-500' : ''}
              />
              {errors.recipient && (
                <p className="text-sm text-red-500 mt-1">{errors.recipient}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                手機號碼<span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="請輸入手機號碼"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery">
                物流方式<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.delivery}
                onValueChange={(value) => handleInputChange('delivery', value)}
              >
                <SelectTrigger
                  className={errors.delivery ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="請選擇物流方式" />
                </SelectTrigger>
                <SelectContent>
                  {delivery.length === 0 ? (
                    <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
                  ) : (
                    delivery.map((item, idx) => (
                      <SelectItem
                        key={`delivery-${item.id}-${idx}`}
                        value={item.id.toString()}
                      >
                        {item.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.delivery && (
                <p className="text-sm text-red-500 mt-1">{errors.delivery}</p>
              )}
            </div>
            {/* 只有選擇宅配時才顯示地址欄位 */}
            {formData.delivery === '3' && (
              <div className="space-y-2">
                <Label htmlFor="address">
                  收件地址<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="請輸入收件地址"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="fee">運費</Label>
              <Input
                id="fee"
                type="number"
                value={formData.fee}
                onChange={(e) => handleInputChange('fee', e.target.value)}
                placeholder="運費"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment">
                付款方式<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.payment}
                onValueChange={(value) => handleInputChange('payment', value)}
              >
                <SelectTrigger
                  className={errors.payment ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="請選擇付款方式" />
                </SelectTrigger>
                <SelectContent>
                  {payment.length === 0 ? (
                    <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
                  ) : (
                    payment
                      .filter((item) => item.id && item.id !== '') // 過濾掉空值
                      .map((item, idx) => (
                        <SelectItem
                          key={`payment-${item.id}-${idx}`}
                          value={item.id.toString()}
                        >
                          {item.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
              {errors.payment && (
                <p className="text-sm text-red-500 mt-1">{errors.payment}</p>
              )}
            </div>

            {/* 信用卡輸入框 - 當付款方式為綠界金流時顯示 */}
            {/* 綠界金流 (ID: 1) */}
            {formData.payment === '1' && (
              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">
                  信用卡資訊
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 信用卡號碼 */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="creditCardNumber">
                      信用卡號碼<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="creditCardNumber"
                      type="text"
                      value={formData.creditCardNumber}
                      onChange={(e) => {
                        // 格式化卡號：只允許數字並自動加空格
                        const value = e.target.value
                          .replace(/\D/g, '')
                          .replace(/(.{4})/g, '$1 ')
                          .trim()
                        if (value.replace(/\s/g, '').length <= 16) {
                          handleInputChange('creditCardNumber', value)
                        }
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19} // 16位數字 + 3個空格
                      className={
                        errors.creditCardNumber ? 'border-red-500' : ''
                      }
                    />
                    {errors.creditCardNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.creditCardNumber}
                      </p>
                    )}
                  </div>

                  {/* 持卡人姓名 */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="creditCardName">
                      持卡人姓名<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="creditCardName"
                      type="text"
                      value={formData.creditCardName}
                      onChange={(e) =>
                        handleInputChange('creditCardName', e.target.value)
                      }
                      placeholder="請輸入持卡人姓名"
                      className={errors.creditCardName ? 'border-red-500' : ''}
                    />
                    {errors.creditCardName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.creditCardName}
                      </p>
                    )}
                  </div>

                  {/* 有效期限 */}
                  <div className="space-y-2">
                    <Label htmlFor="creditCardExpiry">
                      有效期限<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="creditCardExpiry"
                      type="text"
                      value={formData.creditCardExpiry}
                      onChange={(e) => {
                        // 格式化有效期：MM/YY
                        let value = e.target.value.replace(/\D/g, '')
                        if (value.length >= 2) {
                          value =
                            value.substring(0, 2) + '/' + value.substring(2, 4)
                        }
                        if (value.length <= 5) {
                          handleInputChange('creditCardExpiry', value)
                        }
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={
                        errors.creditCardExpiry ? 'border-red-500' : ''
                      }
                    />
                    {errors.creditCardExpiry && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.creditCardExpiry}
                      </p>
                    )}
                  </div>

                  {/* 安全碼 */}
                  <div className="space-y-2">
                    <Label htmlFor="creditCardCvc">
                      安全碼 (CVC)<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="creditCardCvc"
                      type="text"
                      value={formData.creditCardCvc}
                      onChange={(e) => {
                        // 只允許數字，最多3位
                        const value = e.target.value.replace(/\D/g, '')
                        if (value.length <= 3) {
                          handleInputChange('creditCardCvc', value)
                        }
                      }}
                      placeholder="123"
                      maxLength={3}
                      className={errors.creditCardCvc ? 'border-red-500' : ''}
                    />
                    {errors.creditCardCvc && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.creditCardCvc}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  <p>
                    *
                    此為模擬信用卡輸入介面，實際付款會透過第三方安全支付平台處理
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="invoice">
                發票類型<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.invoice}
                onValueChange={(value) => handleInputChange('invoice', value)}
              >
                <SelectTrigger
                  className={errors.invoice ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="請選擇發票類型" />
                </SelectTrigger>
                <SelectContent>
                  {invoice.length === 0 ? (
                    <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
                  ) : (
                    invoice.map((item, idx) => (
                      <SelectItem
                        key={`invoice-${item.id}-${idx}`}
                        value={item.id.toString()}
                      >
                        {item.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.invoice && (
                <p className="text-sm text-red-500 mt-1">{errors.invoice}</p>
              )}
            </div>

            {/* 發票詳細資訊欄位 */}
            {/* 電子載具 (ID: 3) */}
            {formData.invoice === '3' && (
              <div className="space-y-2">
                <Label htmlFor="invoiceCarrier">
                  載具號碼<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invoiceCarrier"
                  type="text"
                  value={formData.invoiceCarrier || ''}
                  onChange={(e) =>
                    handleInputChange('invoiceCarrier', e.target.value)
                  }
                  placeholder="請輸入載具號碼 (如手機條碼)"
                  className={errors.invoiceCarrier ? 'border-red-500' : ''}
                />
                {errors.invoiceCarrier && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.invoiceCarrier}
                  </p>
                )}
              </div>
            )}

            {/* 統一編號 (ID: 2) */}
            {formData.invoice === '2' && (
              <div className="space-y-2">
                <Label htmlFor="invoiceTaxId">
                  統一編號<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invoiceTaxId"
                  type="text"
                  value={formData.invoiceTaxId || ''}
                  onChange={(e) =>
                    handleInputChange('invoiceTaxId', e.target.value)
                  }
                  placeholder="請輸入8位數統一編號"
                  className={errors.invoiceTaxId ? 'border-red-500' : ''}
                  maxLength={8}
                />
                {errors.invoiceTaxId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.invoiceTaxId}
                  </p>
                )}
              </div>
            )}

            {mode === 'edit' && (
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">發票號碼</Label>
                <Input
                  id="invoiceNumber"
                  type="text"
                  value={formData.invoiceNumber || ''}
                  onChange={(e) =>
                    handleInputChange('invoiceNumber', e.target.value)
                  }
                  placeholder="請輸入發票號碼"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="status">
                訂單狀態<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger
                  className={errors.status ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="請選擇訂單狀態" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatus.length === 0 ? (
                    <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
                  ) : (
                    orderStatus.map((item, idx) => (
                      <SelectItem
                        key={`status-${item.id}-${idx}`}
                        value={item.id.toString()}
                      >
                        {item.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status}</p>
              )}
            </div>
            {/* ===== 商品明細區塊 ===== */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  訂單商品明細<span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600">
                  商品明細一旦確認後將無法直接修改，如需調整請刪除後重新新增
                </p>
              </div>
              {errors.items && (
                <p className="text-sm text-red-500">{errors.items}</p>
              )}
              <div className="border rounded-lg overflow-hidden">
                {/* 表頭 */}
                <div className="bg-gray-50 grid grid-cols-12 gap-4 p-4 font-semibold text-sm border-b">
                  <div className="col-span-4">商品名稱</div>
                  <div className="col-span-2 text-right">單價</div>
                  <div className="col-span-2 text-center">數量</div>
                  <div className="col-span-2 text-right">小計</div>
                  <div className="col-span-2 text-center">操作</div>
                </div>

                {/* 商品列表 */}
                <div className="divide-y">
                  {formData.items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      尚未新增商品，請點擊下方「新增商品」按鈕
                    </div>
                  ) : (
                    formData.items.map((item, idx) => (
                      <div
                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50"
                        key={`item-row-${idx}-${item.productId || 'empty'}`}
                      >
                        <div className="col-span-4">
                          {item.name ? (
                            <div className="flex items-center space-x-2">
                              <span className="flex-1 p-2">
                                {item.name}
                                {item.is_removed === 1 && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    已下架
                                  </span>
                                )}
                              </span>
                            </div>
                          ) : (
                            <Select
                              key={`product-${idx}-${item.productId || 'empty'}`}
                              value={item.productId || ''}
                              onValueChange={(value) =>
                                handleProductSelect(idx, value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="請選擇商品">
                                  {item.productId
                                    ? products.find(
                                        (p) =>
                                          p.id.toString() === item.productId
                                      )?.name || '未找到商品'
                                    : '請選擇商品'}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {products
                                  .filter((p) => p.id && p.id !== '') // 過濾掉空值
                                  .map((p, idx) => {
                                    const price = p?.price || 0
                                    return (
                                      <SelectItem
                                        key={`product-option-${p.id}-${idx}`}
                                        value={p.id.toString()}
                                      >
                                        {p.name}
                                      </SelectItem>
                                    )
                                  })}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                        {/* 單價 */}
                        <div className="col-span-2">
                          <div className="text-right font-medium p-2">
                            ${parseFloat(item.price || 0).toLocaleString()}
                          </div>
                        </div>
                        {/* 數量 */}
                        <div className="col-span-2">
                          {mode === 'edit' && item.item_id ? (
                            <div className="text-center p-2">
                              {item.quantity || 1}
                            </div>
                          ) : (
                            // 新增模式或編輯模式下的新增項目：可編輯數量
                            <Input
                              key={`quantity-${idx}`}
                              type="number"
                              min="1"
                              value={item.quantity || 1}
                              onChange={(e) =>
                                handleItemChange(
                                  idx,
                                  'quantity',
                                  e.target.value
                                )
                              }
                              className="text-center"
                              placeholder="1"
                            />
                          )}
                        </div>
                        {/* 小計 */}
                        <div className="col-span-2">
                          <div className="text-right font-semibold">
                            $
                            {calculateItemTotal(
                              item.price,
                              item.quantity
                            ).toLocaleString()}
                          </div>
                        </div>
                        {/* 操作按鈕 */}
                        <div className="col-span-2 text-center">
                          {mode === 'edit' && item.item_id ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              刪除
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            >
                              {mode === 'edit' ? '刪除' : '取消'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="bg-gray-50 p-4 border-t">
                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddItem}
                    >
                      + 新增商品
                    </Button>

                    {formData.items.length > 0 && (
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          商品小計: ${calculateAllItemsTotal().toLocaleString()}
                        </div>
                        <div className="text-sm">
                          運費: $
                          {parseFloat(formData.fee || 0).toLocaleString()}
                        </div>
                        <div className="text-lg font-bold">
                          訂單總金額: ${calculateOrderTotal().toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? loadingButtonText : submitButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
