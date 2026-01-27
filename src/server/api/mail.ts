import { mailer } from '@/server/adaptaters/mail/mailer'
import { env } from '@/server/config/env'
import { Hono } from 'hono'

const router = new Hono().get('/mail/test', async (c) => {
  try {
    await mailer.sendEmail({
      from: env.SMTP_FROM,
      to: 'm.martins1305@gmail.com',
      subject: 'Test',
      html: '<p>salut</p>',
    })
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
