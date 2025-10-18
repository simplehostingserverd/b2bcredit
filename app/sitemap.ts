import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'

  // Get all published blog posts
  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: {
        lte: new Date()
      }
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true
    },
    orderBy: { publishedAt: 'desc' }
  })

  // Get all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true
    }
  })

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Add category pages
    ...categories.map((category) => ({
      url: `${baseUrl}/blog?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Add blog post pages
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  return sitemapEntries
}
