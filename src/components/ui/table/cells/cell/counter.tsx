import { Icons } from '@/components/ui/icons'
import React, { useEffect, useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    setCount(count + 1)
  }

  const handleDecrement = () => {
    setCount(count - 1)
  }

  useEffect(() => {
    if (count <= 0) {
      setCount(0)
    }
  }, [count])

  return (
    <div className='flex justify-center items-center gap-4'>
      <button type='button' onClick={handleDecrement} className='btn p-0 flex-none'>
        <Icons.Minus className='text-blue-base w-4 h-4' />
      </button>
      <span className='text-center flex-none'>{count}</span>
      <button type='button' onClick={handleIncrement} className='btn p-0 flex-none'>
        <Icons.Plus className='text-blue-base w-4 h-4' />
      </button>
    </div>
  )
}

export default Counter
