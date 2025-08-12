// components/CourseCard.jsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CourseCard = ({ course }) => {
  // 如果沒有傳入 course 資料，使用預設值
  const defaultCourse = {
    id: 1,
    title: '羽球課程',
    description: '透過完整而有系統的訓練流程規劃，培養深度專業認知與教學能力，運用多元及創新思維，帶領孩子探索身體，體驗不同的功能性，設計多元性的運動發展能力。',
    image: '/product-pic/volleyball-course.png',
    emoji: ''
  };

  const courseData = course || defaultCourse;

  return (
    <div className="max-w-md mx-auto relative">
      {/* 背景圖片區域 */}
      <div className="relative h-64 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 rounded-t-lg overflow-hidden">
        <img 
          src={courseData.image} 
          alt={courseData.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 浮起來的資訊卡片 - 固定高度確保等高 */}
      <div className="relative -mt-16 bg-slate-700/85 backdrop-blur-sm rounded-lg border-gray-100 z-10 min-h-[200px]">
        <div className="p-6">
          {/* 課程圖示和標題 */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3 shadow-md">
              <span className="text-white text-lg">{courseData.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{courseData.title}</h3>
          </div>
          
          {/* 描述文字 - 使用自定義樣式限制為三行 */}
          <p 
            className="text-white text-sm leading-relaxed mb-6"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '4.5rem', // 約三行的高度 (1.5rem line-height × 3)
            }}
          >
            {courseData.description}
          </p>
          
          {/* Read More 按鈕 */}
          <Link href={`/course/${courseData.id}`}>
            <button className="flex items-center text-gray-400 hover:text-gray-50 transition-all duration-300 group">
              <span className="text-sm font-medium mr-2">Read More</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
      
      {/* 底部留白，避免卡片被截斷 */}
      <div className="h-4"></div>
    </div>
  );
};

export default CourseCard;