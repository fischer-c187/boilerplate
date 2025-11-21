import { Hono } from 'hono'
import { mailer } from '../mail/mailer'

const router = new Hono()

router.get('/mail/test', async (c) => {
  try {
    await mailer.sendEmail({ to: 'test@test.com', subject: 'Test', html: '<p>Hello, world!</p>' })
    return c.json({ message: 'Email sent' })
  } catch (error) {
    return c.json(
      {
        message: 'Error sending email',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

export default router
