// components/card/course-card.jsx - 簡化版本
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Calendar, MapPin, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CourseCard = ({ course }) => {
  const router = useRouter();

  // 預設資料
  const defaultCourse = {
    id: 1,
    title: '羽球課程',
    description: '完整而有系統的羽球訓練流程規劃，培養深度專業認知與教學能力，運用多元及創新思維，帶領孩子探索身體，體驗不同的功能性，設計多元性的運動發展能力。',
    image: '/product-pic/badminton-course.png',
    price: 4800,
    duration: '6-8週',
    level: '初級',
    instructor_name: '待定',
    sport_name: '羽球',
    schedule_display: '時間待定',
    capacity_display: '0/0人',
    available_spots: 10
  };

  const courseData = { ...defaultCourse, ...course };

  // 檢查是否還有名額
  const isFullyBooked = courseData.available_spots <= 0;
  const isLowAvailability = courseData.available_spots <= 3 && courseData.available_spots > 0;

  // 處理點擊卡片跳轉到詳細頁面
  const handleCardClick = (e) => {
    // 如果點擊的是按鈕，不要觸發卡片點擊
    if (e.target.closest('button')) {
      return;
    }
    router.push(`/course/${courseData.id}`);
  };

  // 處理查看詳情
  const handleViewDetails = (e) => {
    e.stopPropagation(); // 防止冒泡到卡片點擊
    router.push(`/course/${courseData.id}`);
  };

  // 處理立即報名
  const handleEnrollment = (e) => {
    e.stopPropagation(); // 防止冒泡到卡片點擊
    if (isFullyBooked) return;
    
    // 直接跳轉到課程詳細頁面，讓用戶在那裡報名
    router.push(`/course/${courseData.id}`);
  };

  return (
    <div 
      className="max-w-md mx-auto relative cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* 課程圖片 */}
      <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
        <img 
          src={courseData.image} 
          alt={courseData.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/product-pic/default-course.png'
          }}
        />
        
        {/* 價格標籤
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm font-bold shadow-md">
            NT$ {courseData.price.toLocaleString()}
          </span>
        </div> */}

        {/* 狀態標籤 */}
        <div className="absolute top-3 right-3 z-10">
          {isFullyBooked ? (
            <span className="bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              額滿
            </span>
          ) : isLowAvailability ? (
            <span className="bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              僅剩 {courseData.available_spots} 名額
            </span>
          ) : (
            <span className="bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              報名中
            </span>
          )}
        </div>

        {/* 懸浮顯示：點擊查看詳情 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="text-white text-center">
            <Eye className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">點擊查看詳情</span>
          </div>
        </div>
      </div>

      {/* 課程基本資訊 - 錯位玻璃模糊效果 */}
      <div className="relative -mt-16 mx-4 z-20">
        {/* 模糊背景卡片 */}
        <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-xl ">
          {/* 內容區域 */}
          <div className="p-4">
            {/* 課程標題和運動類型 */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white hover:text-blue-600 transition-colors line-clamp-1">
                {courseData.title}
              </h3>
              <span className="text-xs bg-blue-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full shrink-0 ml-2 shadow-sm">
                {courseData.level}
              </span>
            </div>

            {/* 基本資訊 */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-white text-sm">
                <User className="w-4 h-4 mr-2 text-highlight shrink-0" />
                <span className="truncate">教練：{courseData.instructor_name}</span>
              </div>
              <div className="flex items-center text-white text-sm">
                <Users className="w-4 h-4 mr-2 text-highlight shrink-0" />
                <span className="truncate">報名人數：{courseData.capacity_display}</span>
              </div>
            </div>

            {/* 課程描述（簡短版） */}
            <div className="mb-4">
              <p className="text-white text-sm leading-relaxed line-clamp-2">
                {courseData.description}
              </p>
            </div>

            {/* 按鈕區域 */}
            <div className="space-y-2">
              {/* 查看完整詳情按鈕
              <Button
                onClick={handleViewDetails}
                className="w-full flex items-center justify-center space-x-2 border-0 text-white-700 hover:bg-gray-100/60 h-9 backdrop-blur-sm bg-white/40 hover:border-white-300"
              >
                <Eye className="w-4 h-4" />
                <span>查看完整詳情</span>
              </Button> */}

              {/* 立即報名按鈕 */}
              <Button 
                onClick={handleEnrollment}
                className={`w-full h-9 backdrop-blur-sm border-0 shadow-lg ${
                  isFullyBooked 
                    ? 'bg-gray-500/80 cursor-not-allowed hover:bg-gray-500/80' 
                    : 'bg-blue-600/80 hover:bg-blue-700/90'
                } text-white font-medium`}
                disabled={isFullyBooked}
              >
                {isFullyBooked ? '課程額滿' : '立即報名'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;