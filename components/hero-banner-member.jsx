'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function HeroBanner({
  backgroundImage = '/banner/member-banner.jpg',
  title = '會員中心',
  overlayOpacity = 'bg-primary/50',
  children,
  onSearch,
  className = '',
  containerClassName = '',
  titleClassName = 'text-4xl text-white font-bold',
  ...props
}) {
  return (
    <>
      {/* <div
        className={`relative w-full bg-cover bg-center px-4 md:px-6 mb-60 md:mb-5 ${className}`}
        style={{ backgroundImage: `url('${backgroundImage}')` }}
        {...props}
      >
        <div className={`absolute inset-0 ${overlayOpacity}`}></div>
        <div
          className={`relative container mx-auto flex flex-col h-70 max-w-screen-xl items-center justify-end gap-4 translate-y-60 md:translate-y-5 ${containerClassName}`}
        >
          <h2 className={titleClassName}>{title}</h2>
          <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5 md:items-end">
            {children}
          </div>
        </div>
      </div> */}
      <div
        className={`relative w-full bg-cover bg-center px-4 md:px-6 mb-60 md:mb-5 ${className}`}
        style={{ backgroundImage: `url('${backgroundImage}')` }}
        {...props}
      >
        <div className={`absolute inset-0 ${overlayOpacity}`}></div>
        <div className="relative container mx-auto flex flex-col self-stretch h-70 max-w-screen-xl gap-16 justify-between items-center ">
          <div className="w-full h-32 max-w-[1140px] pb-2.5 flex flex-col justify-center items-center gap-4 mt-8">
            <div className="self-stretch inline-flex justify-center items-center gap-1">
              <div className="text-center justify-center">
                <h2 className={titleClassName}>{title}</h2>
                {/* <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5 md:items-end">
                  {children}
                </div> */}
                {/* <span class="text-white text-5xl font-medium font-['Montserrat'] leading-[64px]">
                MEMBER
              </span> */}
              </div>
            </div>
          </div>
          <div className="w-[1140px] max-w-[1140px] flex flex-col justify-center items-center ">
            <img
              className="w-28 h-28 rounded-full "
              src="https://placehold.co/120x120"
            />
            <div className="inline-flex justify-center items-center gap-1">
              <div className="text-center justify-center text-white text-xl font-medium font-['Montserrat'] leading-[48px]">
                GUEST
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// 搜尋表單子元件
// export function SearchField({
//   fields = [],
//   onSearch,
//   searchButtonText = '搜尋',
//   searchButtonProps = {},
// }) {
//   return (
//     <>
//       {fields.map((field, index) => (
//         <div key={index} className="w-full space-y-2 flex-1">
//           <Label className="text-white">{field.label}</Label>
//           {field.component}
//         </div>
//       ))}
//       <Button
//         variant="secondary"
//         className="w-full md:w-auto h-10"
//         onClick={onSearch}
//         {...searchButtonProps}
//       >
//         {searchButtonText}
//       </Button>
//     </>
//   )
// }
