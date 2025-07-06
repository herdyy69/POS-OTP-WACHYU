import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import { Route } from '@/interfaces/route'
import { useNavigation } from '@/contexts/navigation'
import { useMenu } from '@/contexts/menu'

import { Icons } from '../icons'
import SidebarCollapse from './sidebarCollapse'
import SidebarItem from './sidebarItem'
import ExpandButton from './expandButton'

const Sidebar = () => {
  const { activeRoute, routes } = useNavigation()
  const { isSidebarCollapse, isMobileMenuOpen, handleCollapseRoute, handleMobileMenu } = useMenu()

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className='fixed inset-0 z-20 bg-black/50 lg:hidden' onClick={() => handleMobileMenu(false)} />
      )}

      <div
        className={cn(
          'no-scrollbar bg-greyscale-0 fixed top-0 bottom-0 left-0 z-30 max-h-screen flex-none shadow-md transition-all duration-200 ease-in-out lg:relative',
          [isSidebarCollapse ? 'lg:w-[80px]' : 'lg:w-[250px]', isMobileMenuOpen ? 'w-[280px] sm:w-[320px]' : 'w-0'],
        )}
      >
        <div
          className={cn(
            'hidden items-center px-4 py-6 lg:flex',
            isSidebarCollapse ? 'justify-center' : 'justify-between gap-6',
          )}
        >
          {!isSidebarCollapse && (
            <Link href='/' className='w-full'>
              <Image
                src='/assets/images/general/logo.png'
                alt='logo'
                width={113}
                height={113}
                className={cn(
                  'h-[40px] w-max object-contain transition-all duration-200 ease-in-out sm:h-[50px]',
                  isSidebarCollapse ? 'w-0' : 'w-max',
                )}
              />
            </Link>
          )}
          <ExpandButton />
        </div>

        {/* Mobile header */}
        <div
          className={cn(
            'flex w-full items-center justify-between px-4 py-4 lg:hidden',
            isMobileMenuOpen ? 'flex' : 'hidden',
          )}
        >
          <Link href='/' className='w-full'>
            <Image
              src='/assets/images/general/logo.png'
              alt='logo'
              width={113}
              height={113}
              className='h-[40px] w-max object-contain'
            />
          </Link>
          <button
            onClick={() => handleMobileMenu(false)}
            className='hover:bg-greyscale-1 flex size-8 items-center justify-center rounded-lg'
          >
            <Icons.X className='size-5' />
          </button>
        </div>

        <div className='flex h-[calc(100%-88px)] w-full flex-1 flex-col gap-4 overflow-hidden lg:h-[calc(100%-128px)]'>
          <div className='no-scrollbar flex flex-1 flex-col gap-2 overflow-auto px-4 py-4 lg:py-0'>
            {routes?.map((route: Route) => {
              if (route.isCollapse) {
                return (
                  <SidebarCollapse
                    key={route.id}
                    id={route.id}
                    icon={route.icon}
                    title={route.title}
                    menu={route.menu}
                    submenus={route.submenus}
                    onClick={() => handleCollapseRoute(route)}
                  />
                )
              }

              return (
                <SidebarItem
                  key={route.id}
                  icon={route.icon}
                  title={route.title}
                  menu={route.menu}
                  link={route.link}
                  active={activeRoute?.id === route.id}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
