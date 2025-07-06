import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

// Disable cache for API routes
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const { POST, GET } = toNextJsHandler(auth)
