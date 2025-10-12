import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').optional(),
  source: z.string().optional(),
  interests: z.array(z.string()).optional()
})

// POST /api/newsletter/subscribe - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = subscribeSchema.parse(body)

    const { email, name, source = 'blog', interests = [] } = validatedData

    // Check if already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'Already subscribed to newsletter' },
        { status: 200 }
      )
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
        source,
        interests,
        isActive: true,
        subscribedAt: new Date()
      }
    })

    // Trigger welcome email automation
    try {
      await triggerWelcomeEmail(subscriber)
    } catch (error) {
      console.error('Failed to trigger welcome email:', error)
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter!',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

// GET /api/newsletter/subscribe - Check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      )
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        subscribedAt: true
      }
    })

    if (!subscriber) {
      return NextResponse.json({
        subscribed: false
      })
    }

    return NextResponse.json({
      subscribed: true,
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        isActive: subscriber.isActive,
        subscribedAt: subscriber.subscribedAt
      }
    })

  } catch (error) {
    console.error('Newsletter status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}

async function triggerWelcomeEmail(subscriber: any) {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

  if (!n8nWebhookUrl) {
    console.log('N8N webhook URL not configured, skipping welcome email automation')
    return
  }

  try {
    await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'newsletter_subscribe',
        data: {
          subscriberId: subscriber.id,
          email: subscriber.email,
          name: subscriber.name,
          source: subscriber.source,
          subscribedAt: subscriber.subscribedAt
        },
        timestamp: new Date().toISOString(),
        source: 'b2b-credit-blog'
      })
    })
  } catch (error) {
    console.error('Failed to trigger welcome email automation:', error)
    throw error
  }
}