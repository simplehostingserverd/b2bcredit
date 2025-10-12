export function getDay2NudgeTemplate(
  name: string,
  businessType: string,
  actionUrl: string,
  actionNeeded: 'connect_bank' | 'add_tradelines' | 'set_goals'
) {
  const actions = {
    connect_bank: {
      title: 'Connect Your Bank Account',
      description: 'Securely link your business bank account to track cash flow and improve your credit profile.',
      cta: 'Connect Bank Account',
    },
    add_tradelines: {
      title: 'Add Your Trade Lines',
      description: 'List your vendor relationships to build payment history and strengthen your credit.',
      cta: 'Add Trade Lines',
    },
    set_goals: {
      title: 'Set Your Credit Goals',
      description: 'Tell us what you want to achieve so we can create your personalized roadmap.',
      cta: 'Set My Goals',
    },
  }

  const action = actions[actionNeeded]

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailored Tips for ${businessType} Credit Builders</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #667eea; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Tailored Tips for ${businessType} Credit Builders</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px;">Hi ${name},</p>

    <p>Great progress so far! You're building momentum toward stronger business credit.</p>

    <div style="background: white; padding: 20px; margin: 25px 0; border-radius: 8px; border: 2px solid #667eea;">
      <h3 style="color: #667eea; margin-top: 0;">⏰ Quick Action Needed: ${action.title}</h3>
      <p>${action.description}</p>

      <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="margin: 0;"><strong>Why this matters:</strong> ${businessType}s that complete this step see 35% faster approval rates for funding.</p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${actionUrl}" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">${action.cta} →</a>
      </div>
    </div>

    <div style="background: white; padding: 20px; margin: 25px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin-top: 0;">✅ Your Onboarding Checklist</h3>
      <ul style="list-style: none; padding-left: 0;">
        <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">✅ Account created</li>
        <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">✅ Business type selected</li>
        <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #667eea; font-weight: bold;">⏳ ${action.title} (Current Step)</li>
        <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #9ca3af;">⭕ Get your custom roadmap</li>
        <li style="padding: 8px 0; color: #9ca3af;">⭕ Schedule consultation call</li>
      </ul>
    </div>

    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 25px 0;">
      <p style="margin: 0;"><strong>📊 Progress:</strong> You're 40% complete! Keep going!</p>
    </div>

    <p style="margin-top: 25px;">Questions about the process? Reply to this email anytime.</p>

    <p style="margin-top: 25px;">Best,<br>
    <strong>The Business Credit Team</strong></p>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Business Credit Builder. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}
