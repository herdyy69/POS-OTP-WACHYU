import { Icons } from '@/components/ui/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover/popover'
import { Download, EllipsisVertical, SquarePen, View } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Action = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger className='cursor-pointer'>
        <EllipsisVertical className='text-greyscale-6-500 h-5 w-5' />
      </PopoverTrigger>
      <PopoverContent align='end' className='bg-greyscale-0 max-w-[150px] border-none p-2 shadow-md'>
        {children}
      </PopoverContent>
    </Popover>
  )
}

const ActionItem = ({
  href,
  onClick,
  className,
  text,
  iconType,
  disable,
}: {
  href?: string
  onClick?: () => void
  className?: string
  text: string
  iconType?: string | 'delete' | 'edit' | 'view' | 'download'
  disable?: boolean
}) => {
  const router = useRouter()
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'delete':
        return <Icons.Trash className='text-red-base size-5' />
      case 'edit':
        return <SquarePen className='text-greyscale-6 size-5' />
      case 'view':
        return <View className='text-greyscale-6 size-5' />
      case 'download':
        return <Download className='text-greyscale-6 size-5' />
      default:
        return null
    }
  }

  const getClassname = (iconType: string) => {
    switch (iconType) {
      case 'delete':
        return 'text-red-base'
      case 'edit':
        return 'text-greyscale-6'
      case 'view':
        return 'text-greyscale-6'
      case 'download':
        return 'text-greyscale-6'
      default:
        return ''
    }
  }

  if (href) {
    return (
      <Link
        href={disable ? '#' : href}
        className={`plabs-caption-regular-14 flex items-center gap-1 px-2 py-3 ${className} ${iconType ? getClassname(iconType) : ''} rounded-md hover:bg-gray-100 ${disable ? 'cursor-not-allowed' : ''}`}
      >
        {iconType && getIcon(iconType)}
        {text}
      </Link>
    )
  } else {
    return (
      <div
        onClick={disable ? undefined : onClick}
        className={`plabs-caption-regular-14 flex items-center gap-1 px-2 py-3 ${className} ${iconType ? getClassname(iconType) : ''} rounded-md hover:bg-gray-100 ${disable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {iconType && getIcon(iconType)}
        {text}
      </div>
    )
  }
}

Action.Item = ActionItem

export default Action
