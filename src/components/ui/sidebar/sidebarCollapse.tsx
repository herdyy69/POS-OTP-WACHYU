'use client'

import { cn } from '@/lib/utils'

import { RouteSubmenu } from '@/interfaces/route'
import { useNavigation } from '@/contexts/navigation'
import { useMenu } from '@/contexts/menu'

import SidebarItem from './sidebarItem'

const SidebarCollapse = ({
  id,
  icon,
  title,
  menu,
  submenus,
  onClick,
}: {
  id: number
  icon: React.ReactElement
  title: string
  menu?: string
  submenus: RouteSubmenu[]
  onClick: () => void
}) => {
  const { activeSubRoute, activeRoute } = useNavigation()
  const { activeCollapseRoute } = useMenu()

  return (
    <div className='flex flex-col gap-1'>
      <SidebarItem
        icon={icon}
        title={title}
        menu={menu}
        active={activeRoute?.id === id || activeCollapseRoute?.id === id}
        onClick={onClick}
      />
      <div
        className={cn(`flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out`, [
          activeCollapseRoute?.id === id ? 'max-h-screen' : 'max-h-0',
        ])}
      >
        {submenus.map((submenu: RouteSubmenu) => {
          return (
            <SidebarItem
              key={submenu.id}
              icon={submenu.icon}
              title={submenu.title}
              link={submenu.link}
              active={activeSubRoute?.id === submenu.id}
            />
          )
        })}
      </div>
    </div>
  )
}

export default SidebarCollapse
