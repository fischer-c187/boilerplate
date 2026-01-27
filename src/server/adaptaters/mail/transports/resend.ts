import { Resend } from 'resend'
import { env } from '@/server/config/env'
import type { Mailer, SendEmailOptions } from '../types'

export function resendTransport(): Mailer {
  const apiKey = env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is required for resend provider')
  }
  const client = new Resend(apiKey)

  return {
    sendEmail: async (options: SendEmailOptions) => {
      const { from, to, subject, html, text, attachments } = options

      if (!html && !text) {
        throw new Error('Email must have at least html or text content')
      }

      const resendAttachments = attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      }))

      // Resend API requires either html or text to be defined
      const payload = html
        ? { from, to, subject, html, text, attachments: resendAttachments }
        : { from, to, subject, text: text!, attachments: resendAttachments }

      const { error } = await client.emails.send(payload)

      if (error) {
        throw new Error(`Resend error: ${error.message}`)
      }
    },
  }
}
