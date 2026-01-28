import { describe, expect, it, vi } from 'vitest'

vi.mock('@/server/config/env', () => ({
  env: {
    SMTP_HOST: 'localhost',
    SMTP_PORT: 1025,
  },
}))

const sendMail = vi.fn()

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail,
    })),
  },
}))

import { smtpTransport } from '@/server/adaptaters/mail/transports/smtp'

describe('smtpTransport', () => {
  it('throws when neither html nor text is provided', async () => {
    const mailer = smtpTransport()

    await expect(
      mailer.sendEmail({
        from: 'dev@local.test',
        to: 'user@example.com',
        subject: 'Test',
      })
    ).rejects.toThrow('Email must have at least html or text content')
  })

  it('sends mail with html and attachments', async () => {
    const mailer = smtpTransport()

    await mailer.sendEmail({
      from: 'dev@local.test',
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
      attachments: [
        {
          filename: 'test.txt',
          content: 'hello',
          contentType: 'text/plain',
        },
      ],
    })

    expect(sendMail).toHaveBeenCalledWith({
      from: 'dev@local.test',
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
      text: undefined,
      attachments: [
        {
          filename: 'test.txt',
          content: 'hello',
          contentType: 'text/plain',
        },
      ],
    })
  })
})
