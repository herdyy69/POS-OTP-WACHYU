import Link from 'next/link'
import { cn } from '@/lib/utils'

import { useMenu } from '@/contexts/menu'
import { Icons } from '../icons'

const SidebarItem = ({
  icon,
  title,
  link,
  menu,
  active,
  className = '',
  onClick,
}: {
  title: string
  icon?: React.ReactElement
  link?: string
  menu?: string
  active: boolean
  className?: string
  onClick?: () => void
}) => {
  const { isSidebarCollapse } = useMenu()

  const content = (
    <div className={cn('flex items-center gap-3', !icon && !isSidebarCollapse && 'pl-9')}>
      {(icon ?? !isSidebarCollapse) ? icon : <Icons.Dot />}
      <div className={cn('', [isSidebarCollapse && 'hidden'])}>{title}</div>
    </div>
  )

  const dropdownIcon = (
    <div className={cn('transition-all ease-in-out', [isSidebarCollapse && 'hidden', active && 'rotate-180'])}>
      <Icons.ChevronDown />
    </div>
  )

  if (link) {
    return (
      <>
        {menu && (
          <div className={cn('plabs-title-medium-14 text-greyscale-4 p-3', isSidebarCollapse && 'text-center')}>
            {isSidebarCollapse ? '-' : menu}
          </div>
        )}
        <Link
          href={link}
          className={cn(
            'text-greyscale-7 plabs-title-medium-14 hover:bg-primary-1 hover:text-primary-8 flex items-center rounded-xl p-3 text-start transition-colors',
            active && 'bg-primary-1 text-primary-8 hover:text-primary-8',
            isSidebarCollapse ? 'justify-center' : 'pr-1.5 pl-3',
            'min-h-[44px] lg:min-h-[40px]',
            className,
          )}
        >
          {content}
        </Link>
      </>
    )
  }

  return (
    <>
      {menu && (
        <div className={cn('plabs-title-medium-14 text-greyscale-7', isSidebarCollapse && 'text-center')}>
          {isSidebarCollapse ? '-' : menu}
        </div>
      )}
      <button
        onClick={onClick}
        className={cn(
          'text-greyscale-7 plabs-title-medium-14 hover:bg-primary-1 hover:text-primary-8 flex cursor-pointer items-center rounded-xl p-3 transition-colors',
          active && 'bg-primary-1 text-primary-8 hover:text-primary-8',
          !isSidebarCollapse && 'pr-1.5 pl-3',
          'min-h-[44px] w-full lg:min-h-[40px]',
          className,
        )}
      >
        <div
          className={cn('flex h-full w-full items-center gap-1.5 text-start', [
            !isSidebarCollapse ? 'justify-between' : 'justify-center',
          ])}
        >
          {content}
          {dropdownIcon}
        </div>
      </button>
    </>
  )
}

export default SidebarItem
