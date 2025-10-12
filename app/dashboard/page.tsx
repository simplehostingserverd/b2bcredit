'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch('/api/applications')
        if (response.ok) {
          const data = await response.json()
          setApplication(data)
        }
      } catch (error) {
        console.error('Error fetching application:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchApplication()
    }
  }, [status])

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

  const getStatusColor = (status: string) => {
    const colors: any = {
      DRAFT: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
      SUBMITTED: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      UNDER_REVIEW: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      APPROVED: 'bg-green-500/20 text-green-300 border border-green-500/30',
      REJECTED: 'bg-red-500/20 text-red-300 border border-red-500/30',
      FUNDED: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    }
    return colors[status] || colors.DRAFT
  }

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-white/70 mt-2">
            Manage your funding application and track your progress
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/70">Application Status</p>
                <p className="text-xl font-bold text-white">
                  {application ? (
                    <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ')}
                    </span>
                  ) : (
                    'Not Started'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/70">Funding Requested</p>
                <p className="text-2xl font-bold text-white">
                  {application?.fundingAmount
                    ? `$${application.fundingAmount.toLocaleString()}`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/70">Business</p>
                <p className="text-lg font-bold text-white truncate">
                  {application?.businessName || 'Not Set'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!application ? (
          <div className="card-dark rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Get Started with Your Application</h2>
            <p className="text-white/70 mb-6">
              Begin your funding journey by completing your business application.
              Our streamlined process makes it easy to apply for the capital you need.
            </p>
            <Link href="/application">
              <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700 btn-glow">Start Application</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card-dark rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Application</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-white/70">Business Name</p>
                    <p className="font-medium text-white">{application.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Business Type</p>
                    <p className="font-medium text-white">{application.businessType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Industry</p>
                    <p className="font-medium text-white">{application.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Annual Revenue</p>
                    <p className="font-medium text-white">
                      {application.annualRevenue
                        ? `$${application.annualRevenue.toLocaleString()}`
                        : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex gap-4">
                    {application.status === 'DRAFT' && (
                      <>
                        <Link href="/application">
                          <Button className="bg-purple-600 text-white hover:bg-purple-700 btn-glow">Continue Application</Button>
                        </Link>
                        <Link href="/application/review">
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Review & Submit</Button>
                        </Link>
                      </>
                    )}
                    {application.status === 'SUBMITTED' && (
                      <div className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg">
                        Your application is under review. We&apos;ll contact you soon!
                      </div>
                    )}
                    {application.status === 'APPROVED' && (
                      <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg">
                        Congratulations! Your application has been approved.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-dark rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white">Application Submitted</p>
                    <p className="text-sm text-white/70">Your application is being reviewed by our team</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-white/40 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white">Verification</p>
                    <p className="text-sm text-white/70">We&apos;ll verify your business information</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-white/40 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white">Approval & Funding</p>
                    <p className="text-sm text-white/70">Get approved and receive your funds</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
