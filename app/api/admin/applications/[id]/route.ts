import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminOrStaff } from '@/lib/middleware/rbac'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse } from '@/lib/utils/response'
import { auditRequest, AuditAction } from '@/lib/utils/audit'
import { z } from 'zod'

const applicationUpdateSchema = z.object({
  status: z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']).optional(),
  rejectionReason: z.string().optional().nullable(),
  reviewedAt: z.string().datetime().optional().nullable(),
  approvedAt: z.string().datetime().optional().nullable(),
  rejectedAt: z.string().datetime().optional().nullable(),
})

// GET /api/admin/applications/[id] - Get a single application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAdminOrStaff()
    if (error) return error

    const { id } = await params
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lead: {
          select: {
            id: true,
            businessName: true,
            contactName: true,
            email: true,
          },
        },
        documents: true,
      },
    })

    if (!application) {
      return errorResponses.notFound('Application')
    }

    return createSuccessResponse(application)
  } catch (error) {
    console.error('Error fetching application:', error)
    return handlePrismaError(error)
  }
}

// PATCH /api/admin/applications/[id] - Update application (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await requireAdminOrStaff()
    if (authError) return authError

    const { data, error: validationError } = await validateRequest(
      request,
      applicationUpdateSchema
    )
    if (validationError) return validationError

    const { id } = await params
    // Check if application exists
    const existingApplication = await prisma.application.findUnique({
      where: { id },
    })

    if (!existingApplication) {
      return errorResponses.notFound('Application')
    }

    // Prepare update data
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    }

    // Convert date strings to Date objects
    if (data.reviewedAt) {
      updateData.reviewedAt = new Date(data.reviewedAt)
    }
    if (data.approvedAt) {
      updateData.approvedAt = new Date(data.approvedAt)
    }
    if (data.rejectedAt) {
      updateData.rejectedAt = new Date(data.rejectedAt)
    }

    // Update the application
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        documents: true,
      },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.UPDATE,
      'Application',
      id,
      { changes: data }
    )

    return createSuccessResponse(
      updatedApplication,
      200,
      'Application updated successfully'
    )
  } catch (error) {
    console.error('Error updating application:', error)
    return handlePrismaError(error)
  }
}

// DELETE /api/admin/applications/[id] - Delete an application (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await requireAdminOrStaff()
    if (authError) return authError

    const { id } = await params
    // Check if application exists
    const existingApplication = await prisma.application.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    })

    if (!existingApplication) {
      return errorResponses.notFound('Application')
    }

    // Delete the application (documents will cascade delete due to schema)
    await prisma.application.delete({
      where: { id },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.DELETE,
      'Application',
      id,
      {
        deletedApplication: {
          id: existingApplication.id,
          userId: existingApplication.userId,
          businessName: existingApplication.businessName,
          status: existingApplication.status,
        },
        documentsDeleted: existingApplication.documents.length,
      }
    )

    return createSuccessResponse(
      { id },
      200,
      'Application deleted successfully'
    )
  } catch (error) {
    console.error('Error deleting application:', error)
    return handlePrismaError(error)
  }
}
