'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/ui/shadcn-io/navbar'
import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Footer />
    </>
  )
}
