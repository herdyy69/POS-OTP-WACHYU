import AuthLayout from '@/components/ui/layout/auth'
import { Suspense } from 'react'

export default function AuthRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout src='/assets/images/general/bg-auth.jpg'>{children}</AuthLayout>
    </Suspense>
  )
}
