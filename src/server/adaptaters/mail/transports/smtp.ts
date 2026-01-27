import nodemailer from 'nodemailer'
import { env } from '@/server/config/env'
import type { Mailer, SendEmailOptions } from '../types'

export function smtpTransport(): Mailer {
  const client = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
  })

  return {
    sendEmail: async (options: SendEmailOptions) => {
      const { from, to, subject, html, text, attachments } = options

      if (!html && !text) {
        throw new Error('Email must have at least html or text content')
      }

      await client.sendMail({
        from,
        to,
        subject,
        html: html ?? undefined,
        text: text ?? undefined,
        attachments: attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
        })),
      })
    },
  }
}
