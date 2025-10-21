'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'

interface ContentTopic {
  id: string
  topic: string
  category?: string
  primaryKeyword?: string
  secondaryKeywords: string[]
  searchVolume?: number
  difficulty?: number
  priority: number
  status: string
  keywords: Array<{
    keyword: string
    searchVolume?: number
    difficulty?: number
  }>
  blogPost?: {
    id: string
    title: string
    slug: string
    status: string
  }
  createdAt: string
}

export default function AutomationDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [topics, setTopics] = useState<ContentTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [discovering, setDiscovering] = useState(false)
  const [discoveryCount, setDiscoveryCount] = useState(10)

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
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/automation/topics/discover?limit=50')
      if (response.ok) {
        const data = await response.json()
        setTopics(data.topics || [])
      }
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDiscoverTopics = async () => {
    setDiscovering(true)
    try {
      const response = await fetch('/api/automation/topics/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: discoveryCount,
          source: 'trending'
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`✅ Discovered ${result.count} topics!`)
        fetchTopics() // Refresh list
      } else {
        const error = await response.json()
        alert(`❌ Discovery failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error discovering topics:', error)
      alert('❌ Discovery failed')
    } finally {
      setDiscovering(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      DISCOVERED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      PLANNED: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      IN_PROGRESS: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      PUBLISHED: 'bg-green-500/20 text-green-300 border-green-500/30',
      ARCHIVED: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    return colors[status] || colors.DISCOVERED
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 70) return 'text-green-400'
    if (priority >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen stars-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Blog Automation System</h1>
          <p className="text-white/70">
            Autonomous content discovery, generation, and distribution
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-dark rounded-xl p-6">
            <div className="text-white/70 text-sm mb-1">Total Topics</div>
            <div className="text-3xl font-bold text-white">{topics.length}</div>
          </div>
          <div className="card-dark rounded-xl p-6">
            <div className="text-white/70 text-sm mb-1">Discovered</div>
            <div className="text-3xl font-bold text-blue-400">
              {topics.filter(t => t.status === 'DISCOVERED').length}
            </div>
          </div>
          <div className="card-dark rounded-xl p-6">
            <div className="text-white/70 text-sm mb-1">In Progress</div>
            <div className="text-3xl font-bold text-orange-400">
              {topics.filter(t => t.status === 'IN_PROGRESS').length}
            </div>
          </div>
          <div className="card-dark rounded-xl p-6">
            <div className="text-white/70 text-sm mb-1">Published</div>
            <div className="text-3xl font-bold text-green-400">
              {topics.filter(t => t.status === 'PUBLISHED').length}
            </div>
          </div>
        </div>

        {/* Discovery Controls */}
        <div className="card-dark rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Topic Discovery</h2>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Number of topics</label>
              <input
                type="number"
                min="1"
                max="50"
                value={discoveryCount}
                onChange={(e) => setDiscoveryCount(parseInt(e.target.value))}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white w-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex-1"></div>
            <button
              onClick={handleDiscoverTopics}
              disabled={discovering}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {discovering ? (
                <>
                  <svg className="animate-spin inline-block -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Discovering...
                </>
              ) : (
                '🔍 Discover Topics'
              )}
            </button>
          </div>
        </div>

        {/* Topics Table */}
        <div className="card-dark rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Discovered Topics</h2>

          {topics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70 mb-4">No topics discovered yet</p>
              <button
                onClick={handleDiscoverTopics}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Discover Your First Topics
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Keywords
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {topics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{topic.topic}</div>
                        {topic.primaryKeyword && (
                          <div className="text-xs text-white/70 mt-1">
                            Primary: {topic.primaryKeyword}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {topic.keywords.slice(0, 3).map((kw, idx) => (
                            <span key={idx} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                              {kw.keyword}
                            </span>
                          ))}
                          {topic.keywords.length > 3 && (
                            <span className="text-xs text-white/50">
                              +{topic.keywords.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-2xl font-bold ${getPriorityColor(topic.priority)}`}>
                          {topic.priority}
                        </div>
                        <div className="text-xs text-white/50">Score</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(topic.status)}`}>
                          {topic.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          {topic.blogPost ? (
                            <a
                              href={`/admin/blog/edit/${topic.blogPost.slug}`}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              View Post
                            </a>
                          ) : (
                            <button className="text-purple-400 hover:text-purple-300 opacity-50 cursor-not-allowed">
                              Generate Content
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-dark rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">🤖 Active Agents</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">PlannerAgent</span>
                <span className="text-green-400">✓ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">WriterAgent</span>
                <span className="text-white/40">Coming Soon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">OptimizerAgent</span>
                <span className="text-white/40">Coming Soon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">PublisherAgent</span>
                <span className="text-white/40">Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="card-dark rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">📊 Performance Goals</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Traffic Increase Target</span>
                <span className="text-white">30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Leads per 1000 Visits</span>
                <span className="text-white">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Avg Dwell Time Target</span>
                <span className="text-white">90s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Content Quality (SEO)</span>
                <span className="text-white">80+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
