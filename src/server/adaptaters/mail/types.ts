export type SendEmailOptions = {
  to: string
  subject: string
  html: string
}

export type Provider = 'resend'

export interface Mailer {
  sendEmail(options: SendEmailOptions): Promise<void>
}
