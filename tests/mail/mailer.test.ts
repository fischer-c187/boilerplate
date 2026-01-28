import { beforeEach, describe, expect, it, vi } from 'vitest'

const smtpTransport = vi.fn(() => ({
  sendEmail: vi.fn(),
}))

const resendTransport = vi.fn(() => ({
  sendEmail: vi.fn(),
}))

const loadMailer = async (envOverrides: Record<string, unknown>) => {
  vi.resetModules()

  vi.doMock('@/server/config/env', () => ({
    env: {
      NODE_ENV: 'development',
      MAIL_PROVIDER: undefined,
      ...envOverrides,
    },
  }))

  vi.doMock('@/server/adaptaters/mail/transports/smtp', () => ({
    smtpTransport,
  }))

  vi.doMock('@/server/adaptaters/mail/transports/resend', () => ({
    resendTransport,
  }))

  return import('@/server/adaptaters/mail/mailer')
}

describe('mailer', () => {
  beforeEach(() => {
    smtpTransport.mockClear()
    resendTransport.mockClear()
  })

  it('defaults to smtp in development when provider is missing', async () => {
    const { mailer } = await loadMailer({ NODE_ENV: 'development' })

    expect(mailer).toBeDefined()
    expect(smtpTransport).toHaveBeenCalledTimes(1)
    expect(resendTransport).not.toHaveBeenCalled()
  })

  it('throws in production when provider is missing', async () => {
    await expect(loadMailer({ NODE_ENV: 'production' })).rejects.toThrow(
      'MAIL_PROVIDER must be set in production'
    )
  })

  it('uses smtp provider when configured', async () => {
    const { mailer } = await loadMailer({ NODE_ENV: 'production', MAIL_PROVIDER: 'smtp' })

    expect(mailer).toBeDefined()
    expect(smtpTransport).toHaveBeenCalledTimes(1)
    expect(resendTransport).not.toHaveBeenCalled()
  })

  it('uses resend provider when configured', async () => {
    const { mailer } = await loadMailer({ NODE_ENV: 'production', MAIL_PROVIDER: 'resend' })

    expect(mailer).toBeDefined()
    expect(resendTransport).toHaveBeenCalledTimes(1)
    expect(smtpTransport).not.toHaveBeenCalled()
  })
})
