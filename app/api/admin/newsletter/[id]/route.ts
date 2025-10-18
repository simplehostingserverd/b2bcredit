import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware/rbac'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse } from '@/lib/utils/response'
import { auditRequest, AuditAction } from '@/lib/utils/audit'
import { z } from 'zod'

const subscriberUpdateSchema = z.object({
  name: z.string().optional(),
  interests: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

// GET /api/admin/newsletter/[id] - Get a single subscriber (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, error } = await requireAdmin()
    if (error) return error

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id }
    })

    if (!subscriber) {
      return errorResponses.notFound('Newsletter subscriber')
    }

    return createSuccessResponse(subscriber)
  } catch (error) {
    console.error('Error fetching newsletter subscriber:', error)
    return handlePrismaError(error)
  }
}

// PATCH /api/admin/newsletter/[id] - Update a subscriber (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, error: authError } = await requireAdmin()
    if (authError) return authError

    const { data, error: validationError } = await validateRequest(
      request,
      subscriberUpdateSchema
    )
    if (validationError) return validationError

    // Check if subscriber exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id }
    })

    if (!existingSubscriber) {
      return errorResponses.notFound('Newsletter subscriber')
    }

    // Update the subscriber
    const updatedSubscriber = await prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.UPDATE,
      'NewsletterSubscriber',
      id,
      { changes: data }
    )

    return createSuccessResponse(
      updatedSubscriber,
      200,
      'Subscriber updated successfully'
    )
  } catch (error) {
    console.error('Error updating newsletter subscriber:', error)
    return handlePrismaError(error)
  }
}

// DELETE /api/admin/newsletter/[id] - Delete a subscriber (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, error: authError } = await requireAdmin()
    if (authError) return authError

    // Check if subscriber exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id }
    })

    if (!existingSubscriber) {
      return errorResponses.notFound('Newsletter subscriber')
    }

    // Delete the subscriber
    await prisma.newsletterSubscriber.delete({
      where: { id }
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.DELETE,
      'NewsletterSubscriber',
      id,
      { deletedSubscriber: existingSubscriber }
    )

    return createSuccessResponse(
      { id },
      200,
      'Subscriber deleted successfully'
    )
  } catch (error) {
    console.error('Error deleting newsletter subscriber:', error)
    return handlePrismaError(error)
  }
}
