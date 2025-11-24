import type { AppType } from '@/server/api'
import { hc } from 'hono/client'

export const client = hc<AppType>('/api')
