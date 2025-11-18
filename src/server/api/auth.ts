import { Hono } from 'hono'
import { auth } from '../auth/auth'

const router = new Hono({
  strict: false,
})

router.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

export default router
