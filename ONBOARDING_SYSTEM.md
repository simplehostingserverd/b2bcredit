# Onboarding & Email Drip System

## Overview

This B2B Credit Building platform features a comprehensive onboarding funnel with automated email drip campaigns designed to maximize user activation and engagement.

## Features

### 1. Multi-Step Onboarding Flow

**Step 1: Basic Information (20% complete)**
- Business type selection
- Years in operation
- Current credit score range

**Step 2: EIN Upload (40% complete)**
- EIN number collection
- Document upload capability
- Security verification

**Step 3: Goals & Preferences (60% complete)**
- Credit goals selection
- Pain points identification
- Communication preferences
- Referral source tracking

### 2. Automated Email Drip Sequence

The system sends behavior-triggered emails over a 10-day period:

#### Day 0 (Immediate)
- **Welcome Email** sent upon registration
- Introduces the platform
- Sets expectations
- CTA: Complete Quick Setup

#### Day 1
- **Educational Email** with case study
- Business-type specific content
- CTA: Upload EIN documents
- Shows 20% progress

#### Day 2-3
- **Nudge Email** based on incomplete actions
- Onboarding checklist
- Personalized action items
- CTA: Connect bank or add trade lines

#### Day 4
- **Custom Roadmap Ready**
- 90-day credit building plan
- Three-step breakdown
- CTA: View roadmap & schedule consultation

#### Day 7
- **Engagement Email** (behavior-based)
  - High engagement (≥50% complete): Premium upgrade offer
  - Low engagement (<50% complete): Free webinar invitation

#### Day 10
- **Check-in Email**
- Progress review
- Personalized support or strategy session
- Feedback request

### 3. Progress Tracking

- Real-time completion percentage calculation
- Behavioral triggers for emails
- User segmentation (high/low engagement)
- Email open/click tracking

## Technical Implementation

### Database Schema

```prisma
model OnboardingProfile {
  completionPercentage  Int
  currentStep           String
  isCompleted           Boolean

  // Question responses
  businessType          String?
  yearsInOperation      String?
  currentCreditScore    String?
  einNumber             String?
  creditGoal            String?
  painPoints            String[]

  // Email timestamps
  welcomeEmailSentAt    DateTime?
  day1EmailSentAt       DateTime?
  day2EmailSentAt       DateTime?
  // ... etc
}

model EmailDrip {
  emailType   String
  subject     String
  sentAt      DateTime
  opened      Boolean
  clicked     Boolean
  status      String
}
```

### API Endpoints

**POST /api/onboarding/progress**
- Save onboarding progress
- Auto-calculate completion percentage
- Trigger relevant emails

**GET /api/onboarding/progress**
- Fetch user's onboarding status

**POST /api/onboarding/drip** (Cron endpoint)
- Process scheduled emails
- Requires Bearer token authentication
- Should be called daily via cron job

### Email Service

All email templates are in `/lib/email-templates/`:
- welcome.ts
- day1-education.ts
- day2-nudge.ts
- day4-roadmap.ts
- day7-engagement.ts
- day10-checkin.ts

### Environment Variables

Required environment variables:

```env
# Email (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=onboarding@yourdomain.com

# Cron Security
CRON_SECRET=your-secret-key

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Setting Up Email Drip Cron

### Option 1: Vercel Cron (Recommended for production)

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/onboarding/drip",
    "schedule": "0 10 * * *"
  }]
}
```

### Option 2: External Cron Service

Use services like:
- Cron-job.org
- EasyCron
- GitHub Actions

Schedule daily requests to:
```
POST https://yourdomain.com/api/onboarding/drip
Authorization: Bearer YOUR_CRON_SECRET
```

### Option 3: Manual Testing (Development)

Visit in browser (dev mode only):
```
GET http://localhost:3000/api/onboarding/drip
```

## Design Features

### Professional FinTech Aesthetic

- **Dark theme** with slate/purple/blue gradients
- **Animated background blurs** with pulsing effects
- **Glowing borders** on interactive elements
- **Smooth transitions** and hover effects
- **Glassmorphism** with backdrop blur
- **Progress indicators** with gradient fills
- **Responsive design** optimized for all devices

### Animation Details

- Pulsing background orbs
- Hover scale transforms (1.05x)
- Smooth color transitions
- Shadow glows on primary CTAs
- Animated progress bars

## Best Practices

### Email Deliverability

1. **Warm up your domain** - Start with small volumes
2. **SPF/DKIM/DMARC** - Configure email authentication
3. **Unsubscribe links** - Include in all emails
4. **Content quality** - Avoid spam triggers
5. **Engagement tracking** - Monitor open/click rates

### User Experience

1. **Progressive profiling** - Don't ask everything at once
2. **Skip options** - Allow users to complete later
3. **Mobile-first** - Optimize for mobile devices
4. **Fast loading** - Minimize dependencies
5. **Clear CTAs** - One primary action per step

### Conversion Optimization

1. **Social proof** - Include case studies and testimonials
2. **Urgency** - "Complete in 24 hours" messaging
3. **Value props** - Emphasize benefits at each step
4. **Visual progress** - Show completion percentage
5. **Trust signals** - Security badges, encryption notices

## Metrics to Track

- **Activation Rate**: % users completing onboarding within 7 days
- **Email Open Rates**: Track per email type
- **Email Click Rates**: CTA effectiveness
- **Drop-off Points**: Where users abandon
- **Time to Value**: Days until first meaningful action
- **Engagement Segmentation**: High vs low engagement users

## Customization

### Adding New Onboarding Steps

1. Create new page in `/app/onboarding/step-X/`
2. Update schema with new fields
3. Adjust completion percentage calculation
4. Update progress bar in UI

### Adding New Drip Emails

1. Create template in `/lib/email-templates/`
2. Add timestamp field to OnboardingProfile
3. Create send function in `/lib/services/onboarding-email.ts`
4. Add to `processScheduledEmails()` function

### Modifying Email Timing

Edit the day checks in `/lib/services/onboarding-email.ts`:

```typescript
if (daysSinceRegistration >= 1 && !user.onboarding.day1EmailSentAt) {
  await sendDay1Email(user.id)
}
```

## Troubleshooting

**Emails not sending?**
- Check RESEND_API_KEY is set
- Verify domain is verified in Resend dashboard
- Check server logs for errors

**Onboarding progress not saving?**
- Verify user is authenticated
- Check database connection
- Review API endpoint responses

**Animations not working?**
- Ensure Tailwind config is updated
- Check browser compatibility
- Verify CSS is compiled

## Support

For questions or issues:
- Email: support@yourdomain.com
- Documentation: https://docs.yourdomain.com
- GitHub: https://github.com/yourusername/repo
