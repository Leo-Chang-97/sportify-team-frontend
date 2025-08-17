'use client'

import React from 'react'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import BreadcrumbAuto from '@/components/breadcrumb-auto'
import HeroBannerMember from '@/components/hero-banner-member'
import ScrollAreaMember from '@/components/scroll-area-member'
import { TeamCard } from '@/components/card/team-card'

export default function TeamDataPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbAuto />
      <HeroBannerMember
        backgroundImage="/banner/member-banner.jpg"
        title="會員中心"
        overlayOpacity="bg-primary/50"
      ></HeroBannerMember>
      <ScrollAreaMember />
      <section className="py-10">
        <div className="container flex flex-col gap-6 mx-auto max-w-screen-xl px-4">
          <TeamCard></TeamCard>
          <TeamCard></TeamCard>
          <TeamCard></TeamCard>
        </div>
      </section>
      <Footer />
    </>
  )
}
