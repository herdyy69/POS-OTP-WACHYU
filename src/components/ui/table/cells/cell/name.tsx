import React from 'react'

const Name = ({ value, withDescription = true, withAvatar = true }: any) => {
  const name = value
    .split(' ')
    .map((name: string) => name.charAt(0))
    .join('')

  return (
    <div className='flex items-center gap-2.5'>
      {withAvatar && (
        <div className='w-8 h-8'>
          <div className='w-full h-full rounded-full bg-red text-greyscale-8 inline-flex items-center justify-center'>
            {name}
          </div>
        </div>
      )}
      <div className='flex flex-col gap-px'>
        <h2 className='plabs-title-medium-14 text-greyscale-8'>{value}</h2>
        {withDescription && <p className='plabs-caption-regular-12 text-greyscale-6'>{value}</p>}
      </div>
    </div>
  )
}

export default Name
