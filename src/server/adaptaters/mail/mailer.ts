import { env } from '@/server/config/env'
import { localTransport } from './transports/local'
import type { Mailer, Provider } from './types'

function createMailer(): Mailer {
  if (env.NODE_ENV === 'development') {
    return localTransport()
  }

  const provider = env.MAIL_PROVIDER as Provider

  if (!provider) {
    throw new Error('MAIL_PROVIDER is not set')
  }

  switch (provider as Provider) {
    case 'resend':
      return localTransport()
    default:
      throw new Error(`Unsupported provider: ${provider as string}`)
  }
}

// singleton instance of the mailer
export const mailer = createMailer()
