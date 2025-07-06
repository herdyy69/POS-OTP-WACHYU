import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to refresh data
export function refreshData() {
  // Clear browser cache
  if (typeof window !== 'undefined') {
    // Clear localStorage cache
    const keysToKeep = ['access_token', 'refresh_token', 'auth-store']
    const keysToRemove = Object.keys(localStorage).filter((key) => !keysToKeep.includes(key))
    keysToRemove.forEach((key) => localStorage.removeItem(key))

    // Force page reload
    window.location.reload()
  }
}

// Utility function to invalidate cache
export function invalidateCache() {
  if (typeof window !== 'undefined') {
    // Clear sessionStorage
    sessionStorage.clear()

    // Clear specific cache items
    const keysToRemove = ['query-cache', 'mutation-cache']
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })
  }
}
