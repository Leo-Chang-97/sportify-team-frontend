import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getAuthHeader() {
  const storageKey = 'sportify-auth'
  let token = ''
  try {
    token = localStorage.getItem(storageKey) || ''
  } catch (e) {
    token = ''
  }
  return token ? { Authorization: `Bearer ${token}` } : {}
}
