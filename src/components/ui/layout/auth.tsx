'use client'

import { authClient } from '@/lib/auth-client'
import { Copyright } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const AuthLayout = ({ children, src }: { children: React.ReactNode; src: string }) => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (session?.session.expiresAt && new Date(session?.session.expiresAt) > new Date()) {
      router.push('/')
    }
  }, [isPending, session])

  return (
    <main className='flex h-screen items-center justify-center'>
      <div
        style={{
          backgroundImage:
            'linear-gradient(180deg, #FCFAF9 54.05%, rgba(255, 255, 255, 0.88) 123.98%), url(/auth/bg_auth.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className='relative flex h-full w-full flex-col items-center justify-between p-6'
      >
        <div className='flex w-full flex-col items-start justify-start'>
          <Image
            src='/assets/images/general/logo.png'
            alt='logo'
            width={113}
            height={113}
            className='h-auto w-[113px] object-contain'
          />
        </div>
        {children}
        <div className='flex w-full items-center justify-between gap-2'>
          <div className='plabs-title-medium-12 text-greyscale-5 flex items-center gap-2'>
            <Copyright className='h-4 w-4' />
            <p>{`${new Date().getFullYear()} PLABS.ID | Next.js Fullstack  | all right reserved.`}</p>
          </div>
          <Link className='plabs-title-medium-12 text-greyscale-6 underline' href='/privacy-policy'>
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className='hidden h-full w-full flex-col items-center justify-center sm:flex'>
        <Image src={src} alt='logo' width={1920} height={1080} className='h-full w-full object-cover' />
      </div>
    </main>
  )
}

export default AuthLayout
