import { mailer } from '@/server/adaptaters/mail/mailer'
import { Hono } from 'hono'

const router = new Hono().get('/mail/test', async (c) => {
  try {
    await mailer.sendEmail({ to: 'test@test.com', subject: 'Test', html: '<p>Hello, world!</p>' })
    return c.json({ message: 'Email sent' }, 200)
  } catch (error) {
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      500
    )
  }
})

export default router
