'use client'

import { NavigationProvider } from '@/contexts/navigation'
import { cn } from '@/lib/utils'

import { MenuProvider } from '@/contexts/menu'

import Sidebar from '../sidebar/sidebar'
import Navbar from '../navbar/navbar'
import { Icons } from '../icons'
import { ChevronRight, Menu } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { authClient } from '@/lib/auth-client'

const Dashboard = ({ children }: { children: any }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!session && !isPending) {
      router.push('/auth/login')
    }
  }, [isPending, session])

  const breadcrumb = pathname
    ?.split('/')
    ?.filter(Boolean)
    ?.map((segment) =>
      segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    )

  return (
    <NavigationProvider>
      <MenuProvider>
        <div className='relative flex min-h-screen w-full overflow-hidden'>
          <Sidebar />
          <div className='relative h-full w-full overflow-hidden'>
            <Navbar
              data={{
                guid: session?.user?.id || '',
                name: session?.user?.name || '',
                email: session?.user?.email || '',
                roles: [],
                access_token: '',
                refresh_token: '',
              }}
            />
            <main
              className={cn(
                'no-scrollbar bg-primary-background relative h-screen w-full space-y-4 overflow-auto px-4 pt-[104px] pb-4 sm:px-6 sm:pb-6',
              )}
            >
              <div className='space-y-4'>
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(180deg, rgba(36, 37, 39, 0) 22.98%, rgba(36, 37, 39, 0.66) 96.18%), url(/assets/images/general/garden-tea.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className='h-[120px] w-full rounded-xl sm:h-[144px] sm:rounded-2xl'
                />
                <div className='plabs-caption-regular-14 card flex items-center gap-[6px] overflow-x-auto'>
                  <div className='text-greyscale-5 flex items-center gap-[6px] whitespace-nowrap'>
                    <Icons.HomeIcon className='size-[16px]' />
                    <p>Dasbor</p>
                  </div>
                  {breadcrumb.map((item, index) => (
                    <div key={index} className='flex items-center gap-[6px] whitespace-nowrap'>
                      <ChevronRight className='text-greyscale-6 h-4 w-4' />
                      <p className='text-greyscale-6'>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              {children}
            </main>
          </div>
        </div>
      </MenuProvider>
    </NavigationProvider>
  )
}

export default Dashboard
