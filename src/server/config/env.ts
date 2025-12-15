import 'dotenv/config'
import { z } from 'zod'
// Valide UNIQUEMENT les variables serveur
const serverEnvSchema = z.object({
  VITE_BASE_URL: z.string(),
  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NODE_SERVER_PORT: z.coerce.number().default(3000),
  NODE_SERVER_HOST: z.string().default('localhost'),
  CORS_ORIGIN: z.string().default('*'),
  API_URL: z.string().url().optional(),

  // Mail
  MAIL_PROVIDER: z.enum(['resend']).optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_API_VERSION: z.string(),
})

const parsed = serverEnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid SERVER environment variables:')
  console.error(z.prettifyError(parsed.error))
  process.exit(1)
}

export const env = parsed.data
