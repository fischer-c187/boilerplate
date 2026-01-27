import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_BASE_URL: z.string(),
  PROD: z.boolean().optional().default(false),
  // SEO
  VITE_SITE_NAME: z.string(),
  VITE_SITE_DESCRIPTION: z.string(),
  VITE_SITE_URL: z.string().url(),
  VITE_OG_IMAGE: z.string().optional().default('/og-default.png'),
  VITE_TWITTER_HANDLE: z.string().optional(),
  VITE_SEO_ENABLED: z
    .string()
    .optional()
    .default('true')
    .transform((v) => v === 'true'),
})

// Manually construct env object so Vite can replace values at build time
const envObject = {
  VITE_BASE_URL: import.meta.env.VITE_BASE_URL as string,
  PROD: import.meta.env.PROD as boolean | undefined,
  // SEO
  VITE_SITE_NAME: import.meta.env.VITE_SITE_NAME as string,
  VITE_SITE_DESCRIPTION: import.meta.env.VITE_SITE_DESCRIPTION as string,
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL as string,
  VITE_OG_IMAGE: import.meta.env.VITE_OG_IMAGE as string | undefined,
  VITE_TWITTER_HANDLE: import.meta.env.VITE_TWITTER_HANDLE as string | undefined,
  VITE_SEO_ENABLED: import.meta.env.VITE_SEO_ENABLED as string | undefined,
}

const parsed = clientEnvSchema.safeParse(envObject)

if (!parsed.success) {
  console.error('❌ Invalid CLIENT environment variables:')
  console.error(z.prettifyError(parsed.error))
  throw new Error('Invalid client environment')
}

export const clientEnv = parsed.data
