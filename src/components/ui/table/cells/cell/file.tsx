import { Icons } from '@/components/ui/icons'
import React from 'react'

const File = ({ value, onClick }: any) => {
  return (
    <div className='flex items-center gap-2'>
      <Icons.Paperclip className='w-4 h-4 text-[#2D5D9F]' />
      <div onClick={onClick} className='max-w-[250px]'>
        <p className='plabs-caption-regular-14 text-greyscale-8 truncate hover:underline cursor-pointer'>{value}.pdf</p>
      </div>
    </div>
  )
}

export default File
