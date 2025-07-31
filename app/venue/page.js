'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  createReservation,
  fetchReservation,
  updateReservation,
  fetchMemberOptions,
  fetchLocationOptions,
  fetchTimePeriodOptions,
  fetchCenterOptions,
  fetchSportOptions,
  fetchCourtOptions,
  fetchTimeSlotOptions,
  fetchCourtTimeSlotOptions,
  fetchStatusOptions,
} from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBanner, { SearchField } from '@/components/hero-banner'
import ScrollAreaSport from '@/components/scroll-area-sport'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CenterCard } from '@/components/card/center-card'
import { ChevronDownIcon, ArrowRight } from 'lucide-react'

export default function VenueListPage() {
  // ===== 組件狀態管理 =====
  const [isLoading, setIsLoading] = useState(false)
  // const [isDataLoading, setIsDataLoading] = useState(mode === 'edit')
  const [isInitialDataSet, setIsInitialDataSet] = useState(false)

  const [memberId, setMemberId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [centerId, setCenterId] = useState('')
  const [sportId, setSportId] = useState('')
  const [courtId, setCourtIds] = useState('')
  const [timePeriodId, setTimePeriodId] = useState('')
  const [timeSlotId, setTimeSlotIds] = useState('')
  const [courtTimeSlotId, setCourtTimeSlotIds] = useState('')
  const [statusId, setStatusId] = useState('')
  const [date, setDate] = useState(null)
  const [price, setPrice] = useState('')

  const [members, setMembers] = useState([])
  const [locations, setLocations] = useState([])
  const [centers, setCenters] = useState([])
  const [sports, setSports] = useState([])
  const [courts, setCourts] = useState([])
  const [timePeriods, setTimePeriods] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [courtTimeSlots, setCourtTimeSlots] = useState([])
  const [status, setStatus] = useState([])

  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)

  // ===== 載入下拉選單選項 =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const memberData = await fetchMemberOptions()
        setMembers(memberData.rows || [])

        const locationData = await fetchLocationOptions()
        setLocations(locationData.rows || [])

        const sportData = await fetchSportOptions()
        setSports(sportData.rows || [])

        const timePeriodData = await fetchTimePeriodOptions()
        setTimePeriods(timePeriodData.rows || [])

        const statusData = await fetchStatusOptions()
        setStatus(statusData.rows || [])
      } catch (error) {
        console.error('載入球場/時段失敗:', error)
        toast.error('載入球場/時段失敗')
      }
    }
    loadData()
  }, [])

  const products = [
    {
      category: 'Audio',
      id: '1',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Premium Wireless Headphones',
      originalPrice: 249.99,
      price: 199.99,
      rating: 4.5,
    },
    {
      category: 'Wearables',
      id: '2',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Smart Watch Series 5',
      originalPrice: 349.99,
      price: 299.99,
      rating: 4.2,
    },
    {
      category: 'Photography',
      id: '3',
      image:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Professional Camera Kit',
      originalPrice: 1499.99,
      price: 1299.99,
      rating: 4.8,
    },
    {
      category: 'Furniture',
      id: '4',
      image:
        'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Ergonomic Office Chair',
      originalPrice: 299.99,
      price: 249.99,
      rating: 4.6,
    },
    {
      category: 'Electronics',
      id: '5',
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Smartphone Pro Max',
      originalPrice: 1099.99,
      price: 999.99,
      rating: 4.9,
    },
    {
      category: 'Electronics',
      id: '6',
      image:
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      inStock: true,
      name: 'Ultra HD Smart TV 55"',
      originalPrice: 899.99,
      price: 799.99,
      rating: 4.7,
    },
  ]

  const handleSearch = () => {
    // 搜尋邏輯
    console.log('搜尋:', { locationId, sportId, date })
  }

  // 定義 Hero Banner 搜尋欄位
  const searchFields = [
    {
      label: '地區',
      component: (
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-full bg-white !h-10">
            <SelectValue placeholder="請選擇地區" />
          </SelectTrigger>
          <SelectContent>
            {locations.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
            ) : (
              locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id.toString()}>
                  {loc.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '運動',
      component: (
        <Select value={sportId} onValueChange={setSportId}>
          <SelectTrigger className="w-full bg-white !h-10">
            <SelectValue placeholder="請選擇運動" />
          </SelectTrigger>
          <SelectContent>
            {sports?.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">沒有符合資料</div>
            ) : (
              sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id.toString()}>
                  {sport.name || sport.id}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ),
    },
    {
      label: '日期',
      component: (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className={`w-full h-10 bg-white justify-between font-normal${
                !date ? ' text-gray-500' : ' text-primary'
              }`}
            >
              {date ? date.toLocaleDateString() : '請選擇預訂日期'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
              className={errors.date ? 'border border-red-500 rounded-md' : ''}
            />
          </PopoverContent>
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date}</p>
          )}
        </Popover>
      ),
    },
  ]

  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBanner
        backgroundImage="/banner/venue-banner.jpg"
        title="馬上預訂動起來"
        overlayOpacity="bg-primary/50"
      >
        <SearchField
          fields={searchFields}
          onSearch={handleSearch}
          searchButtonText="搜尋"
        />
      </HeroBanner>
      <ScrollAreaSport />
      <section className="py-10">
        <div className="container mx-auto max-w-screen-xl px-4">
          <h3 className="text-lg text-forgeground">精選場館</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <CenterCard
                key={product.id}
                // onAddToCart={handleAddToCart}
                // onAddToWishlist={handleAddToWishlist}
                product={product}
              />
            ))}
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/products">
            <Button className="group h-12 px-8" size="lg" variant="secondary">
              載入更多
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </>
  )
}
