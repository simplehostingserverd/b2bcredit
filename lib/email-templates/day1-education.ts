export function getDay1EducationTemplate(
  name: string,
  businessType: string,
  uploadUrl: string
) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your First Step: Why Business Credit Matters</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #667eea; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Your First Step: Why Business Credit Matters for ${businessType}s</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px;">Hi ${name},</p>

    <p>Yesterday you joined us to build your business credit foundation. Today, let's show you exactly why this matters for your ${businessType}.</p>

    <div style="background: white; padding: 20px; margin: 25px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="color: #667eea; margin-top: 0;">📊 Real Success Story: ${businessType} Case Study</h3>
      <p><strong>The Challenge:</strong> A ${businessType} similar to yours was paying 18% interest on business loans and constantly getting denied for credit.</p>
      <p><strong>The Solution:</strong> In 6 months of building business credit using our platform, they:</p>
      <ul>
        <li>✅ Boosted their business credit score from 580 to 720</li>
        <li>✅ Reduced interest rates from 18% to 6.5%</li>
        <li>✅ Secured $150K in funding for expansion</li>
        <li>✅ Saved over $12,000 annually in interest payments</li>
      </ul>
    </div>

    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; margin: 25px 0; border-radius: 8px; color: white;">
      <h3 style="margin-top: 0;">🎯 Your Next Step (Takes 5 Minutes)</h3>
      <p style="margin-bottom: 15px;">Upload your EIN documentation so we can start building your credit profile.</p>
      <div style="text-align: center;">
        <a href="${uploadUrl}" style="background: white; color: #667eea; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Upload EIN Documents →</a>
      </div>
    </div>

    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 25px 0;">
      <p style="margin: 0;"><strong>📈 Progress Update:</strong> You're 20% toward your complete profile!</p>
    </div>

    <p style="margin-top: 25px;">Questions? Just hit reply - I personally read every response.</p>

    <p style="margin-top: 25px;">Cheers,<br>
    <strong>The Business Credit Team</strong></p>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Business Credit Builder. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}
