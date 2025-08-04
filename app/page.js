'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="px-4 md:px-6 py-10">
        <div className="flex flex-col container mx-auto max-w-screen-xl min-h-screen gap-6"></div>
      </main>
      <Footer />
    </>
  )
}
