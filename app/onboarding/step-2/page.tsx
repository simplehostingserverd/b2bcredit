'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function OnboardingStep2() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [serviceType, setServiceType] = useState<'formation' | 'funding' | ''>('')
  const [formData, setFormData] = useState({
    // Funding fields
    einNumber: '',
    einUploaded: false,
    // Formation fields
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    startupFundingNeeded: '',
  })

  useEffect(() => {
    // Get service type from previous step (you might want to store this in session storage or API)
    const savedServiceType = sessionStorage.getItem('serviceType') as 'formation' | 'funding' | ''
    if (savedServiceType) {
      setServiceType(savedServiceType)
    }
  }, [])

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
          einUploaded: formData.einNumber.length > 0,
          currentStep: 'step-3',
        }),
      })

      if (response.ok) {
        router.push('/onboarding/step-3')
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Step 2 of 3</span>
            <span className="text-sm font-medium text-purple-400">40% Complete</span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-2.5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* Card with glow effect */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {serviceType === 'formation' ? 'Business Details 📋' : 'Upload Your EIN 📄'}
                </h1>
              </div>
            </div>
            <p className="text-gray-400">
              {serviceType === 'formation'
                ? 'Tell us more about your business location and contact information.'
                : 'Your Employer Identification Number helps us establish your business credit profile with major bureaus.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Formation Fields */}
            {serviceType === 'formation' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Business Address *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      value={formData.businessAddress}
                      onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={formData.businessCity}
                        onChange={(e) => setFormData({ ...formData, businessCity: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        required
                        value={formData.businessState}
                        onChange={(e) => setFormData({ ...formData, businessState: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      required
                      maxLength={5}
                      value={formData.businessZip}
                      onChange={(e) => setFormData({ ...formData, businessZip: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This will be your registered business address</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Primary Owner Information *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="startupFundingNeeded" className="block text-sm font-medium text-gray-300 mb-2">
                    Will you need startup funding? *
                  </label>
                  <select
                    id="startupFundingNeeded"
                    required
                    value={formData.startupFundingNeeded}
                    onChange={(e) => setFormData({ ...formData, startupFundingNeeded: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select funding need</option>
                    <option value="Yes - Immediately">Yes - Immediately after formation</option>
                    <option value="Yes - Within 3 months">Yes - Within 3 months</option>
                    <option value="Yes - Within 6 months">Yes - Within 6 months</option>
                    <option value="Maybe later">Maybe later</option>
                    <option value="No">No - I'm self-funding</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">We can help you apply for funding after your business is formed</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-400">
                        <strong>What's next:</strong> We'll handle your EIN application, business registration, and all necessary filings with the state. You'll receive your formation documents within 5-10 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Funding Fields */}
            {serviceType === 'funding' && (
              <>
                {/* EIN Number */}
                <div>
                  <label htmlFor="einNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter Your EIN (XX-XXXXXXX) *
                  </label>
                  <input
                    type="text"
                    id="einNumber"
                    required
                    placeholder="12-3456789"
                    maxLength={10}
                    value={formData.einNumber}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^\d]/g, '')
                      if (value.length > 2) {
                        value = value.slice(0, 2) + '-' + value.slice(2, 9)
                      }
                      setFormData({ ...formData, einNumber: value })
                    }}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-300 mb-2">
                      <span className="text-purple-400 font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-green-400 font-medium">Bank-level security</p>
                      <p className="text-xs text-gray-400 mt-1">Your documents are encrypted and securely stored. We never share your information.</p>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-400">
                        <strong>Why we need this:</strong> Your EIN allows us to establish trade lines with vendors and build your business credit file with Dun & Bradstreet, Experian, and Equifax.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push('/onboarding/step-1')}
                className="text-gray-400 hover:text-white font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
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
