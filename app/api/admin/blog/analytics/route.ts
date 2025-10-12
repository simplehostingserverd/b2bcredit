import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/blog/analytics - Get blog analytics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get blog analytics data
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      recentPosts,
      topCategories
    ] = await Promise.all([
      // Total posts count
      prisma.blogPost.count(),

      // Published posts count
      prisma.blogPost.count({
        where: { status: 'PUBLISHED' }
      }),

      // Draft posts count
      prisma.blogPost.count({
        where: { status: 'DRAFT' }
      }),

      // Total views across all posts
      prisma.blogPost.aggregate({
        _sum: { viewCount: true }
      }),

      // Recent posts (last 30 days)
      prisma.blogPost.findMany({
        where: {
          publishedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          }
        },
        include: {
          category: true,
          author: {
            select: { name: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        take: 10
      }),

      // Top categories by post count
      prisma.category.findMany({
        include: {
          _count: {
            select: { blogPosts: true }
          }
        },
        orderBy: {
          blogPosts: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ])

    const analytics = {
      overview: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews._sum.viewCount || 0
      },
      recentPosts,
      topCategories: topCategories.map(cat => ({
        name: cat.name,
        slug: cat.slug,
        postCount: cat._count.blogPosts
      }))
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching blog analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog analytics' },
      { status: 500 }
    )
  }
}