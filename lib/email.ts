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
    return { success: true, messageId: data.data?.id }
  } catch (error) {
    console.error('❌ Email error:', error)
    return { success: false, error }
  }
}

export interface PasswordResetEmailOptions {
  email: string
  name: string
  resetUrl: string
}

export async function sendPasswordResetEmail({ email, name, resetUrl }: PasswordResetEmailOptions) {
  const subject = 'Reset Your Password'
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hi ${name},</h2>
    <p>We received a request to reset the password for your account. If you made this request, please click the button below to create a new password.</p>
    
    <p style="margin: 30px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </p>
    
    <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
    
    <p>This link will expire in 1 hour for security reasons.</p>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} B2B Credit. All rights reserved.</p>
      <p>This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
  `
  
  return sendEmail({
    to: email,
    subject,
    html,
    from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
  })
}
