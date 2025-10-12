import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blog/[slug]/related - Get related blog posts
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const limit = 3 // Number of related posts to return

    // Get the current post to find related posts based on category and tags
    const currentPost = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        categoryId: true,
        tags: true
      }
    })

    if (!currentPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Find related posts based on category and tags
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        AND: [
          { slug: { not: slug } }, // Exclude current post
          { status: 'PUBLISHED' },
          { publishedAt: { lte: new Date() } },
          {
            OR: [
              // Same category
              { categoryId: currentPost.categoryId },
              // Same tags
              ...currentPost.tags.map(tag => ({
                tags: { has: tag }
              }))
            ]
          }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        readingTime: true,
        viewCount: true,
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true, slug: true }
        },
        tags: true
      },
      orderBy: [
        // Prioritize same category posts
        { categoryId: currentPost.categoryId ? 'desc' : 'asc' },
        { publishedAt: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json({ relatedPosts })
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related posts' },
      { status: 500 }
    )
  }
}