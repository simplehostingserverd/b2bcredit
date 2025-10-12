export function getDay4RoadmapTemplate(
  name: string,
  businessType: string,
  roadmapUrl: string,
  consultUrl: string
) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Custom Credit Roadmap is Ready!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 26px;">🎉 Your Custom Credit Roadmap is Ready!</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px;">Hi ${name},</p>

    <p>Exciting news! Based on your ${businessType} profile, we've created a personalized 90-day roadmap to help you achieve a 680+ credit score.</p>

    <div style="background: white; padding: 25px; margin: 25px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h3 style="color: #667eea; margin-top: 0;">📋 Your 3-Step Roadmap Preview</h3>
      <div style="border-left: 4px solid #10b981; padding-left: 15px; margin: 15px 0;">
        <h4 style="margin: 5px 0; color: #10b981;">Step 1: Foundation (Days 1-30)</h4>
        <p style="margin: 5px 0; color: #666;">Establish business credit files with major bureaus and set up vendor trade lines.</p>
      </div>
      <div style="border-left: 4px solid #3b82f6; padding-left: 15px; margin: 15px 0;">
        <h4 style="margin: 5px 0; color: #3b82f6;">Step 2: Growth (Days 31-60)</h4>
        <p style="margin: 5px 0; color: #666;">Build positive payment history and increase credit utilization strategically.</p>
      </div>
      <div style="border-left: 4px solid #8b5cf6; padding-left: 15px; margin: 15px 0;">
        <h4 style="margin: 5px 0; color: #8b5cf6;">Step 3: Optimization (Days 61-90)</h4>
        <p style="margin: 5px 0; color: #666;">Leverage your improved score for better financing terms and higher limits.</p>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="${roadmapUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">View Full Roadmap →</a>
      </div>
    </div>

    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="margin-top: 0;">💡 Want Personalized Guidance?</h3>
      <p>Schedule a free 1:1 consultation with our credit specialists. We'll review your roadmap and answer any questions.</p>
      <div style="text-align: center; margin-top: 15px;">
        <a href="${consultUrl}" style="background: #f59e0b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Schedule Free Consultation →</a>
      </div>
    </div>

    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 25px 0;">
      <p style="margin: 0;"><strong>🎯 Progress:</strong> You're 60% through onboarding! Almost there!</p>
    </div>

    <p style="margin-top: 25px;">We're excited to see your business credit transform over the next 90 days!</p>

    <p style="margin-top: 25px;">To your success,<br>
    <strong>The Business Credit Team</strong></p>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Business Credit Builder. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}
