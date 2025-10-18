import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware/rbac'

export async function GET() {
  try {
    const { user, error } = await requireAdmin()
    if (error) return error

    // Gather system statistics
    const [
      userCount,
      leadCount,
      applicationCount,
      blogPostCount,
      subscriberCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.lead.count(),
      prisma.application.count(),
      prisma.blogPost.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ])

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const [
      recentUsers,
      recentLeads,
      recentApplications,
      recentBlogPosts,
    ] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.application.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.blogPost.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ])

    // Application statistics
    const applicationStats = await prisma.application.groupBy({
      by: ['status'],
      _count: true,
    })

    // Lead statistics
    const leadStats = await prisma.lead.groupBy({
      by: ['status'],
      _count: true,
    })

    return NextResponse.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      statistics: {
        total: {
          users: userCount,
          leads: leadCount,
          applications: applicationCount,
          blogPosts: blogPostCount,
          subscribers: subscriberCount,
        },
        recent: {
          users: recentUsers,
          leads: recentLeads,
          applications: recentApplications,
          blogPosts: recentBlogPosts,
        },
        applications: {
          byStatus: applicationStats.map(s => ({
            status: s.status,
            count: s._count,
          })),
        },
        leads: {
          byStatus: leadStats.map(s => ({
            status: s.status,
            count: s._count,
          })),
        },
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: 'MB',
        },
      },
    })
  } catch (error) {
    console.error('Status check failed:', error)

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Failed to gather system statistics',
      },
      { status: 500 }
    )
  }
}
