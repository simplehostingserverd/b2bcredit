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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SUBMITTED: 'bg-blue-100 text-blue-800',
      UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      FUNDED: 'bg-purple-100 text-purple-800',
    }
    return colors[status] || colors.DRAFT
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your funding application and track your progress
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Application Status</p>
                <p className="text-2xl font-bold text-gray-900">
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
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Funding Requested</p>
                <p className="text-2xl font-bold text-gray-900">
                  {application?.fundingAmount
                    ? `$${application.fundingAmount.toLocaleString()}`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Business</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {application?.businessName || 'Not Set'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {!application ? (
          <Card title="Get Started with Your Application">
            <p className="text-gray-600 mb-6">
              Begin your funding journey by completing your business application.
              Our streamlined process makes it easy to apply for the capital you need.
            </p>
            <Link href="/application">
              <Button size="lg">Start Application</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card title="Your Application">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="font-medium">{application.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Type</p>
                    <p className="font-medium">{application.businessType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Industry</p>
                    <p className="font-medium">{application.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Annual Revenue</p>
                    <p className="font-medium">
                      {application.annualRevenue
                        ? `$${application.annualRevenue.toLocaleString()}`
                        : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-4">
                    {application.status === 'DRAFT' && (
                      <>
                        <Link href="/application">
                          <Button>Continue Application</Button>
                        </Link>
                        <Link href="/application/review">
                          <Button variant="outline">Review & Submit</Button>
                        </Link>
                      </>
                    )}
                    {application.status === 'SUBMITTED' && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                        Your application is under review. We&apos;ll contact you soon!
                      </div>
                    )}
                    {application.status === 'APPROVED' && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        Congratulations! Your application has been approved.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Next Steps">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-gray-600">Your application is being reviewed by our team</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Verification</p>
                    <p className="text-sm text-gray-600">We&apos;ll verify your business information</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Approval & Funding</p>
                    <p className="text-sm text-gray-600">Get approved and receive your funds</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
