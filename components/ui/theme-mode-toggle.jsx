'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'
  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button variant="secondary" asChild>
      <Toggle
        aria-label={isDark ? '切換為亮色模式' : '切換為暗色模式'}
        title={isDark ? '切換為亮色模式' : '切換為暗色模式'}
        onClick={handleToggle}
        className="relative inline-flex items-center justify-center w-9 h-9 p-0"
      >
        <Sun
          className={`h-[1.1rem] w-[1.1rem] transition-transform ${
            isDark
              ? 'scale-0 -rotate-90 opacity-0'
              : 'scale-100 rotate-0 opacity-100'
          }`}
        />
        <Moon
          className={`absolute h-[1.1rem] w-[1.1rem] transition-transform ${
            isDark
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 rotate-90 opacity-0'
          }`}
        />
        <span className="sr-only">Toggle theme</span>
      </Toggle>
    </Button>
  )
}
