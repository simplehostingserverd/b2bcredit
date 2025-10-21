'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import BlogEditor from '@/components/BlogEditor'
import BlogTemplates from '@/components/BlogTemplates'

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  categoryId?: string
  tags: string[]
  status: string
  publishedAt?: string
  scheduledFor?: string
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
}

export default function EditBlogPostPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [post, setPost] = useState<BlogPost | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categoryId: '',
    tags: [] as string[],
    status: 'DRAFT',
    publishedAt: '',
    scheduledFor: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: ''
  })

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
    if (slug) {
      fetchPost()
    }
    fetchCategories()
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`)
      if (response.ok) {
        const postData = await response.json()
        setPost(postData)
        setFormData({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          featuredImage: postData.featuredImage || '',
          categoryId: postData.categoryId || '',
          tags: postData.tags || [],
          status: postData.status,
          publishedAt: postData.publishedAt || '',
          scheduledFor: postData.scheduledFor || '',
          metaTitle: postData.metaTitle || '',
          metaDescription: postData.metaDescription || '',
          canonicalUrl: postData.canonicalUrl || ''
        })
      } else {
        alert('Failed to load blog post')
        router.push('/admin/blog')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('Failed to load blog post')
      router.push('/admin/blog')
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from title (only if slug hasn't been manually changed)
    if (field === 'title' && formData.slug === post?.slug) {
      const newSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }))
    }

    // Auto-generate meta title from title
    if (field === 'title' && !formData.metaTitle) {
      setFormData(prev => ({
        ...prev,
        metaTitle: value.slice(0, 60)
      }))
    }

    // Auto-generate meta description from excerpt
    if (field === 'excerpt' && !formData.metaDescription) {
      setFormData(prev => ({
        ...prev,
        metaDescription: value.slice(0, 160)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/blog')
      } else {
        const error = await response.json()
        alert(`Failed to update post: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen stars-bg">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="h-96 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
          <p className="text-white/70 mt-2">
            Update your blog post with SEO optimization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card-dark rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter post title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="post-url-slug"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Excerpt *
              </label>
              <textarea
                required
                rows={3}
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Brief description of the post..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="card-dark rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">SEO Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="SEO title (60 chars recommended)"
                  maxLength={60}
                />
                <div className="text-xs text-white/50 mt-1">
                  {formData.metaTitle.length}/60 characters
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={formData.canonicalUrl}
                  onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://yoursite.com/blog/post-slug"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="SEO description (160 chars recommended)"
                maxLength={160}
              />
              <div className="text-xs text-white/50 mt-1">
                {formData.metaDescription.length}/160 characters
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Content Editor - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Content</h2>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Content *
                  </label>
                  <BlogEditor
                    content={formData.content}
                    onChange={(content) => handleInputChange('content', content)}
                    placeholder="Start writing your SEO-optimized blog post..."
                  />
                </div>
              </div>
            </div>

            {/* Templates Sidebar - Takes up 1 column */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <BlogTemplates onTemplateSelect={(template) => handleInputChange('content', template)} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Update Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
