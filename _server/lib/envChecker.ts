const requiredEnvVars = [
  'POSTGRES_URL',
  'NEXT_PUBLIC_BASE_URL',
] as const

type RequiredEnvVar = (typeof requiredEnvVars)[number]

export function checkEnvVariables() {
  const missingVars: RequiredEnvVar[] = []

  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      missingVars.push(key)
    }
  })

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}
