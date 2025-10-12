import { NextResponse } from 'next/server'
import { processScheduledEmails } from '@/lib/services/onboarding-email'

export async function POST(req: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'dev-secret-key'

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await processScheduledEmails()

    return NextResponse.json({
      message: 'Scheduled emails processed successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error processing scheduled emails:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  // Allow GET requests in development for testing
  if (process.env.NODE_ENV === 'development') {
    try {
      await processScheduledEmails()

      return NextResponse.json({
        message: 'Scheduled emails processed successfully (dev mode)',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error processing scheduled emails:', error)
      return NextResponse.json(
        { error: 'Something went wrong' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'Method not allowed in production' },
    { status: 405 }
  )
}
