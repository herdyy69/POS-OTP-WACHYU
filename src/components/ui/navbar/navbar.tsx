import Image from 'next/image'
import { cn } from '@/lib/utils'

import { Bell, LogOut, Settings, Menu } from 'lucide-react'
import { Auth } from '../../../../_server/schemas/auth'
import { authClient } from '@/lib/auth-client'
import { useMenu } from '@/contexts/menu'

const Navbar = ({ data }: { data: Auth }) => {
  const { handleMobileMenu, isMobileMenuOpen } = useMenu()

  return (
    <header
      className={cn('bg-primary-background absolute top-0 z-30 flex h-[80px] w-full items-center justify-between')}
    >
      <div className='flex h-full w-full items-center justify-between p-4 sm:p-6'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => handleMobileMenu(!isMobileMenuOpen)}
            className='hover:bg-greyscale-1 flex size-10 items-center justify-center rounded-lg lg:hidden'
          >
            <Menu className='size-5' />
          </button>
          <div className='space-y-1'>
            <h2 className='plabs-title-medium-16 text-greyscale-9 sm:plabs-title-medium-20'>
              Selamat Datang {data?.name || 'User'}.
            </h2>
            <p className='plabs-body-regular-12 text-greyscale-6 sm:plabs-body-regular-14 hidden sm:block'>
              Mulai kelola dasbor Anda, cek transaksi & laporan yang masuk.
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2 sm:gap-3'>
          {/* <button className='bg-greyscale-0 flex size-8 items-center justify-center rounded-full sm:size-10'>
            <Bell className='text-greyscale-8 h-5 w-5 sm:h-6 sm:w-6' />
          </button>
          <button className='bg-greyscale-0 flex size-8 items-center justify-center rounded-full sm:size-10'>
            <Settings className='text-greyscale-8 h-5 w-5 sm:h-6 sm:w-6' />
          </button> */}
          <div className='bg-greyscale-0 flex h-8 items-center justify-center gap-2 rounded-full px-2 py-1 sm:h-10 sm:gap-2 sm:px-[5px] sm:py-[5px]'>
            <div className='ml-2 hidden items-center gap-1 sm:flex sm:gap-1.5'>
              <div className='hidden -space-y-1 sm:block'>
                <h4 className='plabs-title-medium-14 text-greyscale-8'>{data?.name || 'User'}</h4>
                <p className='plabs-caption-regular-12 text-greyscale-5'>
                  {data?.roles?.map((role) => role?.name).join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                await authClient.signOut()
              }}
              className='hover:bg-greyscale-3 cursor-pointer rounded-full p-1 sm:p-1.5'
            >
              <LogOut className='text-greyscale-5 h-3 w-3 sm:h-4 sm:w-4' />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
