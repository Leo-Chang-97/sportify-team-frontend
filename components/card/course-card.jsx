// components/card/course-card.jsx - 簡化版本
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Calendar, MapPin, Users, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CourseCard = ({ course }) => {
  const router = useRouter()

  // 預設資料
  const defaultCourse = {
    id: 1,
    title: '羽球課程',
    description:
      '完整而有系統的羽球訓練流程規劃，培養深度專業認知與教學能力，運用多元及創新思維，帶領孩子探索身體，體驗不同的功能性，設計多元性的運動發展能力。',
    image: '/course-pic/badminton-course.png',
    price: 4800,
    duration: '6-8週',
    level: '初級',
    instructor_name: '待定',
    sport_name: '羽球',
    schedule_display: '時間待定',
    capacity_display: '0/0人',
    available_spots: 10,
  }

  const courseData = { ...defaultCourse, ...course }

  // 檢查是否還有名額
  const isFullyBooked = courseData.maxCapacity - courseData.currentCount <= 0
  const isLowAvailability =
    courseData.maxCapacity - courseData.currentCount <= 10 &&
    courseData.maxCapacity - courseData.currentCount > 0
  // console.log(isFullyBooked)
  console.log(courseData.maxCapacity - courseData.currentCount)
  // 處理點擊圖片跳轉到詳細頁面
  const handleImageClick = (e) => {
    e.stopPropagation()
    router.push(`/course/${courseData.id}`)
  }

  // 處理立即報名 - 跳轉到付款頁面
  const handleEnrollment = (e) => {
    e.stopPropagation() // 防止冒泡到卡片點擊
    if (isFullyBooked) return

    // 準備付款頁面需要的課程資料
    const enrollmentData = {
      // 基本課程資訊
      courseId: courseData.id,
      courseName: courseData.title,
      courseType: '團體課程',
      instructor: courseData.instructor_name,
      duration: courseData.duration,
      schedule: courseData.schedule_display,

      // 課程時間（可以根據實際需求調整）
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-04-08'),

      // 地點資訊
      location: '體育館青少年A教室',

      // 人數資訊 - 從 capacity_display "8/15人" 中提取數字
      students: parseInt(courseData.capacity_display.split('/')[0]) || 0,
      maxStudents: parseInt(courseData.capacity_display.split('/')[1]) || 15,

      // 價格資訊
      unitPrice: courseData.price,
      totalPrice: courseData.price,

      // 課程圖片
      courseImage: courseData.image,

      // 其他資訊
      courseLevel: courseData.level,
      ageGroup: '中學-高中、國小中高年級以上',
      sportName: courseData.sport_name,
    }

    // 跳轉到付款頁面，並通過 URL 參數傳遞課程資料
    const queryString = encodeURIComponent(JSON.stringify(enrollmentData))
    router.push(`/course/booking/payment?data=${queryString}`)
  }

  return (
    <div className="max-w-md mx-auto relative">
      {/* 課程圖片 */}
      <div
        className="relative h-64 overflow-hidden rounded-lg shadow-lg cursor-pointer group"
        onClick={handleImageClick}
      >
        <img
          src={courseData.image}
          alt={courseData.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/course-pic/default-course.png'
          }}
        />

        {/* 狀態標籤 */}
        <div className="absolute top-3 right-3 z-10 flex justify-center">
          {isFullyBooked ? (
            <span className="bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              額滿
            </span>
          ) : isLowAvailability ? (
            <span className="bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              僅剩 {`${courseData.maxCapacity - courseData.currentCount}`} 名額
            </span>
          ) : (
            <span className="bg-highlight backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              報名中
            </span>
          )}
        </div>

        {/* 懸浮顯示：點擊查看詳情 */}
        <div className="absolute inset-0 bg-black/60 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="text-white text-center">
            <Eye className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">點擊查看詳情</span>
          </div>
        </div>
      </div>

      {/* 課程基本資訊 - 錯位玻璃模糊效果 */}
      <div className="relative -mt-16 mx-4 z-20">
        {/* 模糊背景卡片 */}
        <div className="bg-primary/20 backdrop-blur-lg rounded-xl shadow-xl ">
          {/* 內容區域 */}
          <div className="p-4">
            {/* 課程標題和運動類型 */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white hover:text-blue-600 transition-colors line-clamp-1">
                {courseData.title}
              </h3>
              <span className="text-xs bg-background/80 backdrop-blur-sm text-white px-2 py-1 rounded-full shrink-0 ml-2 shadow-sm">
                {courseData.sport_name}
              </span>
            </div>

            {/* 基本資訊 */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-white text-sm">
                <User className="w-4 h-4 mr-2 text-highlight shrink-0" />
                <span className="truncate">教練：{courseData.coach_name}</span>
              </div>
              <div className="flex items-center text-white text-sm">
                <Users className="w-4 h-4 mr-2 text-highlight shrink-0" />
                <span className="truncate">
                  報名人數：
                  {`${courseData.currentCount}/${courseData.maxCapacity}`}
                </span>
              </div>
            </div>
            {/* 課程描述（簡短版） */}
            <div className="mb-4">
              <p className="text-white text-sm leading-relaxed line-clamp-2">
                {courseData.description}
              </p>
            </div>
            {/* 立即報名按鈕 */}
            <div className="space-y-2">
              <Button
                variant="secondary"
                onClick={handleEnrollment}
                className={`w-full h-9 backdrop-blur-sm border-0 shadow-lg ${
                  isFullyBooked
                    ? 'bg-gray-500/80 cursor-not-allowed hover:bg-gray-500/80'
                    : 'hover:bg-gray-300'
                } font-medium`}
                disabled={isFullyBooked}
              >
                {isFullyBooked ? '課程額滿' : '立即報名'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
