import { drizzle } from 'drizzle-orm/postgres-js'

import postgres from 'postgres'

import dotenv from 'dotenv'
import { checkEnvVariables } from './lib/envChecker'
import * as auth from './model/auth-schema'
import * as peoples from './model/people'
import * as sales from './model/sales-schema'

dotenv.config()
checkEnvVariables()

export const client = postgres(process.env.POSTGRES_URL as string)
export const db = drizzle(client, {
  schema: {
    ...auth,
    ...peoples,
    ...sales,
  },
})
