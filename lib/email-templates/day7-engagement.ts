export function getDay7EngagementTemplate(
  name: string,
  webinarUrl: string,
  upgradeUrl: string,
  isHighEngagement: boolean
) {
  if (isHighEngagement) {
    // High engagement users get upgrade offer
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unlock Advanced Credit Building Tools</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 26px;">Ready to Accelerate Your Progress? 🚀</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px;">Hi ${name},</p>

    <p>You've been making great progress this week! We've noticed you're actively working on your credit profile, which is fantastic.</p>

    <div style="background: white; padding: 25px; margin: 25px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h3 style="color: #f59e0b; margin-top: 0;">🎯 Unlock Premium Features</h3>
      <p>Our Premium members achieve results 3x faster with:</p>
      <ul style="line-height: 2;">
        <li>✅ Real-time credit monitoring from all 3 bureaus</li>
        <li>✅ Automated dispute resolution</li>
        <li>✅ Priority lender matching</li>
        <li>✅ Monthly strategy calls with credit experts</li>
        <li>✅ Advanced analytics and forecasting</li>
      </ul>

      <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Limited Time:</strong> Get 20% off your first 3 months when you upgrade this week!</p>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="${upgradeUrl}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">Upgrade to Premium →</a>
      </div>
    </div>

    <p style="margin-top: 25px;">Have questions about Premium? Reply to this email and we'll help you decide if it's right for you.</p>

    <p style="margin-top: 25px;">Cheers,<br>
    <strong>The Business Credit Team</strong></p>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Business Credit Builder. All rights reserved.</p>
  </div>
</body>
</html>
    `.trim()
  } else {
    // Low engagement users get webinar invite
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join Our Live Credit Building Webinar</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #667eea; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 26px;">🎓 Free Webinar: Credit Building Essentials</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px;">Hi ${name},</p>

    <p>We noticed you haven't completed your profile yet - that's totally fine! Credit building can feel overwhelming at first.</p>

    <p>That's why we're hosting a <strong>free live webinar</strong> to walk you through the entire process step-by-step.</p>

    <div style="background: white; padding: 25px; margin: 25px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h3 style="color: #667eea; margin-top: 0;">📅 What You'll Learn:</h3>
      <ul style="line-height: 2;">
        <li>The 3 biggest credit building mistakes (and how to avoid them)</li>
        <li>How to establish business credit in 90 days or less</li>
        <li>Insider tips for getting approved for funding</li>
        <li>Live Q&A with credit experts</li>
      </ul>

      <div style="background: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Bonus:</strong> All attendees get our Credit Building Checklist (worth $99)</p>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="${webinarUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">Save My Spot →</a>
      </div>
    </div>

    <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 25px 0;">
      <p style="margin: 0;"><strong>⏰ Limited Seats:</strong> This webinar fills up fast. Register now to secure your spot!</p>
    </div>

    <p style="margin-top: 25px;">See you there!</p>

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
}
