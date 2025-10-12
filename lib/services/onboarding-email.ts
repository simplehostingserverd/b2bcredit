import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { getWelcomeEmailTemplate } from '@/lib/email-templates/welcome'
import { getDay1EducationTemplate } from '@/lib/email-templates/day1-education'
import { getDay2NudgeTemplate } from '@/lib/email-templates/day2-nudge'
import { getDay4RoadmapTemplate } from '@/lib/email-templates/day4-roadmap'
import { getDay7EngagementTemplate } from '@/lib/email-templates/day7-engagement'
import { getDay10CheckinTemplate } from '@/lib/email-templates/day10-checkin'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export interface OnboardingEmailService {
  sendWelcomeEmail: (userId: string) => Promise<void>
  sendDay1Email: (userId: string) => Promise<void>
  sendDay2Email: (userId: string) => Promise<void>
  sendDay4Email: (userId: string) => Promise<void>
  sendDay7Email: (userId: string) => Promise<void>
  sendDay10Email: (userId: string) => Promise<void>
  processScheduledEmails: () => Promise<void>
}

/**
 * Send welcome email immediately after registration
 */
export async function sendWelcomeEmail(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const dashboardUrl = `${BASE_URL}/onboarding/step-1`
    const html = getWelcomeEmailTemplate(
      user.name || 'there',
      dashboardUrl
    )

    await sendEmail({
      to: user.email,
      subject: 'Welcome to Your Business Credit Journey! 🎉',
      html,
    })

    // Update onboarding profile
    await prisma.onboardingProfile.update({
      where: { userId },
      data: {
        welcomeEmailSentAt: new Date(),
      },
    })

    // Track email drip
    await prisma.emailDrip.create({
      data: {
        userId,
        emailType: 'welcome',
        subject: 'Welcome to Your Business Credit Journey! 🎉',
      },
    })

    console.log(`✅ Welcome email sent to ${user.email}`)
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}

/**
 * Send Day 1 educational email
 */
export async function sendDay1Email(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    })

    if (!user || !user.onboarding) {
      throw new Error('User or onboarding profile not found')
    }

    // Skip if already sent
    if (user.onboarding.day1EmailSentAt) {
      console.log('Day 1 email already sent')
      return
    }

    const businessType = user.onboarding.businessType || 'LLC'
    const uploadUrl = `${BASE_URL}/onboarding/step-2`

    const html = getDay1EducationTemplate(
      user.name || 'there',
      businessType,
      uploadUrl
    )

    await sendEmail({
      to: user.email,
      subject: `Your First Step: Why Business Credit Matters for ${businessType}s`,
      html,
    })

    await prisma.onboardingProfile.update({
      where: { userId },
      data: {
        day1EmailSentAt: new Date(),
      },
    })

    await prisma.emailDrip.create({
      data: {
        userId,
        emailType: 'day1_education',
        subject: `Your First Step: Why Business Credit Matters for ${businessType}s`,
      },
    })

    console.log(`✅ Day 1 email sent to ${user.email}`)
  } catch (error) {
    console.error('Error sending Day 1 email:', error)
    throw error
  }
}

/**
 * Send Day 2-3 nudge email
 */
export async function sendDay2Email(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    })

    if (!user || !user.onboarding) {
      throw new Error('User or onboarding profile not found')
    }

    // Skip if already sent
    if (user.onboarding.day2EmailSentAt) {
      console.log('Day 2 email already sent')
      return
    }

    const businessType = user.onboarding.businessType || 'LLC'

    // Determine which action is needed
    let actionNeeded: 'connect_bank' | 'add_tradelines' | 'set_goals' = 'set_goals'
    let actionUrl = `${BASE_URL}/onboarding/step-3`

    if (!user.onboarding.bankConnected) {
      actionNeeded = 'connect_bank'
    } else if (!user.onboarding.tradeLines) {
      actionNeeded = 'add_tradelines'
    }

    const html = getDay2NudgeTemplate(
      user.name || 'there',
      businessType,
      actionUrl,
      actionNeeded
    )

    await sendEmail({
      to: user.email,
      subject: `Tailored Tips for ${businessType} Credit Builders`,
      html,
    })

    await prisma.onboardingProfile.update({
      where: { userId },
      data: {
        day2EmailSentAt: new Date(),
      },
    })

    await prisma.emailDrip.create({
      data: {
        userId,
        emailType: 'day2_nudge',
        subject: `Tailored Tips for ${businessType} Credit Builders`,
      },
    })

    console.log(`✅ Day 2 email sent to ${user.email}`)
  } catch (error) {
    console.error('Error sending Day 2 email:', error)
    throw error
  }
}

/**
 * Send Day 4 roadmap ready email
 */
