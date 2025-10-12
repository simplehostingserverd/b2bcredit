'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function OnboardingStep1() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessType: '',
    yearsInOperation: '',
    currentCreditScore: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentStep: 'step-2',
        }),
      })

      if (response.ok) {
        router.push('/onboarding/step-2')
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
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Step 1 of 3</span>
            <span className="text-sm font-medium text-purple-400">20% Complete</span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-2.5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50" style={{ width: '20%' }}></div>
          </div>
        </div>

        {/* Card with glow effect */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Let's Get Started! 🚀
                </h1>
              </div>
            </div>
            <p className="text-gray-400">
              Just a few quick questions to personalize your credit building journey.
              This takes less than 2 minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Type */}
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-2">
                What type of business do you have? *
              </label>
              <select
                id="businessType"
                required
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select business type</option>
                <option value="LLC">LLC</option>
                <option value="S-Corp">S-Corporation</option>
                <option value="C-Corp">C-Corporation</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Nonprofit">Nonprofit</option>
              </select>
            </div>

            {/* Years in Operation */}
            <div>
              <label htmlFor="yearsInOperation" className="block text-sm font-medium text-gray-300 mb-2">
                How many years have you been in business? *
              </label>
              <select
                id="yearsInOperation"
                required
                value={formData.yearsInOperation}
                onChange={(e) => setFormData({ ...formData, yearsInOperation: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select years</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1-2 years">1-2 years</option>
                <option value="2-5 years">2-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>

            {/* Current Credit Score */}
            <div>
              <label htmlFor="currentCreditScore" className="block text-sm font-medium text-gray-300 mb-2">
                Do you know your current business credit score? *
              </label>
              <select
                id="currentCreditScore"
                required
                value={formData.currentCreditScore}
                onChange={(e) => setFormData({ ...formData, currentCreditScore: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select range</option>
                <option value="No score yet">I don't have a business credit score yet</option>
                <option value="Below 500">Below 500</option>
                <option value="500-600">500-600</option>
                <option value="600-700">600-700</option>
                <option value="700+">700+</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>

            {/* Info Box */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-yellow-400">
                    <strong>Pro Tip:</strong> Users who complete their profile in the first 24 hours see results 50% faster!
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white font-medium transition-colors"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {loading ? 'Saving...' : 'Continue →'}
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
