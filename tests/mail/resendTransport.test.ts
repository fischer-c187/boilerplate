import { beforeEach, describe, expect, it, vi } from 'vitest'

const env = vi.hoisted(() => ({
  RESEND_API_KEY: 're_test',
}))

vi.mock('@/server/config/env', () => ({
  env,
}))

const send = vi.hoisted(() => vi.fn())

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send,
    },
  })),
}))

import { resendTransport } from '@/server/adaptaters/mail/transports/resend'

describe('resendTransport', () => {
  beforeEach(() => {
    send.mockReset()
    env.RESEND_API_KEY = 're_test'
  })

  it('throws when api key is missing', () => {
    env.RESEND_API_KEY = undefined as unknown as string

    expect(() => resendTransport()).toThrow('RESEND_API_KEY is required')
  })

  it('sends email with html payload', async () => {
    send.mockResolvedValue({ error: null })

    const mailer = resendTransport()

    await mailer.sendEmail({
      from: 'dev@local.test',
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
      text: 'Hi',
    })

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'dev@local.test',
        to: 'user@example.com',
        subject: 'Hello',
        html: '<p>Hi</p>',
        text: 'Hi',
      })
    )
  })

  it('sends email with text only payload', async () => {
    send.mockResolvedValue({ error: null })

    const mailer = resendTransport()

    await mailer.sendEmail({
      from: 'dev@local.test',
      to: 'user@example.com',
      subject: 'Hello',
      text: 'Plain text',
    })

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'dev@local.test',
        to: 'user@example.com',
        subject: 'Hello',
        text: 'Plain text',
      })
    )
  })

  it('throws when resend returns error', async () => {
    send.mockResolvedValue({ error: { message: 'boom' } })

    const mailer = resendTransport()

    await expect(
      mailer.sendEmail({
        from: 'dev@local.test',
        to: 'user@example.com',
        subject: 'Hello',
        text: 'Plain text',
      })
    ).rejects.toThrow('Resend error: boom')
  })
})
