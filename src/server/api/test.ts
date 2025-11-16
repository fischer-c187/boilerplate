import { Hono } from 'hono'

const router = new Hono()

router.get('/test', (c) => {
  return c.json({ message: 'Hello, world!' })
})

export default router
