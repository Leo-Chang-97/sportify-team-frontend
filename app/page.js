'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AppPage(props) {
  return (
    <>
      <div>App Page</div>
      <Link href="/admin">
        <Button variant="outline">admin</Button>
      </Link>
    </>
  )
}
