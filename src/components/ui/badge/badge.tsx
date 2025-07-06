import * as React from 'react'

import { cn } from '@/lib/utils'

const green = ['success', 'active', 'available', 'open', 'completed', 'verified', 'published']
const red = ['danger', 'inactive', 'unavailable', 'closed', 'pending', 'unverified', 'unpublished']
const blue = ['info', 'processing', 'on-going', 'on-going', 'on-going', 'on-going', 'on-going']
const greyscale = ['cancelled', 'rejected', 'expired', 'deleted', 'archived']

const getBadgeColor = (status?: string) => {
  if (!status) return 'badge'
  if (green.includes(status.toLowerCase())) return 'badge badge-green'
  if (red.includes(status.toLowerCase())) return 'badge badge-red'
  if (blue.includes(status.toLowerCase())) return 'badge badge-blue'
  if (greyscale.includes(status.toLowerCase())) return 'badge badge-greyscale'
  return 'badge'
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: string
}

function Badge({ className, status, ...props }: BadgeProps) {
  return <div className={cn(getBadgeColor(status), [className])} {...props} />
}

export { Badge, getBadgeColor }
