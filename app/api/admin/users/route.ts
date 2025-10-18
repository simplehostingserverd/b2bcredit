import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware/rbac'
import { errorResponses, handlePrismaError } from '@/lib/utils/errors'
import { createPaginatedResponse, getPaginationParams } from '@/lib/utils/response'

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAdmin()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const role = searchParams.get('role')

    const { skip, take } = getPaginationParams(page, limit)

    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.user.count({ where })
    ])

    return createPaginatedResponse(users, page, limit, total)
  } catch (error) {
    console.error('Error fetching users:', error)
    return handlePrismaError(error)
  }
}
