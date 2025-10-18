import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware/rbac'
import { validateRequest } from '@/lib/middleware/validation'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createSuccessResponse, createPaginatedResponse } from '@/lib/utils/response'
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

// GET /api/admin/blog - Get all blog posts for admin (including drafts)
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAdmin()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          category: true
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ])

    // Calculate reading time for posts that don't have it
    const postsWithReadingTime = posts.map(post => ({
      ...post,
      readingTime: post.readingTime || Math.ceil(post.content.split(' ').length / 200)
    }))

    return NextResponse.json({
      posts: postsWithReadingTime,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching admin blog posts:', error)
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