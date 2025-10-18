import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware/rbac'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse } from '@/lib/utils/response'
import { auditRequest, AuditAction } from '@/lib/utils/audit'
import { z } from 'zod'

const documentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  url: z.string().url().optional(),
})

// GET /api/documents/[id] - Get a single document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, error } = await requireAuth()
    if (error) return error

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        application: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!document) {
      return errorResponses.notFound('Document')
    }

    // Verify access
    if (
      document.application.userId !== user!.id &&
      user!.role !== 'ADMIN' &&
      user!.role !== 'STAFF'
    ) {
      return errorResponses.forbidden()
    }

    return createSuccessResponse(document)
  } catch (error) {
    console.error('Error fetching document:', error)
    return handlePrismaError(error)
  }
}

// PATCH /api/documents/[id] - Update a document
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, error: authError } = await requireAuth()
    if (authError) return authError

    const { data, error: validationError } = await validateRequest(
      request,
      documentUpdateSchema
    )
    if (validationError) return validationError

    // Check if document exists and verify access
    const existingDocument = await prisma.document.findUnique({
      where: { id },
      include: {
        application: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!existingDocument) {
      return errorResponses.notFound('Document')
    }

    // Verify access
    if (
      existingDocument.application.userId !== user!.id &&
      user!.role !== 'ADMIN' &&
      user!.role !== 'STAFF'
    ) {
      return errorResponses.forbidden()
    }

    // Update the document
    const updatedDocument = await prisma.document.update({
      where: { id },
      data,
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.UPDATE,
      'Document',
      id,
      { changes: data }
    )

    return createSuccessResponse(updatedDocument, 200, 'Document updated successfully')
  } catch (error) {
    console.error('Error updating document:', error)
    return handlePrismaError(error)
  }
}

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, error: authError } = await requireAuth()
    if (authError) return authError

    // Check if document exists and verify access
    const existingDocument = await prisma.document.findUnique({
      where: { id },
      include: {
        application: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!existingDocument) {
      return errorResponses.notFound('Document')
    }

    // Verify access
    if (
      existingDocument.application.userId !== user!.id &&
      user!.role !== 'ADMIN' &&
      user!.role !== 'STAFF'
    ) {
      return errorResponses.forbidden()
    }

    // Delete the document
    await prisma.document.delete({
      where: { id },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.DELETE,
      'Document',
      id,
      { deletedDocument: existingDocument }
    )

    return createSuccessResponse(
      { id },
      200,
      'Document deleted successfully'
    )
  } catch (error) {
    console.error('Error deleting document:', error)
    return handlePrismaError(error)
  }
}
