export function getWelcomeEmailTemplate(name: string, dashboardUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Your Business Credit Journey</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Your Credit Journey! 🎉</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-bottom: 20px;">Hi ${name},</p>

    <p>Congratulations on taking the first step toward building a strong business credit foundation! We're excited to help you unlock better funding opportunities and grow your business.</p>

    <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 25px 0;">
      <h3 style="margin-top: 0; color: #667eea;">Here's what happens next:</h3>
      <ol style="padding-left: 20px;">
        <li><strong>Complete Your Quick Setup</strong> - Just 2-3 quick questions (takes 2 minutes)</li>
        <li><strong>Connect Your EIN</strong> - We'll start building your profile</li>
        <li><strong>Get Your Custom Roadmap</strong> - Personalized steps to improve your credit</li>
      </ol>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${dashboardUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">Complete Quick Setup →</a>
    </div>

    <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 25px 0;">
      <p style="margin: 0;"><strong>💡 Quick Tip:</strong> Users who complete their profile in the first 24 hours see results 50% faster!</p>
    </div>

    <p style="margin-top: 25px;">Need help getting started? Just reply to this email - we're here to support you.</p>

    <p style="margin-top: 25px;">To your success,<br>
    <strong>The Business Credit Team</strong></p>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
    <p>You're receiving this because you signed up for Business Credit Builder.</p>
    <p>© ${new Date().getFullYear()} Business Credit Builder. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}
