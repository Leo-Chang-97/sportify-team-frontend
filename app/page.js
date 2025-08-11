'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import { RetroGrid } from '@/components/retro-grid'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background">
        <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
            Vortex Effect
          </h2>
          <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
            Experience the mesmerizing particle vortex created with simplex
            noise for shadcn.io
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
              Get Started
            </button>
            <button className="px-4 py-2 text-white">Learn More</button>
          </div>
        </span>
        <RetroGrid />
      </div>
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6"></div>
      </main>
      <Footer />
    </>
  )
}
