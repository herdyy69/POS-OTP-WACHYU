import React from 'react'
import { cn } from '@/lib/utils'

const AlertContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('lg:w-[550px] 2xl:w-[770px] p-4 rounded-lg flex justify-between items-center gap-2', className)}
      {...props}
    />
  ),
)
AlertContainer.displayName = 'AlertContainer'

const AlertTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={cn('plabs-title-medium-16', className)} {...props} />
  ),
)
AlertTitle.displayName = 'AlertTitle'

const AlertBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={cn('plabs-caption-regular-14', className)} {...props} />
  ),
)
AlertBody.displayName = 'AlertBody'

const AlertButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = '', ...props }, ref) => (
    <button ref={ref} className={cn('btn whitespace-nowrap', className)} {...props} />
  ),
)
AlertButton.displayName = 'AlertButton'

export { AlertContainer, AlertTitle, AlertBody, AlertButton }
