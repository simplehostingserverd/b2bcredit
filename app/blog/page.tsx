'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import NewsletterSignup from '@/components/NewsletterSignup'

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
}

interface BlogResponse {
  posts: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function BlogPage() {
  const [data, setData] = useState<BlogResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)

        const response = await fetch(`/api/blog?${params}`)
        if (response.ok) {
          const blogData = await response.json()
          setData(blogData)
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [searchTerm])

  if (loading) {
    return (
      <div className="min-h-screen stars-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="text-center">
              <div className="h-12 bg-white/10 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-white/10 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card-dark rounded-xl p-6">
                  <div className="h-48 bg-white/10 rounded mb-4"></div>
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog & Resources
          </h1>
          <p className="text-xl text-white/70">
            Insights, tips, and guides for business owners and entrepreneurs
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {data?.posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="card-dark rounded-xl p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No Posts Found</h3>
              <p className="text-white/70">
                {searchTerm ? 'Try adjusting your search terms.' : 'Check back soon for new content!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="card-dark rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
                  {post.featuredImage && (
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      <span>{post.readingTime} min read</span>
                    </div>

                    {post.category && (
                      <span className="inline-block bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                        {post.category.name}
                      </span>
                    )}

                    <h3 className="text-xl font-semibold text-white leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-white/70 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-white/50">
                        By {post.author.name}
                      </span>
                      <span className="text-sm text-white/50">
                        {post.viewCount} views
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="flex justify-center mt-16 space-x-2">
            {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  // Handle pagination
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  page === data.pagination.page
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to stay updated?
            </h3>
            <p className="text-white/70 mb-6">
              Get the latest insights on business formation and funding delivered to your inbox.
            </p>
            <Link href="/register">
              <button className="bg-purple-600 text-white hover:bg-purple-700 btn-glow px-8 py-3 rounded-lg font-semibold">
                Get Started Today
              </button>
            </Link>
          </div>

          <div className="max-w-md mx-auto md:mx-0">
            <NewsletterSignup variant="card" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 text-white/70 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">B2B Credit Builder</h4>
              <p className="text-sm">
                Based in Wyoming - Simplifying business funding and credit building for entrepreneurs nationwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2024 B2B Credit Builder. All rights reserved. Wyoming, USA</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
