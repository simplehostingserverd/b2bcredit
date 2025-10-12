import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.')
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'test-key')

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    // In development or if no API key, log instead of sending
    if (!process.env.RESEND_API_KEY || process.env.NODE_ENV === 'development') {
      console.log('📧 Email (dev mode):', { to, subject })
      console.log('HTML Preview:', html.substring(0, 200) + '...')
      return { success: true, messageId: 'dev-mode-' + Date.now() }
    }

    const data = await resend.emails.send({
      from: from || process.env.EMAIL_FROM || 'onboarding@yourdomain.com',
      to,
      subject,
      html,
    })

    console.log('✅ Email sent:', data)
    return { success: true, messageId: data.id }
  } catch (error) {
    console.error('❌ Email error:', error)
    return { success: false, error }
  }
}
