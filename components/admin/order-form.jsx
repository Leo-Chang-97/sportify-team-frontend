'use client'

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
  fetchOrder,
  createOrder,
  updateOrder,
  fetchDelivery,
  fetchPayment,
  fetchInvoice,
  fetchOrderStatus,
} from '@/api'
import { fetchAllProductsBasic } from '@/api/shop/product'

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
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(mode === 'edit')
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
    status: '',
    items: [], // [{ productId, name, price, quantity }]
  })

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
          fetchDelivery(),
          fetchPayment(),
          fetchInvoice(),
          fetchOrderStatus(),
          fetchAllProductsBasic(),
        ])
        setDelivery(deliveryData.data || [])
        setPayment(paymentData.data || [])
        setInvoice(invoiceData.data || [])
        setOrderStatus(orderStatusData.data || [])
        setProducts(productData.data || [])
      } catch (error) {
        toast.error('載入選項失敗')
      }
    }
    loadOptions()
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !orderId) {
      setIsDataLoading(false)
      return
    }
    const loadOrder = async () => {
      try {
        setIsDataLoading(true)
        const orderData = await fetchOrder(orderId)
        console.log('fetchOrder 回傳的完整資料:', orderData)
        console.log('orderData.data:', orderData.data)
        if (orderData.code === 200 && orderData.data) {
          const data = orderData.data
          setFormData({
            memberId: data.memberId?.toString() || '',
            total: data.total?.toString() || '',
            recipient: data.recipient || '',
            phone: data.phone || '',
            address: data.address || '',
            delivery: data.delivery || '',
            fee: data.fee?.toString() || '',
            payment: data.payment || '',
            invoice: data.type || '',
            invoiceNumber: data.number || '',
            status: data.status || '',
            items: data.items || [],
          })
        }
      } catch (error) {
        toast.error('載入訂單資料失敗')
      } finally {
        setIsDataLoading(false)
      }
    }
    loadOrder()
  }, [mode, orderId])

  const handleInputChange = (name, value) => {
    // 選擇物流方式時自動帶入運費
    if (name === 'delivery') {
      let fee = ''
      if (value === 'seven' || value === '全家') fee = 60
      else if (value === '宅配') fee = 100
      setFormData((prev) => ({ ...prev, delivery: value, fee }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // 商品明細操作
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
        { productId: '', name: '', price: '', quantity: 1 },
      ],
    }))
  }
  const handleRemoveItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }))
  }

  const handleProductSelect = (idx, productId) => {
    const product = products.find((p) => p.id.toString() === productId)
    setFormData((prev) => {
      const items = [...prev.items]
      items[idx] = {
        ...items[idx],
        productId,
        name: product?.name || '',
        price: product?.price?.toString() || '',
      }
      return { ...prev, items }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        total: Number(formData.total),
        fee: Number(formData.fee),
        items: formData.items.map((item) => ({
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
      }
      let result
      if (mode === 'edit' && orderId) {
        result = await updateOrder(orderId, submitData)
      } else {
        result = await createOrder(submitData)
      }
      if (result.success || result.code === 200) {
        toast.success(mode === 'edit' ? '編輯訂單成功！' : '新增訂單成功！')
        onSuccess?.()
      } else {
        toast.error(result.message || '操作失敗')
      }
    } catch (error) {
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
      toast.error(error.message || '未知錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  if (isDataLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>載入中...</p>
        </CardContent>
      </Card>
    )
  }

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
              <Label htmlFor="total">
                訂單總金額<span className="text-red-500">*</span>
              </Label>
              <Input
                id="total"
                type="number"
                value={formData.total}
                onChange={(e) => handleInputChange('total', e.target.value)}
                placeholder="請輸入訂單總金額"
                className={errors.total ? 'border-red-500' : ''}
              />
              {errors.total && (
                <p className="text-sm text-red-500 mt-1">{errors.total}</p>
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
              <Label htmlFor="address">地址</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="請輸入地址"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
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
                        key={item.delivery + '-' + idx}
                        value={item.delivery.toString()}
                      >
                        {item.delivery}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.delivery && (
                <p className="text-sm text-red-500 mt-1">{errors.delivery}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee">運費</Label>
              <Input
                id="fee"
                type="number"
                value={formData.fee}
                disabled
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
                    payment.map((item, idx) => (
                      <SelectItem
                        key={item.payment + '-' + idx}
                        value={item.payment.toString()}
                      >
                        {item.payment}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.payment && (
                <p className="text-sm text-red-500 mt-1">{errors.payment}</p>
              )}
            </div>
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
                      <SelectItem key={item.type + '-' + idx} value={item.type}>
                        {item.type}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.invoice && (
                <p className="text-sm text-red-500 mt-1">{errors.invoice}</p>
              )}
            </div>
            {/* 發票號碼欄位 - 在編輯模式下顯示 */}
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
                        key={item.status + '-' + idx}
                        value={item.status.toString()}
                      >
                        {item.status}
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
            <div className="space-y-2">
              <Label>訂單商品明細</Label>
              <div className="border rounded p-2">
                <div className="grid grid-cols-12 gap-2 font-bold mb-2">
                  <div className="col-span-5">商品名稱</div>
                  <div className="col-span-2">單價</div>
                  <div className="col-span-2">數量</div>
                  <div className="col-span-2"></div>
                </div>
                {formData.items.map((item, idx) => (
                  <div className="grid grid-cols-12 gap-2 mb-2" key={idx}>
                    <div className="col-span-5">
                      <Select
                        value={item.productId}
                        onValueChange={(value) =>
                          handleProductSelect(idx, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選擇商品" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p, pIdx) => (
                            <SelectItem
                              key={p.id + '-' + pIdx}
                              value={p.id.toString()}
                            >
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(idx, 'price', e.target.value)
                        }
                        placeholder="單價"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, 'quantity', e.target.value)
                        }
                        placeholder="數量"
                      />
                    </div>
                    <div className="col-span-2 flex items-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        刪除
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                >
                  新增商品
                </Button>
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
