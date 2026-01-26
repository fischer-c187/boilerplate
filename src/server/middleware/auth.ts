import type { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import { auth } from '../adaptaters/auth/auth'

export const requireAuth = createMiddleware(async (c, next) => {
  const userSession = await auth.api.getSession(c.req.raw)
  if (!userSession?.user) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, 401)
  }
  c.set('user', userSession.user)
  await next()
})

export const getAuthenticatedUser = (c: Context) => {
  const user = c.get('user')
  if (!user) {
    throw new Error('User not found in context. Did you forget to use requireAuth middleware?')
  }
  return user
}
