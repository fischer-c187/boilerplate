export type EmailAttachment = {
  filename: string
  content: string | Buffer
  contentType?: string
}

export type SendEmailOptions = {
  from: string
  to: string
  subject: string
  html?: string
  text?: string
  attachments?: EmailAttachment[]
}

export type Provider = 'smtp' | 'resend'

export interface Mailer {
  sendEmail(options: SendEmailOptions): Promise<void>
}
