import AuthLayout from '@/components/ui/layout/auth'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { Suspense } from 'react'

export default function AuthRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthLayout src='/assets/images/general/bg-auth.jpg'>{children}</AuthLayout>
    </Suspense>
  )
}
