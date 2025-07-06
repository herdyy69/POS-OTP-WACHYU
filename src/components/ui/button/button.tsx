import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'
import { Icons } from '../icons'

export type IconType = 'trash'

export const getIcon = (icon: IconType, iconStyle?: string) => {
  switch (icon) {
    case 'trash':
      return <Icons.Trash className={cn('h-4 w-4', iconStyle)} />
    default:
      return null
  }
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  icon?: IconType | React.ReactNode
  iconStyle?: string
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, icon, iconStyle, iconPosition = 'left', children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn('flex items-center justify-center gap-2 rounded-lg', [className ?? 'btn-blue'])}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'left'
          ? typeof icon === 'string'
            ? getIcon(icon as IconType, iconStyle)
            : icon
          : null}
        {children}
        {icon && iconPosition === 'right'
          ? typeof icon === 'string'
            ? getIcon(icon as IconType, iconStyle)
            : icon
          : null}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button }
