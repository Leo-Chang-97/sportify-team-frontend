// components/search-form.jsx
'use client'
import React from 'react'
import { Search, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function SearchForm({
  value,
  onChange,
  onSubmit,
  placeholder = '搜尋...',
}) {
  const inputRef = React.useRef(null)
  const handleClear = () => {
    if (onChange) {
      const event = { target: { value: '' } }
      onChange(event)
    }
    if (inputRef.current) inputRef.current.focus()
  }
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 mb-2">
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <div className="relative flex items-center">
        <span className="absolute left-2 flex items-center h-full">
          <Search className="mx-1 size-4 text-gray-400" />
          <span className="mx-1 h-4 w-px bg-gray-300" />
        </span>
        <input
          type="text"
          id="search"
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="pl-12 pr-7 border rounded-lg px-2 py-2 text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
            aria-label="清除搜尋"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <Button type="submit" size="sm" variant="outline" className="h-9">
        搜尋
      </Button>
    </form>
  )
}
