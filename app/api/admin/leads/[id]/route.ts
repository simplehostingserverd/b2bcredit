import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminOrStaff } from '@/lib/middleware/rbac'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse } from '@/lib/utils/response'
import { auditRequest, AuditAction } from '@/lib/utils/audit'
import { z } from 'zod'

const leadUpdateSchema = z.object({
  businessName: z.string().min(1).optional(),
  contactName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  yearsInBusiness: z.number().int().min(0).optional(),
  annualRevenue: z.number().min(0).optional(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED']).optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().optional().nullable(),
})

// GET /api/admin/leads/[id] - Get a single lead
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAdminOrStaff()
    if (error) return error

    const { id } = await params
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        application: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
          },
        },
      },
    })

    if (!lead) {
      return errorResponses.notFound('Lead')
    }

    return createSuccessResponse(lead)
  } catch (error) {
    console.error('Error fetching lead:', error)
    return handlePrismaError(error)
  }
}

// PATCH /api/admin/leads/[id] - Update a lead
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await requireAdminOrStaff()
    if (authError) return authError

    const { data, error: validationError } = await validateRequest(
      request,
      leadUpdateSchema
    )
    if (validationError) return validationError

    const { id } = await params
    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    })

    if (!existingLead) {
      return errorResponses.notFound('Lead')
    }

    // If assigning to a user, verify the user exists
    if (data.assignedToId !== undefined && data.assignedToId !== null) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: data.assignedToId },
      })

      if (!assignedUser) {
        return errorResponses.badRequest('Assigned user not found')
      }
    }

    // Update the lead
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.UPDATE,
      'Lead',
      id,
      { changes: data }
    )

    return createSuccessResponse(updatedLead, 200, 'Lead updated successfully')
  } catch (error) {
    console.error('Error updating lead:', error)
    return handlePrismaError(error)
  }
}

// DELETE /api/admin/leads/[id] - Delete a lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await requireAdminOrStaff()
    if (authError) return authError

    const { id } = await params
    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
      include: {
        application: true,
      },
    })

    if (!existingLead) {
      return errorResponses.notFound('Lead')
    }

    // Prevent deletion if lead has an associated application
    if (existingLead.application) {
      return errorResponses.badRequest(
        'Cannot delete lead with associated application. Delete the application first.',
        { applicationId: existingLead.application.id }
      )
    }

    // Delete the lead
    await prisma.lead.delete({
      where: { id },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.DELETE,
      'Lead',
      id,
      { deletedLead: existingLead }
    )

    return createSuccessResponse(
      { id },
      200,
      'Lead deleted successfully'
    )
  } catch (error) {
    console.error('Error deleting lead:', error)
    return handlePrismaError(error)
  }
}
