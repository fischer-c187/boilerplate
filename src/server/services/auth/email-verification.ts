import { mailer } from '@/server/adaptaters/mail/mailer'
import { env } from '@/server/config/env'

type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export const EMAIL_VERIFICATION_EXPIRES_IN_SECONDS = 60 * 60 * 24

const buildVerificationEmail = (name: string | null, url: string) => {
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const text = `${greeting}\n\nVerify your email address by clicking this link:\n${url}\n\nIf you didn't create an account, you can ignore this email.`
  const html = `
    <p>${greeting}</p>
    <p>Verify your email address by clicking the link below:</p>
    <p><a href="${url}">Verify email</a></p>
    <p>If you didn't create an account, you can ignore this email.</p>
  `

  return { text, html }
}

export const sendEmailVerification = async (
  { user, url, token: _token }: { user: User; url: string; token: string },
  _request?: Request
) => {
  if (!user.email || user.emailVerified) {
    return
  }

  const { text, html } = buildVerificationEmail(user.name ?? null, url)

  await mailer.sendEmail({
    from: env.SMTP_FROM,
    to: user.email,
    subject: 'Verify your email',
    text,
    html,
  })
}
