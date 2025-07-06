import type { Config } from 'drizzle-kit'

export default {
  schema: './_server/model/**/*.ts',
  out: './_server/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config
