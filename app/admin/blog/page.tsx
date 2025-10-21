'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  status: string
  publishedAt: string | null
  viewCount: number
  readingTime: number | null
  author: {
    name: string
  }
  category?: {
    name: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    blogPosts: number
  }
}

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role
      if (userRole !== 'ADMIN' && userRole !== 'STAFF') {
        router.push('/dashboard')
      }
    }
  }, [status, session, router])

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [filter, search])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/blog?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      DRAFT: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
      PUBLISHED: 'bg-green-500/20 text-green-300 border border-green-500/30',
      SCHEDULED: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    }
    return colors[status] || colors.DRAFT
  }

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPosts()
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  const handleStatusChange = async (slug: string, newStatus: string) => {
    try {
      const post = posts.find(p => p.slug === slug)
      if (!post) return

      const updateData: any = { status: newStatus }
      if (newStatus === 'PUBLISHED' && !post.publishedAt) {
        updateData.publishedAt = new Date().toISOString()
      }

      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        fetchPosts()
      } else {
        alert('Failed to update post status')
      }
    } catch (error) {
      console.error('Error updating post status:', error)
      alert('Failed to update post status')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen stars-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="h-48 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Blog Management</h1>
            <p className="text-white/70 mt-2">
              Create and manage your blog posts
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/blog/create')}
            className="bg-purple-600 text-white hover:bg-purple-700 btn-glow px-6 py-3 rounded-lg font-semibold"
          >
            Create New Post
          </button>
        </div>

        {/* Filters and Search */}
        <div className="card-dark rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Posts</option>
                <option value="DRAFT">Drafts</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="card-dark rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-white/70">
                      No blog posts found
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-white">
                            {post.title}
                          </div>
                          <div className="text-sm text-white/70">
                            by {post.author.name}
                          </div>
                          <div className="text-xs text-white/50">
                            {post.readingTime} min read
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {post.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {post.viewCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : 'Not published'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/admin/blog/edit/${post.slug}`)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            Edit
                          </button>
                          {post.status === 'DRAFT' && (
                            <button
                              onClick={() => handleStatusChange(post.slug, 'PUBLISHED')}
                              className="text-green-400 hover:text-green-300"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePost(post.slug)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories Section */}
        <div className="card-dark rounded-2xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold">{category.name}</h3>
                <p className="text-white/70 text-sm mt-1">
                  {category._count.blogPosts} posts
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}