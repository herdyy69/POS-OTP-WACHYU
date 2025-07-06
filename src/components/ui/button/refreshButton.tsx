'use client'

import { Button } from '@/components/ui/button/button'
import { Icons } from '@/components/ui/icons'
import { refreshData } from '@/lib/utils'
import { useState } from 'react'

interface RefreshButtonProps {
  className?: string
}

export const RefreshButton = ({ className }: RefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      refreshData()
    }, 500)
  }

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={className || 'btn-outline-greyscale text-xs sm:text-sm'}
    >
      <Icons.SwapIcon className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span className='ml-1 hidden sm:inline'>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
    </Button>
  )
}
