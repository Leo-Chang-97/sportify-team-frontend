'use client'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

const pageNameMap = {
  venue: '場地預訂',
  reservation: '選擇場地與時間',
  payment: '填寫付款資訊',
  success: '完成訂單',
  shop: '購物商城',
  order: '確認購物車',
  team: '揪團組隊',
  course: '課程報名',
  member: '會員中心',
}

export default function BreadcrumbAuto({
  venueName,
  shopName,
  teamName,
  courseName,
}) {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)

  const dynamicNameMap = {
    venue: venueName,
    shop: shopName,
    team: teamName,
    course: courseName,
  }

  return (
    <div
      className={cn(
        'sticky top-16 z-50 w-full bg-background-dark/95 backdrop-blur supports-[backdrop-filter]:bg-background-dark/60 px-4 md:px-6 [&_*]:no-underline'
      )}
    >
      <div className="container mx-auto flex h-12 max-w-screen-xl items-center justify-between gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">首頁</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {parts.map((part, idx) => (
              <React.Fragment key={part}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {idx === parts.length - 1 ? (
                    <BreadcrumbPage>
                      {dynamicNameMap[parts[0]] && idx === 1
                        ? dynamicNameMap[parts[0]]
                        : pageNameMap[part] || part}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={`/${parts.slice(0, idx + 1).join('/')}`}>
                        {dynamicNameMap[parts[0]] && idx === 1
                          ? dynamicNameMap[parts[0]]
                          : pageNameMap[part] || part}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}
