'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  IconCheckupList,
  IconShoppingCart,
  IconUsers,
  IconChalkboardTeacher,
} from '@tabler/icons-react'

import { NavDocuments } from '@/components/admin/nav-documents'
import { NavMain } from '@/components/admin/nav-main'
import { NavSecondary } from '@/components/admin/nav-secondary'
import { NavUser } from '@/components/admin/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/auth-context'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/vercel.svg',
  },
  navMain: [
    {
      title: '場地預訂',
      url: '/admin/venue',
      icon: IconCheckupList,
      items: [
        {
          title: '場館管理',
          url: '/admin/venue/center',
        },
        {
          title: '開放時間管理',
          url: '/admin/venue/time-slot',
        },
        {
          title: '場地管理',
          url: '/admin/venue/court',
        },
        {
          title: '場地價格設定',
          url: '/admin/venue/court-time-slot',
        },
        {
          title: '訂單管理',
          url: '/admin/venue/reservation',
        },
      ],
    },
    {
      title: '購物商城',
      url: '/admin/shop',
      icon: IconShoppingCart,
      items: [
        {
          title: '商品管理',
          url: '/admin/shop/product',
        },
        {
          title: '訂單管理',
          url: '/admin/shop/order',
        },
      ],
    },
    {
      title: '揪團組隊',
      url: '#',
      icon: IconUsers,
    },
    {
      title: '課程報名',
      url: '#',
      icon: IconChalkboardTeacher,
    },
  ],
  /* navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'Reports',
      url: '#',
      icon: IconReport,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: IconFileWord,
    },
  ], */
}

export function AppSidebar({ ...props }) {
  const { user } = useAuth()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin" className="relative">
                {/* <Image
                  src="/sportify-logo-sm.png"
                  alt="sportify logo"
                  sizes="256px"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                /> */}
                <div className="flex items-center">
                  <Image
                    src="/title-primary.svg"
                    alt="sportify title"
                    width={200}
                    height={32}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                  <Image
                    src="/logo.svg"
                    alt="sportify logo"
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || ''} />
      </SidebarFooter>
    </Sidebar>
  )
}
