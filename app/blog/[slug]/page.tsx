import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import SocialShare from '@/components/SocialShare'
import RelatedPosts from '@/components/RelatedPosts'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  publishedAt: string
  readingTime: number
  viewCount: number
  author: {
    name: string
  }
  category?: {
    name: string
    slug: string
  }
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  jsonLd?: any
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'
    const response = await fetch(`${baseUrl}/api/blog/${params.slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })

    if (!response.ok) {
      return {
        title: 'Blog Post Not Found | B2B Credit Builder'
      }
    }

    const post: BlogPost = await response.json()

    return {
      title: post.metaTitle || `${post.title} | B2B Credit Builder`,
      description: post.metaDescription || post.excerpt,
      keywords: post.tags?.join(', '),
      authors: [{ name: post.author.name }],
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        url: `${baseUrl}/blog/${post.slug}`,
        siteName: 'B2B Credit Builder',
        images: post.featuredImage ? [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
        locale: 'en_US',
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.publishedAt,
        authors: [post.author.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
      alternates: {
        canonical: `${baseUrl}/blog/${post.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog | B2B Credit Builder'
    }
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'

  try {
    const response = await fetch(`${baseUrl}/api/blog/${params.slug}`, {
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      notFound()
    }

    const post: BlogPost = await response.json()

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              image: post.featuredImage,
              author: {
                '@type': 'Person',
                name: post.author.name,
              },
              publisher: {
                '@type': 'Organization',
                name: 'B2B Credit Builder',
                logo: {
                  '@type': 'ImageObject',
                  url: `${baseUrl}/logo.png`,
                },
              },
              datePublished: post.publishedAt,
              dateModified: post.publishedAt,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${baseUrl}/blog/${post.slug}`,
              },
              ...(post.category && {
                articleSection: post.category.name,
              }),
              ...(post.tags && post.tags.length > 0 && {
                keywords: post.tags.join(', '),
              }),
            })
          }}
        />

        <div className="min-h-screen stars-bg">
          <Navbar />

          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Back to Blog */}
            <div className="mb-8">
              <Link href="/blog" className="text-purple-400 hover:text-purple-300 transition-colors">
                ← Back to Blog
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-12">
              {post.featuredImage && (
                <div className="relative h-96 w-full mb-8 rounded-2xl overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="space-y-4">
                {post.category && (
                  <Link href={`/blog?category=${post.category.slug}`}>
                    <span className="inline-block bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm hover:bg-purple-500/30 transition-colors">
                      {post.category.name}
                    </span>
                  </Link>
                )}

                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  {post.title}
                </h1>

                <p className="text-xl text-white/80 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <span>By {post.author.name}</span>
                  <span>•</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span>•</span>
                  <span>{post.readingTime} min read</span>
                  <span>•</span>
                  <span>{post.viewCount} views</span>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-white/10 text-white/70 px-2 py-1 rounded text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <div
                className="text-white/90 leading-relaxed space-y-6"
                style={{
                  lineHeight: '1.8',
                  fontSize: '1.125rem'
                }}
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, '<br />')
                }}
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
                <div className="text-white/60 text-sm">
                  <p>Published on {new Date(post.publishedAt).toLocaleDateString()}</p>
                  <p className="mt-2">
                    <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Contact Author
                    </Link>
                  </p>
                </div>

                <div className="w-full md:w-auto">
                  <SocialShare
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    title={post.title}
                    description={post.excerpt}
                    variant="horizontal"
                  />
                </div>
              </div>

              {/* Related Posts */}
              <div className="mt-12">
                <RelatedPosts currentSlug={params.slug} />
              </div>

              {/* Newsletter Signup */}
              <div className="mt-12 p-6 bg-white/5 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Ready to Build Your Business Credit?
                </h3>
                <p className="text-white/70 mb-6">
                  Get expert guidance on business formation and funding. Join thousands of entrepreneurs who trust B2B Credit Builder.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/application" className="flex-1">
                    <button className="w-full bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                      Start Your Application
                    </button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <button className="w-full border border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors">
                      Subscribe to Updates
                    </button>
                  </Link>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error loading blog post:', error)
    notFound()
  }
}