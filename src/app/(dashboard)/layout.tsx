import Dashboard from '@/components/ui/layout/dashboard'
import { Suspense } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard>{children}</Dashboard>
    </Suspense>
  )
}
