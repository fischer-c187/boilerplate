import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_BETTER_AUTH_URL: z.string().url(),
  VITE_APP_NAME: z.string().optional().default('App'),
  PROD: z.boolean().optional().default(false),
})

const parsed = clientEnvSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('❌ Invalid CLIENT environment variables:')
  console.error(z.prettifyError(parsed.error))
  throw new Error('Invalid client environment')
}

export const clientEnv = parsed.data
