import * as React from 'react'

import { cn } from '@/lib/utils'
import { Icons } from '../icons'
import { KeyRound, Triangle } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    return (
      <div className='relative flex w-full items-center justify-center'>
        {icon && <div className='absolute left-3 *:size-4'>{icon}</div>}
        <input
          type={type}
          className={cn(
            'form-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed',
            icon && 'pl-8',
            [ariaInvalid && 'error', className],
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
Input.displayName = 'Input'

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [capsLock, setCapsLock] = React.useState(false)

  const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState('CapsLock'))
  }

  return (
    <div className='relative flex w-full items-center justify-center'>
      <div className='absolute left-3'>
        <div className='relative'>
          <KeyRound className='h-4 w-4' />
          {capsLock && (
            <div className='absolute top-10 right-0 bottom-0 left-0'>
              <Triangle className='text-greyscale-8 absolute -top-2.5 h-4 w-4' />
              <div className='bg-greyscale-0 plabs-caption-regular-14 text-greyscale-8 relative z-0 w-max rounded-md border p-2 shadow-md'>
                Capslock aktif.
              </div>
            </div>
          )}
        </div>
      </div>
      <Input
        {...props}
        ref={ref}
        className={cn('pr-8 pl-8', className)}
        type={showPassword ? 'text' : 'password'}
        onKeyDown={handleCapsLock}
        onKeyUp={handleCapsLock}
      />
      <span className='text-greyscale-6 absolute top-3 right-3 cursor-auto select-none'>
        {showPassword ? (
          <Icons.EyeIcon onClick={() => setShowPassword(false)} className='h-4 w-4' />
        ) : (
          <Icons.EyeOffIcon onClick={() => setShowPassword(true)} className='h-4 w-4' />
        )}
      </span>
    </div>
  )
})

InputPassword.displayName = 'InputPassword'

const InputNumber = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, min = -Infinity, max = Infinity, ...props }, ref) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      // Allow digits, commas, periods, and a minus sign only if min is provided and is negative
      const numericValue = newValue.replace(min !== -Infinity ? /[^0-9.,-]/g : /[^0-9.,]/g, '')

      // Parse the numeric value and enforce min and max limits
      const numericValueAsNumber = parseFloat(numericValue.replace(/,/g, ''))

      if (!isNaN(numericValueAsNumber)) {
        if (numericValueAsNumber > +max) {
          e.target.value = max.toString()
        } else if (numericValueAsNumber < +min) {
          e.target.value = min.toString()
        } else {
          e.target.value = numericValue
        }
      } else {
        e.target.value = ''
      }

      if (props.onChange) props.onChange(e)
    }

    return (
      <Input
        {...props}
        ref={ref}
        onChange={onChange}
        className={className}
        type='number'
        onWheel={(e: any) => {
          e.target.blur()
          e.stopPropagation()
          setTimeout(() => {
            e.target.focus()
          }, 0)
        }}
      />
    )
  },
)

InputNumber.displayName = 'InputNumber'

export { Input, InputPassword, InputNumber }