export async function sendDay4Email(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    })

    if (!user || !user.onboarding) {
      throw new Error('User or onboarding profile not found')
    }

    if (user.onboarding.day4EmailSentAt) {
      console.log('Day 4 email already sent')
      return
    }

    const businessType = user.onboarding.businessType || 'LLC'
    const roadmapUrl = `${BASE_URL}/dashboard/roadmap`
    const consultUrl = `${BASE_URL}/book-consultation`

    const html = getDay4RoadmapTemplate(
      user.name || 'there',
      businessType,
      roadmapUrl,
      consultUrl
    )

    await sendEmail({
      to: user.email,
      subject: 'Your Custom Credit Roadmap is Ready! 🎉',
      html,
    })

    await prisma.onboardingProfile.update({
      where: { userId },
      data: {
        day4EmailSentAt: new Date(),
        completionPercentage: Math.max(60, user.onboarding.completionPercentage),
      },
    })

    await prisma.emailDrip.create({
      data: {
        userId,
        emailType: 'day4_roadmap',
        subject: 'Your Custom Credit Roadmap is Ready! 🎉',
      },
    })

    console.log(`✅ Day 4 email sent to ${user.email}`)
  } catch (error) {
    console.error('Error sending Day 4 email:', error)
    throw error
  }
}

/**
 * Send Day 7 engagement/upsell email
 */
export async function sendDay7Email(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    })

    if (!user || !user.onboarding) {
      throw new Error('User or onboarding profile not found')
    }

    if (user.onboarding.day7EmailSentAt) {
      console.log('Day 7 email already sent')
      return
    }

    const webinarUrl = `${BASE_URL}/webinar`
    const upgradeUrl = `${BASE_URL}/upgrade`

    // Determine engagement level based on completion percentage
    const isHighEngagement = user.onboarding.completionPercentage >= 50

    const html = getDay7EngagementTemplate(
      user.name || 'there',
      webinarUrl,
      upgradeUrl,
      isHighEngagement
    )

    const subject = isHighEngagement
      ? 'Ready to Accelerate Your Progress? 🚀'
      : 'Join Our Free Credit Building Webinar'

    await sendEmail({
      to: user.email,
      subject,
      html,
    })

    await prisma.onboardingProfile.update({
      where: { userId },
      data: {
        day7EmailSentAt: new Date(),
      },
    })

    await prisma.emailDrip.create({
      data: {
        userId,
        emailType: 'day7_engagement',
        subject,
      },
    })

    console.log(`✅ Day 7 email sent to ${user.email}`)
  } catch (error) {
    console.error('Error sending Day 7 email:', error)
    throw error
  }
}

/**
 * Send Day 10 check-in email
 */
export async function sendDay10Email(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    })

    if (!user || !user.onboarding) {
      throw new Error('User or onboarding profile not found')
    }

    if (user.onboarding.day10EmailSentAt) {
      console.log('Day 10 email already sent')
      return
    }

    const supportUrl = `${BASE_URL}/support`
    const bookDemoUrl = `${BASE_URL}/book-demo`

    const html = getDay10CheckinTemplate(
      user.name || 'there',
      supportUrl,
      bookDemoUrl,
      user.onboarding.completionPercentage
    )

    await sendEmail({
      to: user.email,
      subject: "How's Your Credit Journey Going?",
      html,
    })

    await prisma.onboardingProfile.update({
      where: { userId },
      data: {
        day10EmailSentAt: new Date(),
      },
    })

    await prisma.emailDrip.create({
      data: {
        userId,
        emailType: 'day10_checkin',
        subject: "How's Your Credit Journey Going?",
      },
    })

    console.log(`✅ Day 10 email sent to ${user.email}`)
  } catch (error) {
    console.error('Error sending Day 10 email:', error)
    throw error
  }
}

/**
 * Process scheduled drip emails
 * This should be called by a cron job or scheduled task
 */
export async function processScheduledEmails() {
  try {
    console.log('🔄 Processing scheduled onboarding emails...')

    const now = new Date()

    // Find all users with onboarding profiles
    const users = await prisma.user.findMany({
      where: {
        onboarding: {
          isNot: null,
        },
      },
      include: {
        onboarding: true,
      },
    })

    for (const user of users) {
      if (!user.onboarding) continue

      const daysSinceRegistration = Math.floor(
        (now.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Send Day 1 email (1 day after registration)
      if (daysSinceRegistration >= 1 && !user.onboarding.day1EmailSentAt) {
        await sendDay1Email(user.id)
      }

      // Send Day 2 email (2-3 days after registration)
      if (daysSinceRegistration >= 2 && !user.onboarding.day2EmailSentAt) {
        await sendDay2Email(user.id)
      }

      // Send Day 4 email (4 days after registration)
      if (daysSinceRegistration >= 4 && !user.onboarding.day4EmailSentAt) {
        await sendDay4Email(user.id)
      }

      // Send Day 7 email (7 days after registration)
      if (daysSinceRegistration >= 7 && !user.onboarding.day7EmailSentAt) {
        await sendDay7Email(user.id)
      }

      // Send Day 10 email (10 days after registration)
      if (daysSinceRegistration >= 10 && !user.onboarding.day10EmailSentAt) {
        await sendDay10Email(user.id)
      }
    }

    console.log('✅ Scheduled emails processed successfully')
  } catch (error) {
    console.error('Error processing scheduled emails:', error)
    throw error
  }
}
