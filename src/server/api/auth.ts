import { auth } from '@/server/services/auth/auth'
import { Hono } from 'hono'

const router = new Hono({
  strict: false,
}).on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

export default router
