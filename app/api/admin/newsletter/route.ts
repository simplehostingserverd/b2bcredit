import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware/rbac'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createPaginatedResponse, getPaginationParams, buildSearchFilter } from '@/lib/utils/response'

// GET /api/admin/newsletter - Get all newsletter subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAdmin()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const isActive = searchParams.get('isActive')

    const { skip, take } = getPaginationParams(page, limit)

    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip,
        take
      }),
      prisma.newsletterSubscriber.count({ where })
    ])

    return createPaginatedResponse(subscribers, page, limit, total)
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    return handlePrismaError(error)
  }
}
