import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { plannerAgent } from '@/lib/agents/planner-agent'

/**
 * POST /api/automation/topics/discover
 * Trigger topic discovery using PlannerAgent
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role

    if (!session || (userRole !== 'ADMIN' && userRole !== 'STAFF')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Staff access required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json().catch(() => ({}))
    const { count = 10, source = 'trending' } = body

    // Validate input
    if (count < 1 || count > 100) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Run the planner agent
    const result = await plannerAgent.run({
      count,
      source
    })

    if (result.status === 'FAILED') {
      return NextResponse.json(
        {
          error: 'Topic discovery failed',
          details: result.errors
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      ...result.data,
      metrics: result.metrics,
      warnings: result.warnings
    })

  } catch (error) {
    console.error('Error in topic discovery:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/automation/topics/discover
 * Get discovered topics with pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role

    if (!session || (userRole !== 'ADMIN' && userRole !== 'STAFF')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || undefined

    const skip = (page - 1) * limit

    // Import prisma here to avoid circular dependencies
    const { prisma } = await import('@/lib/prisma')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [topics, total] = await Promise.all([
      prisma.contentTopic.findMany({
        where,
        include: {
          keywords: {
            take: 5,
            orderBy: { searchVolume: 'desc' }
          },
          blogPost: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true
            }
          }
        },
        orderBy: { priority: 'desc' },
        skip,
        take: limit
      }),
      prisma.contentTopic.count({ where })
    ])

    return NextResponse.json({
      topics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
