'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string
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
}

interface RelatedPostsProps {
  currentSlug: string
  className?: string
}

export default function RelatedPosts({ currentSlug, className = '' }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRelatedPosts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/${currentSlug}/related`)

      if (response.ok) {
        const data = await response.json()
        setRelatedPosts(data.relatedPosts || [])
      } else {
        console.error('Failed to fetch related posts')
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    } finally {
      setLoading(false)
    }
  }, [currentSlug])

  useEffect(() => {
    fetchRelatedPosts()
  }, [fetchRelatedPosts])

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <h3 className="text-2xl font-bold text-white">Related Posts</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/10 rounded-lg h-32 mb-3"></div>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedPosts.length === 0) {
    return null // Don't show section if no related posts
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-2xl font-bold text-white">Related Posts</h3>

      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <div className="card-dark rounded-xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
              {post.featuredImage && (
                <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="space-y-2">
                {post.category && (
                  <span className="inline-block bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                    {post.category.name}
                  </span>
                )}

                <h4 className="font-semibold text-white text-sm leading-tight line-clamp-2">
                  {post.title}
                </h4>

                <p className="text-white/60 text-xs line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-white/50 pt-2">
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Posts Link */}
      <div className="text-center pt-4">
        <Link href="/blog">
          <button className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors">
            View All Posts
          </button>
        </Link>
      </div>
    </div>
  )
}