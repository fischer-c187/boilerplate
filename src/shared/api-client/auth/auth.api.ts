import { clientEnv } from '@/front/config/env.client'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_BASE_URL,
  credentials: 'include',
})
