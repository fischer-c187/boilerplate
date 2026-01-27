import { env } from '@/server/config/env'
import { smtpTransport } from './transports/smtp'
import { resendTransport } from './transports/resend'
import type { Mailer, Provider } from './types'

function createMailer(): Mailer {
  const provider = env.MAIL_PROVIDER as Provider | undefined
  const isDev = env.NODE_ENV === 'development'
  // Dev: default to smtp if not set
  if (isDev && !provider) {
    return smtpTransport()
  }

  // Prod: require explicit provider
  if (!isDev && !provider) {
    throw new Error('MAIL_PROVIDER must be set in production')
  }

  switch (provider) {
    case 'smtp':
      return smtpTransport()
    case 'resend':
      return resendTransport()
    default:
      throw new Error(`Unsupported mail provider: ${String(provider)}`)
  }
}

export const mailer = createMailer()
