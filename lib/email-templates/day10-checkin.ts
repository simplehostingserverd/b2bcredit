export function getDay10CheckinTemplate(
  name: string,
  supportUrl: string,
  bookDemoUrl: string,
  completionPercentage: number
) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How's Your Progress?</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #667eea; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 26px;">How's Your Credit Journey Going?</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px;">Hi ${name},</p>

    <p>It's been 10 days since you joined us! I wanted to personally check in and see how things are going.</p>

    <div style="background: white; padding: 25px; margin: 25px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h3 style="color: #667eea; margin-top: 0;">📊 Your Current Progress</h3>
      <div style="background: #e5e7eb; height: 30px; border-radius: 15px; overflow: hidden; margin: 15px 0;">
        <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; width: ${completionPercentage}%; transition: width 0.3s ease;"></div>
      </div>
      <p style="text-align: center; font-weight: bold; color: #667eea; font-size: 18px;">${completionPercentage}% Complete</p>
    </div>

    ${completionPercentage < 50 ? `
    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="margin-top: 0;">❓ Need Help Getting Started?</h3>
      <p>We're here to support you! Many of our most successful clients started with a quick support call.</p>
      <div style="text-align: center; margin-top: 15px;">
        <a href="${supportUrl}" style="background: #f59e0b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Get Free Support →</a>
      </div>
    </div>
    ` : `
    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="margin-top: 0;">🎉 Great Job!</h3>
      <p>You're making excellent progress! Let's take it to the next level with a personalized strategy session.</p>
      <div style="text-align: center; margin-top: 15px;">
        <a href="${bookDemoUrl}" style="background: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Book Strategy Session →</a>
      </div>
    </div>
    `}

    <div style="background: white; padding: 20px; margin: 25px 0; border-radius: 8px; border: 2px dashed #667eea;">
      <p style="margin: 0; text-align: center;"><strong>💬 Quick Question:</strong> What's the biggest challenge you're facing right now?</p>
      <p style="margin: 10px 0 0 0; text-align: center; font-size: 14px; color: #666;">Simply reply to this email - I read every response personally.</p>
    </div>

    <p style="margin-top: 25px;">Remember, building business credit is a marathon, not a sprint. Even small steps forward make a big difference!</p>

    <p style="margin-top: 25px;">Here to help,<br>
    <strong>The Business Credit Team</strong></p>

    <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
      <p style="font-size: 14px; color: #666; text-align: center;">
        <strong>P.S.</strong> If you're not finding value in these emails,
        <a href="#" style="color: #667eea;">let us know</a> how we can improve or
        <a href="#" style="color: #9ca3af;">unsubscribe</a>.
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Business Credit Builder. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}
