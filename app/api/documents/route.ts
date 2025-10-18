import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware/rbac'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse } from '@/lib/utils/response'
import { auditRequest, AuditAction } from '@/lib/utils/audit'
import { z } from 'zod'

const documentCreateSchema = z.object({
  applicationId: z.string().cuid(),
  name: z.string().min(1),
  type: z.string().min(1),
  url: z.string().url(),
})

// GET /api/documents - Get documents for user's application
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('applicationId')

    if (!applicationId) {
      return errorResponses.badRequest('applicationId is required')
    }

    // Verify the application belongs to the user or user is admin/staff
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return errorResponses.notFound('Application')
    }

    if (application.userId !== user!.id && user!.role !== 'ADMIN' && user!.role !== 'STAFF') {
      return errorResponses.forbidden()
    }

    const documents = await prisma.document.findMany({
      where: { applicationId },
      orderBy: { uploadedAt: 'desc' },
    })

    return createSuccessResponse(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return handlePrismaError(error)
  }
}

// POST /api/documents - Upload a document
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth()
    if (authError) return authError

    const { data, error: validationError } = await validateRequest(
      request,
      documentCreateSchema
    )
    if (validationError) return validationError

    // Verify the application belongs to the user or user is admin/staff
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
    })

    if (!application) {
      return errorResponses.notFound('Application')
    }

    if (application.userId !== user!.id && user!.role !== 'ADMIN' && user!.role !== 'STAFF') {
      return errorResponses.forbidden('You can only upload documents to your own application')
    }

    // Create the document
    const document = await prisma.document.create({
      data: {
        applicationId: data.applicationId,
        name: data.name,
        type: data.type,
        url: data.url,
      },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.CREATE,
      'Document',
      document.id,
      { document }
    )

    return createSuccessResponse(document, 201, 'Document uploaded successfully')
  } catch (error) {
    console.error('Error creating document:', error)
    return handlePrismaError(error)
  }
}
