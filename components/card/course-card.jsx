// components/card/course-card.jsx - 更新版本
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Calendar, MapPin, Users, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CourseCard = ({ course }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
      className="max-w-md mx-auto relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* 課程圖片 */}
      <div className="relative h-60 overflow-hidden">
        <img 
          src={courseData.image} 
          alt={courseData.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = '/product-pic/default-course.png'
          }}
        />
        
        {/* 價格標籤 */}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-2 rounded-lg text-lg font-bold shadow-md">
            NT$ {courseData.price.toLocaleString()}
          </span>
        </div>

        {/* 狀態標籤 */}
        <div className="absolute top-4 right-4">
          {isFullyBooked ? (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              額滿
            </span>
          ) : isLowAvailability ? (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              僅剩 {courseData.available_spots} 名額
            </span>
          ) : (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              報名中
            </span>
          )}
        </div>

        {/* 懸浮顯示：點擊查看詳情 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="text-white text-center">
            <Eye className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm font-medium">點擊查看詳情</span>
          </div>
        </div>
      </div>

      {/* 課程基本資訊 */}
      <div className="p-6">
        {/* 課程標題和運動類型 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            {courseData.title}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {courseData.level}
          </span>
        </div>

        {/* 基本資訊 */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <User className="w-4 h-4 mr-3 text-blue-500" />
            <span>教練：{courseData.instructor_name}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-3 text-blue-500" />
            <span>時間：{courseData.schedule_display}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-3 text-blue-500" />
            <span>期間：{courseData.duration}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <Users className="w-4 h-4 mr-3 text-blue-500" />
            <span>報名人數：{courseData.capacity_display}</span>
          </div>
        </div>

        {/* 展開/收合的詳細內容 */}
        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">課程詳情</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {courseData.description}
            </p>
            
            {/* 額外詳細資訊 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">運動類型：</span>
                  <span className="font-medium">{courseData.sport_name}</span>
                </div>
                <div>
                  <span className="text-gray-500">課程等級：</span>
                  <span className="font-medium">{courseData.level}</span>
                </div>
                <div>
                  <span className="text-gray-500">剩餘名額：</span>
                  <span className={`font-medium ${
                    isFullyBooked ? 'text-red-600' : 
                    isLowAvailability ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {courseData.available_spots} 人
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">課程狀態：</span>
                  <span className={`font-medium ${
                    isFullyBooked ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {isFullyBooked ? '已額滿' : '可報名'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 按鈕區域 */}
        <div className="mt-6 space-y-3">
          {/* 展開詳情按鈕 */}
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="w-full flex items-center justify-center space-x-2 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <span>{isExpanded ? '收合詳情' : '展開詳情'}</span>
            {isExpanded ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </Button>

          {/* 查看完整詳情按鈕 */}
          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="w-full flex items-center justify-center space-x-2 border-green-200 text-green-600 hover:bg-green-50"
          >
            <Eye className="w-4 h-4" />
            <span>查看完整詳情</span>
          </Button>

          {/* 立即報名按鈕 */}
          <Button 
            onClick={handleEnrollment}
            className={`w-full ${
              isFullyBooked 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-3`}
            disabled={isFullyBooked}
          >
            {isFullyBooked ? '課程額滿' : '立即報名'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;