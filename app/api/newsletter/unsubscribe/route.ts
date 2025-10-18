import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse } from '@/lib/utils/response'
import { z } from 'zod'

const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
export async function POST(request: NextRequest) {
  try {
    const { data, error: validationError } = await validateRequest(
      request,
      unsubscribeSchema
    )
    if (validationError) return validationError

    const { email } = data

    // Check if subscriber exists
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (!subscriber) {
      return errorResponses.notFound('Subscriber')
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { message: 'Already unsubscribed from newsletter' },
        { status: 200 }
      )
    }

    // Unsubscribe (soft delete)
    const updatedSubscriber = await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date()
      }
    })

    return createSuccessResponse(
      { email: updatedSubscriber.email },
      200,
      'Successfully unsubscribed from newsletter'
    )

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return handlePrismaError(error)
  }
}
