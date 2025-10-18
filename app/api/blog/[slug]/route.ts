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

// GET /api/blog/[slug] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        category: true
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Check if post is published or if user is admin
    if (post.status !== 'PUBLISHED' && post.publishedAt && post.publishedAt > new Date()) {
      const session = await getServerSession(authOptions)
      if (!session || (session.user as any)?.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        )
      }
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    })

    // Calculate reading time if not set
    const readingTime = post.readingTime || Math.ceil(post.content.split(' ').length / 200)

    return NextResponse.json({
      ...post,
      readingTime
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// PUT /api/blog/[slug] - Update a blog post (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const body = await request.json()
    const {
      title,
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

    // Find the existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Generate new slug if title changed
    let finalSlug = existingPost.slug
    if (title && title !== existingPost.title) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Calculate reading time
    const readingTime = Math.ceil(content.split(' ').length / 200)

    // Update JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title || existingPost.title,
      description: excerpt || existingPost.excerpt,
      author: {
        '@type': 'Person',
        name: session.user?.name || 'Admin'
      },
      datePublished: publishedAt || existingPost.publishedAt || new Date().toISOString(),
      ...(featuredImage && { image: featuredImage })
    }

    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...(title && { title }),
        ...(finalSlug !== existingPost.slug && { slug: finalSlug }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(categoryId !== undefined && { categoryId }),
        ...(tags && { tags }),
        ...(status && { status }),
        ...(publishedAt && { publishedAt }),
        ...(scheduledFor && { scheduledFor }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(canonicalUrl !== undefined && { canonicalUrl }),
        jsonLd,
        readingTime
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        category: true
      }
    })

    // Trigger n8n automation if post status changed to published
    if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
      try {
        await triggerN8nAutomation('blog_post_published', {
          postId: updatedPost.id,
          title: updatedPost.title,
          slug: updatedPost.slug,
          excerpt: updatedPost.excerpt,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${updatedPost.slug}`,
          author: updatedPost.author.name,
          publishedAt: updatedPost.publishedAt,
          tags: updatedPost.tags,
          featuredImage: updatedPost.featuredImage
        })
      } catch (error) {
        console.error('Failed to trigger n8n automation:', error)
        // Don't fail the request if automation fails
      }
    }

    // Trigger update automation if significant changes were made
    if ((content && content !== existingPost.content) ||
        (title && title !== existingPost.title)) {
      try {
        await triggerN8nAutomation('blog_post_updated', {
          postId: updatedPost.id,
          changes: [
            ...(content && content !== existingPost.content ? ['content'] : []),
            ...(title && title !== existingPost.title ? ['title'] : [])
          ]
        })
      } catch (error) {
        console.error('Failed to trigger update automation:', error)
      }
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[slug] - Delete a blog post (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params

    const post = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    await prisma.blogPost.delete({
      where: { slug }
    })

    return NextResponse.json({ message: 'Blog post deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}