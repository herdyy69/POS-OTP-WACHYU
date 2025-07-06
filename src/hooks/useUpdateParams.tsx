'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export const useUpdateParams = (): ((value: { [key: string]: any | undefined }) => void) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isRendered, setIsRendered] = useState(false)

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const updateParams = useCallback(
    (value: { [key: string]: any | undefined }) => {
      if (!isRendered) return

      // Create a new URLSearchParams instance with current params
      const params = new URLSearchParams(searchParams.toString())

      const isEmpty = Object.keys(value).length === 0

      if (isEmpty) {
        // Clear all params if the value object is empty
        params.forEach((_, key) => {
          params.delete(key)
        })
      } else {
        // Update existing params
        Object.entries(value).forEach(([key, val]) => {
          if (val === undefined || val === null || val === '') {
            // Remove the parameter if value is empty
            params.delete(key)
          } else {
            const isArray = Array.isArray(val)

            // Clear existing values for the key
            params.delete(key)

            if (isArray) {
              // Append each item in the array
              val.forEach((item: any) => {
                if (item !== '') {
                  params.append(key, item.toString())
                }
              })
            } else {
              // Set single value
              params.set(key, val.toString())
            }
          }
        })
      }

      // Create the new URL with the search params
      const newPathname = `${pathname}${params.toString() ? '?' + params.toString() : ''}`

      // Push the new URL
      router.push(newPathname)
    },
    [router, pathname, searchParams, isRendered],
  )

  useEffect(() => {
    if (isRendered) return
    setIsRendered(true)
  }, [isRendered])

  return updateParams
}
