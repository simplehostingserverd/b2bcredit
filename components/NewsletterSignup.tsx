'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'card'
  className?: string
  title?: string
  description?: string
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'card',
  className = '',
  title = 'Stay Updated',
  description = 'Get the latest insights on business formation and funding delivered to your inbox.'
}) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          name,
          source: 'blog'
        })
      })

      if (response.ok) {
        setIsSuccess(true)
        setEmail('')
        setName('')
        if (typeof window !== 'undefined' && window.rybbit) {
          window.rybbit.event('newsletter_subscribed', { source: 'blog' })
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to subscribe')
        if (typeof window !== 'undefined' && window.rybbit) {
          window.rybbit.event('newsletter_subscribe_failed', { error: errorData.error })
        }
      }
    } catch (error) {
      setError('Failed to subscribe. Please try again.')
      if (typeof window !== 'undefined' && window.rybbit) {
        window.rybbit.event('newsletter_subscribe_error', { error: 'System error' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === 'inline') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting || !email}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? '...' : 'Subscribe'}
        </button>
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <div className={`card-dark rounded-xl p-6 ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/70">{description}</p>
        </div>

        {isSuccess ? (
          <div className="text-center py-4">
            <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-400 font-semibold">Successfully subscribed!</p>
            <p className="text-white/70 text-sm mt-1">Check your email for confirmation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-semibold"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Updates'}
            </button>

            <p className="text-white/50 text-xs text-center">
              No spam, unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    )
  }

  // Default card variant
  return (
    <div className={`card-dark rounded-xl p-6 ${className}`}>
      <div className="text-center">
        <svg className="w-12 h-12 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>

        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/70 mb-6">{description}</p>

        {isSuccess ? (
          <div className="py-4">
            <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-400 font-semibold">Successfully subscribed!</p>
            <p className="text-white/70 text-sm mt-1">Check your email for confirmation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>

            <p className="text-white/50 text-xs text-center">
              Join 1,000+ entrepreneurs getting weekly insights
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default NewsletterSignup