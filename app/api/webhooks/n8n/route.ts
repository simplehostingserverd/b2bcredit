import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/webhooks/n8n - n8n webhook for blog events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    console.log(`n8n webhook triggered: ${event}`, data)

    switch (event) {
      case 'blog_post_published':
        await handleBlogPostPublished(data)
        break
      case 'blog_post_updated':
        await handleBlogPostUpdated(data)
        break
      case 'seo_check':
        await handleSEOCheck(data)
        break
      default:
        console.log(`Unhandled n8n event: ${event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('n8n webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleBlogPostPublished(data: any) {
  const { postId, title, slug, excerpt, author } = data

  // Trigger social media automation
  await triggerSocialMediaPosting(data)

  // Trigger newsletter automation
  await triggerNewsletterAutomation(data)

  // Update SEO tracking
  await updateSEOMetrics(data)

  console.log(`Blog post published automation triggered: ${title}`)
}

async function handleBlogPostUpdated(data: any) {
  const { postId, changes } = data

  // Check if significant changes were made
  if (changes.includes('content') || changes.includes('title')) {
    // Re-run SEO analysis
    await triggerSEOAnalysis(data)

    // Update social media posts if needed
    await updateSocialMediaPosts(data)
  }

  console.log(`Blog post updated automation triggered: ${postId}`)
}

async function handleSEOCheck(data: any) {
  const { postId } = data

  // Run SEO analysis
  const seoResults = await runSEOAnalysis(postId)

  // Send results to n8n for processing
  await sendToN8n('seo_analysis_complete', { postId, results: seoResults })

  console.log(`SEO check completed for post: ${postId}`)
}

async function triggerSocialMediaPosting(postData: any) {
  // Send to n8n for social media automation
  await sendToN8n('social_media_post', {
    platform: 'auto', // Let n8n decide which platforms
    content: {
      title: postData.title,
      excerpt: postData.excerpt,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${postData.slug}`,
      author: postData.author
    }
  })
}

async function triggerNewsletterAutomation(postData: any) {
  // Send to n8n for newsletter automation
  await sendToN8n('newsletter_content', {
    type: 'new_blog_post',
    post: postData
  })
}

async function updateSEOMetrics(postData: any) {
  // Track SEO metrics for the post
  await sendToN8n('seo_metrics_update', {
    postId: postData.postId,
    action: 'published',
    timestamp: new Date().toISOString()
  })
}

async function triggerSEOAnalysis(postData: any) {
  // Trigger comprehensive SEO analysis
  await sendToN8n('seo_analysis', {
    postId: postData.postId,
    priority: 'normal'
  })
}

async function updateSocialMediaPosts(postData: any) {
  // Update existing social media posts
  await sendToN8n('social_media_update', {
    postId: postData.postId,
    changes: postData.changes
  })
}

async function runSEOAnalysis(postId: string) {
  // This would run comprehensive SEO analysis
  // For now, return a placeholder
  return {
    score: 85,
    issues: [],
    recommendations: []
  }
}

async function sendToN8n(event: string, data: any) {
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
    console.error('Failed to send data to n8n:', error)
  }
}