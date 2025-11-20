import nodemailer from 'nodemailer'
import type { Mailer } from '../types'

export function localTransport(): Mailer {
  const client = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
  })

  return {
    sendEmail: async ({ to, subject, html }) => {
      await client.sendMail({ from: 'dev@local.test', to, subject, html })
    },
  }
}
