import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware/rbac'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse } from '@/lib/utils/response'
import { auditRequest, AuditAction } from '@/lib/utils/audit'
import { z } from 'zod'

const blogPostCreateSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  featuredImage: z.string().url().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().url().optional().nullable(),
  categoryId: z.string().cuid().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledFor: z.string().datetime().optional().nullable(),
})

const blogPostUpdateSchema = blogPostCreateSchema.partial()

// GET /api/admin/blog/[id] - Get a single blog post (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAdmin()
    if (error) return error

    const { id } = await params

    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    })

    if (!blogPost) {
      return errorResponses.notFound('Blog post')
    }

    return createSuccessResponse(blogPost)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return handlePrismaError(error)
  }
}

// PATCH /api/admin/blog/[id] - Update a blog post (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await requireAdmin()
    if (authError) return authError

    const { id } = await params

    const { data, error: validationError } = await validateRequest(
      request,
      blogPostUpdateSchema
    )
    if (validationError) return validationError

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return errorResponses.notFound('Blog post')
    }

    // If category is being updated, verify it exists
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      })
      if (!category) {
        return errorResponses.badRequest('Category not found')
      }
    }

    // Prepare update data
    const updateData: any = { ...data }

    // Generate slug if title changed
    if (data.title && data.title !== existingPost.title) {
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now()
    }

    // Calculate reading time if content changed
    if (data.content) {
      const wordCount = data.content.split(/\s+/).length
      updateData.readingTime = Math.ceil(wordCount / 200)
    }

    // Convert date strings to Date objects
    if (data.publishedAt) {
      updateData.publishedAt = new Date(data.publishedAt)
    }
    if (data.scheduledFor) {
      updateData.scheduledFor = new Date(data.scheduledFor)
    }

    // Auto-set publishedAt when status changes to PUBLISHED
    if (data.status === 'PUBLISHED' && !existingPost.publishedAt) {
      updateData.publishedAt = new Date()
    }

    // Update the blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.UPDATE,
      'BlogPost',
      id,
      { changes: data }
    )

    return createSuccessResponse(updatedPost, 200, 'Blog post updated successfully')
  } catch (error) {
    console.error('Error updating blog post:', error)
    return handlePrismaError(error)
  }
}

// DELETE /api/admin/blog/[id] - Delete a blog post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await requireAdmin()
    if (authError) return authError

    const { id } = await params

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return errorResponses.notFound('Blog post')
    }

    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.DELETE,
      'BlogPost',
      id,
      {
        deletedPost: {
          id: existingPost.id,
          title: existingPost.title,
          slug: existingPost.slug,
          status: existingPost.status,
        },
      }
    )

    return createSuccessResponse(
      { id },
      200,
      'Blog post deleted successfully'
    )
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return handlePrismaError(error)
  }
}

// POST /api/admin/blog - Create a new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAdmin()
    if (authError) return authError

    const { data, error: validationError } = await validateRequest(
      request,
      blogPostCreateSchema
    )
    if (validationError) return validationError

    // If category is provided, verify it exists
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      })
      if (!category) {
        return errorResponses.badRequest('Category not found')
      }
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now()

    // Calculate reading time
    const wordCount = data.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Prepare create data
    const createData: any = {
      ...data,
      slug,
      readingTime,
      authorId: user!.id,
      tags: data.tags || [],
      status: data.status || 'DRAFT',
    }

    // Convert date strings to Date objects
    if (data.publishedAt) {
      createData.publishedAt = new Date(data.publishedAt)
    }
    if (data.scheduledFor) {
      createData.scheduledFor = new Date(data.scheduledFor)
    }

    // Auto-set publishedAt if status is PUBLISHED
    if (createData.status === 'PUBLISHED' && !createData.publishedAt) {
      createData.publishedAt = new Date()
    }

    // Create the blog post
    const blogPost = await prisma.blogPost.create({
      data: createData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    })

    // Audit log
    await auditRequest(
      request,
      user!.id,
      AuditAction.CREATE,
      'BlogPost',
      blogPost.id,
      { blogPost }
    )

    return createSuccessResponse(blogPost, 201, 'Blog post created successfully')
  } catch (error) {
    console.error('Error creating blog post:', error)
    return handlePrismaError(error)
  }
}
