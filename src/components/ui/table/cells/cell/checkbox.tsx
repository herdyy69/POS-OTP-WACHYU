import { cn } from '@/lib/utils'
import { HTMLProps, useEffect, useRef } from 'react'

function Checkbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <label className='relative flex items-center rounded cursor-pointer' htmlFor='check'>
        <input
          ref={ref}
          type='checkbox'
          className={cn(
            'peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-greyscale-5 transition-all bg-white checked:border-blue-base checked:bg-blue-base ',
            className,
          )}
          id='check'
          {...rest}
        />
        <span className='absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-3.5 w-3.5'
            viewBox='0 0 20 20'
            fill='currentColor'
            stroke='currentColor'
            strokeWidth='1'
          >
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            ></path>
          </svg>
        </span>
      </label>
    </div>
  )
}

export default Checkbox
