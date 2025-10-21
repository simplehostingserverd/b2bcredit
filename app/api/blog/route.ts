import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Helper function to trigger n8n automation
async function triggerN8nAutomation(event: string, data: any) {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

  if (!n8nWebhookUrl) {
    console.log('N8N webhook URL not configured, skipping automation')
    return
  }

  try {
    await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString(),
        source: 'b2b-credit-blog'
      })
    })
  } catch (error) {
    console.error('Failed to trigger n8n automation:', error)
    throw error
  }
}

// GET /api/blog - List all published blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {
      status: 'PUBLISHED',
      publishedAt: {
        lte: new Date()
      }
    }

    if (category) {
      where.category = {
        slug: category
      }
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
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ])

    // Calculate reading time for each post
    const postsWithReadingTime = posts.map(post => ({
      ...post,
      readingTime: Math.ceil(post.content.split(' ').length / 200) // Assume 200 words per minute
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
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create a new blog post (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role

    if (!session || (userRole !== 'ADMIN' && userRole !== 'STAFF')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Staff access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      categoryId,
      tags,
      status,
      publishedAt,
      scheduledFor,
      metaTitle,
      metaDescription,
      canonicalUrl
    } = body

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Calculate reading time
    const readingTime = Math.ceil(content.split(' ').length / 200)

    // Create JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: excerpt,
      author: {
        '@type': 'Person',
        name: session.user?.name || 'Admin'
      },
      datePublished: publishedAt || new Date().toISOString(),
      ...(featuredImage && { image: featuredImage })
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        featuredImage,
        categoryId,
        tags: tags || [],
        status,
        publishedAt: status === 'PUBLISHED' ? (publishedAt || new Date()) : null,
        scheduledFor,
        metaTitle,
        metaDescription,
        canonicalUrl,
        jsonLd,
        authorId: (session.user as any)?.id,
        readingTime
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        category: true
      }
    })

    // Trigger n8n automation if post is published
    if (status === 'PUBLISHED') {
      try {
        await triggerN8nAutomation('blog_post_published', {
          postId: blogPost.id,
          title: blogPost.title,
          slug: blogPost.slug,
          excerpt: blogPost.excerpt,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blogPost.slug}`,
          author: blogPost.author.name,
          publishedAt: blogPost.publishedAt,
          tags: blogPost.tags,
          featuredImage: blogPost.featuredImage
        })
      } catch (error) {
        console.error('Failed to trigger n8n automation:', error)
        // Don't fail the request if automation fails
      }
    }

    return NextResponse.json(blogPost, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}