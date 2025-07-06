'use client'

import { useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import debounce from 'debounce'

import { cn } from '@/lib/utils'
import { Icons } from '../../icons'
import { useUpdateParams } from '@/hooks/useUpdateParams'
import { Input } from '../../form/input'

const TableSearch = ({ placeholder, name, className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const setParams = useUpdateParams()
  const searchName = name ? `search_${name}` : 'search'
  const value = searchParams.get(searchName)

  const handleSearch = debounce((e: any) => {
    setParams({ [searchName]: e.target.value, [name ? `page_${name}` : 'page']: '1' })
  }, 500)

  return (
    <div className={cn('relative w-full', className)}>
      <Input
        ref={ref}
        placeholder={placeholder ?? 'Search'}
        onChange={handleSearch}
        defaultValue={value ?? ''}
        {...rest}
        type='text'
        className='border-greyscale-4 text-greyscale-8 placeholder:text-greyscale-5 w-full rounded-xl py-2.5 text-sm sm:w-[300px] sm:rounded-2xl sm:py-3 sm:text-base lg:w-[444px]'
        icon={<Icons.Search className='text-greyscale-5 size-4 sm:size-5' />}
      />
    </div>
  )
}

export default TableSearch
