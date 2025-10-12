'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function OnboardingStep3() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    creditGoal: '',
    painPoints: [] as string[],
    preferredCommunication: 'email',
    referralSource: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const togglePainPoint = (point: string) => {
    setFormData(prev => ({
      ...prev,
      painPoints: prev.painPoints.includes(point)
        ? prev.painPoints.filter(p => p !== point)
        : [...prev.painPoints, point]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentStep: 'completed',
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save progress')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const painPointOptions = [
    { id: 'high-interest', label: 'High Interest Rates', icon: '💸' },
    { id: 'limited-history', label: 'Limited Credit History', icon: '📊' },
    { id: 'getting-denied', label: 'Getting Denied for Loans', icon: '❌' },
    { id: 'low-limits', label: 'Low Credit Limits', icon: '🔒' },
    { id: 'personal-guarantee', label: 'Personal Guarantee Required', icon: '✍️' },
    { id: 'no-tradelines', label: 'No Vendor Trade Lines', icon: '🔗' },
  ]

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Step 3 of 3</span>
            <span className="text-sm font-medium text-purple-400">60% Complete</span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-2.5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Card with glow effect */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Your Credit Goals 🎯
                </h1>
              </div>
            </div>
            <p className="text-gray-400">
              Help us personalize your roadmap by sharing your credit building goals and challenges.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Credit Goal */}
            <div>
              <label htmlFor="creditGoal" className="block text-sm font-medium text-gray-300 mb-3">
                What's your primary credit goal? *
              </label>
              <select
                id="creditGoal"
                required
                value={formData.creditGoal}
                onChange={(e) => setFormData({ ...formData, creditGoal: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select your goal</option>
                <option value="Seeking $25K-$50K loan">Seeking $25K-$50K loan</option>
                <option value="Seeking $50K-$100K loan">Seeking $50K-$100K loan</option>
                <option value="Seeking $100K+ loan">Seeking $100K+ loan</option>
                <option value="Build credit score to 680+">Build credit score to 680+</option>
                <option value="Get better interest rates">Get better interest rates</option>
                <option value="Establish business credit">Establish business credit from scratch</option>
                <option value="Separate personal from business">Separate personal from business credit</option>
              </select>
            </div>

            {/* Pain Points */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                What challenges are you facing? (Select all that apply) *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {painPointOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => togglePainPoint(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      formData.painPoints.includes(option.id)
                        ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                        : 'border-gray-700 bg-slate-900/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className={`text-sm font-medium ${
                        formData.painPoints.includes(option.id) ? 'text-purple-300' : 'text-gray-300'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Communication */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                How do you prefer to receive updates? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredCommunication: 'email' })}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    formData.preferredCommunication === 'email'
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                      : 'border-gray-700 bg-slate-900/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className={`w-6 h-6 ${formData.preferredCommunication === 'email' ? 'text-purple-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className={`text-sm font-medium ${formData.preferredCommunication === 'email' ? 'text-purple-300' : 'text-gray-300'}`}>Email</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredCommunication: 'sms' })}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    formData.preferredCommunication === 'sms'
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                      : 'border-gray-700 bg-slate-900/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className={`w-6 h-6 ${formData.preferredCommunication === 'sms' ? 'text-purple-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className={`text-sm font-medium ${formData.preferredCommunication === 'sms' ? 'text-purple-300' : 'text-gray-300'}`}>SMS</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Referral Source */}
            <div>
              <label htmlFor="referralSource" className="block text-sm font-medium text-gray-300 mb-3">
                How did you hear about us? (Optional)
              </label>
              <select
                id="referralSource"
                value={formData.referralSource}
                onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select source</option>
                <option value="Google Search">Google Search</option>
                <option value="Social Media">Social Media</option>
                <option value="Referral">Friend/Colleague Referral</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Blog/Article">Blog/Article</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Almost There!</h3>
                  <p className="text-gray-300 text-sm">Complete this final step to unlock your personalized credit roadmap and start building your business credit today.</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push('/onboarding/step-2')}
                className="text-gray-400 hover:text-white font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                type="submit"
                disabled={loading || formData.painPoints.length === 0}
                className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white px-10 py-4 rounded-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 text-lg"
              >
                {loading ? 'Saving...' : 'Complete Setup ✨'}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Need help? <a href="/support" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Contact support</a>
        </p>
      </div>
    </div>
  )
}
