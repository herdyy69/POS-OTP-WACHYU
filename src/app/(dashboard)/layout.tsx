import Dashboard from '@/components/ui/layout/dashboard'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { Suspense } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard>{children}</Dashboard>
    </Suspense>
  )
}
