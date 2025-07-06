import '@/styles/globals.css'
import { QueryProvider } from '@/contexts/query'
import { Toaster } from 'sonner'
import { NavigationProvider } from '@/contexts/navigation'
import { IBM_Plex_Sans, Hanken_Grotesk, Poppins, Manrope } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
})

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'PLABS.ID | Next.js Fullstack',
  description: 'PLABS.ID | Next.js Fullstack',
  // Disable cache for all pages
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      className={`${ibmPlexSans.variable} ${hankenGrotesk.variable} ${poppins.variable} ${manrope.variable}`}
    >
      <head>
        <meta httpEquiv='Cache-Control' content='no-cache, no-store, must-revalidate' />
        <meta httpEquiv='Pragma' content='no-cache' />
        <meta httpEquiv='Expires' content='0' />
      </head>
      <body>
        <QueryProvider>
          <NavigationProvider>{children}</NavigationProvider>
        </QueryProvider>
        <Toaster position='top-right' className='lg:min-w-[370px] 2xl:min-w-[600px]' />
      </body>
    </html>
  )
}
