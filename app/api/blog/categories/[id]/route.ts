import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware/rbac'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse } from '@/lib/utils/response'
import { auditRequest, AuditAction } from '@/lib/utils/audit'
import { z } from 'zod'

const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
})

// GET /api/blog/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { blogPosts: true },
        },
      },
    })

    if (!category) {
      return errorResponses.notFound('Category')
    }

    return createSuccessResponse(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return handlePrismaError(error)
  }
}

// PATCH /api/blog/categories/[id] - Update a category (admin only)
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
      categoryUpdateSchema
    )
    if (validationError) return validationError

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return errorResponses.notFound('Category')
    }

    // Prepare update data
    const updateData: any = { ...data }

    // Generate new slug if name changed
    if (data.name && data.name !== existingCategory.name) {
      updateData.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.UPDATE,
      'Category',
      id,
      { changes: data }
    )

    return createSuccessResponse(updatedCategory, 200, 'Category updated successfully')
  } catch (error) {
    console.error('Error updating category:', error)
    return handlePrismaError(error)
  }
}

// DELETE /api/blog/categories/[id] - Delete a category (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, error: authError } = await requireAdmin()
    if (authError) return authError

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { blogPosts: true },
        },
      },
    })

    if (!existingCategory) {
      return errorResponses.notFound('Category')
    }

    // Check if category has blog posts
    if (existingCategory._count.blogPosts > 0) {
      return errorResponses.badRequest(
        'Cannot delete category with associated blog posts. Reassign or delete posts first.',
        { postCount: existingCategory._count.blogPosts }
      )
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.DELETE,
      'Category',
      id,
      { deletedCategory: existingCategory }
    )

    return createSuccessResponse(
      { id },
      200,
      'Category deleted successfully'
    )
  } catch (error) {
    console.error('Error deleting category:', error)
    return handlePrismaError(error)
  }
}
