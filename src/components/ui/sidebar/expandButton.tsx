import { cn } from '@/lib/utils'

import { useMenu } from '@/contexts/menu'
import { PanelLeft } from 'lucide-react'

const ExpandButton = () => {
  const { handleCollapseSidebar } = useMenu()

  return (
    <div className='transition-all duration-200 ease-in-out'>
      <button
        onClick={handleCollapseSidebar}
        className='hover:bg-greyscale-1 relative hidden cursor-pointer rounded-lg p-1.5 transition-colors lg:flex'
      >
        <div className={cn('transition-all duration-150 ease-in-out')}>
          <PanelLeft className='text-greyscale-5 size-5' />
        </div>
      </button>
    </div>
  )
}

export default ExpandButton
