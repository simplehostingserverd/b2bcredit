import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware/rbac'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse } from '@/lib/utils/response'
import { auditRequest, AuditAction } from '@/lib/utils/audit'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(['CLIENT', 'STAFF', 'ADMIN']).optional(),
  serviceType: z.enum(['formation', 'funding']).optional().nullable(),
  password: z.string().min(8).optional(), // Allow password updates
})

// GET /api/admin/users/[id] - Get a single user (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, error } = await requireAdmin()
    if (error) return error

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        serviceType: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            applications: true,
            assignedLeads: true,
            blogPosts: true,
          }
        }
      }
    })

    if (!targetUser) {
      return errorResponses.notFound('User')
    }

    return createSuccessResponse(targetUser)
  } catch (error) {
    console.error('Error fetching user:', error)
    return handlePrismaError(error)
  }
}

// PATCH /api/admin/users/[id] - Update a user (admin only)
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
      userUpdateSchema
    )
    if (validationError) return validationError

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return errorResponses.notFound('User')
    }

    // If email is being updated, check uniqueness
    if (data.email && data.email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: data.email }
      })
      if (emailTaken) {
        return errorResponses.conflict('Email already in use')
      }
    }

    // Prepare update data
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      serviceType: data.serviceType,
      updatedAt: new Date()
    }

    // Hash password if being updated
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        serviceType: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // Audit log (don't log password)
    const auditData = { ...data }
    if (auditData.password) {
      auditData.password = '[REDACTED]'
    }

    await auditRequest(
      request,
      user!.id,
      AuditAction.UPDATE,
      'User',
      id,
      { changes: auditData }
    )

    return createSuccessResponse(updatedUser, 200, 'User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
    return handlePrismaError(error)
  }
}

// DELETE /api/admin/users/[id] - Delete a user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, error: authError } = await requireAdmin()
    if (authError) return authError

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            applications: true,
            assignedLeads: true,
            blogPosts: true,
          }
        }
      }
    })

    if (!existingUser) {
      return errorResponses.notFound('User')
    }

    // Prevent self-deletion
    if (existingUser.id === user!.id) {
      return errorResponses.badRequest('Cannot delete your own account')
    }

    // Check for related data
    if (existingUser._count.applications > 0 ||
        existingUser._count.assignedLeads > 0 ||
        existingUser._count.blogPosts > 0) {
      return errorResponses.badRequest(
        'Cannot delete user with associated data. Please reassign or delete related records first.',
        {
          applications: existingUser._count.applications,
          assignedLeads: existingUser._count.assignedLeads,
          blogPosts: existingUser._count.blogPosts,
        }
      )
    }

    // Delete the user
    await prisma.user.delete({
      where: { id }
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.DELETE,
      'User',
      id,
      {
        deletedUser: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
        }
      }
    )

    return createSuccessResponse(
      { id },
      200,
      'User deleted successfully'
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return handlePrismaError(error)
  }
}
