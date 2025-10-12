'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

export default function ReviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit application')
      }

      router.push('/dashboard?submitted=true')
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <p className="text-center text-gray-600">No application found. Please start your application first.</p>
            <div className="mt-4 text-center">
              <Button onClick={() => router.push('/application')}>Start Application</Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Your Application</h1>
          <p className="text-gray-600 mt-2">
            Please review all information before submitting
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Card title="Business Information">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Business Name</p>
                <p className="font-medium">{application.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Business Type</p>
                <p className="font-medium">{application.businessType.replace('_', ' ')}</p>
              </div>
              {application.ein && (
                <div>
                  <p className="text-sm text-gray-600">EIN</p>
                  <p className="font-medium">{application.ein}</p>
                </div>
              )}
              {application.dateEstablished && (
                <div>
                  <p className="text-sm text-gray-600">Date Established</p>
                  <p className="font-medium">
                    {new Date(application.dateEstablished).toLocaleDateString()}
                  </p>
                </div>
              )}
              {application.industry && (
                <div>
                  <p className="text-sm text-gray-600">Industry</p>
                  <p className="font-medium">{application.industry}</p>
                </div>
              )}
            </div>
          </Card>

          {application.businessAddress && (
            <Card title="Business Address">
              <p className="font-medium">
                {application.businessAddress}
                {application.businessCity && `, ${application.businessCity}`}
                {application.businessState && `, ${application.businessState}`}
                {application.businessZip && ` ${application.businessZip}`}
              </p>
            </Card>
          )}

          <Card title="Financial Information">
            <div className="grid md:grid-cols-2 gap-6">
              {application.annualRevenue && (
                <div>
                  <p className="text-sm text-gray-600">Annual Revenue</p>
                  <p className="font-medium">${application.annualRevenue.toLocaleString()}</p>
                </div>
              )}
              {application.monthlyRevenue && (
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="font-medium">${application.monthlyRevenue.toLocaleString()}</p>
                </div>
              )}
              {application.creditScore && (
                <div>
                  <p className="text-sm text-gray-600">Credit Score</p>
                  <p className="font-medium">{application.creditScore}</p>
                </div>
              )}
              {application.existingDebt && (
                <div>
                  <p className="text-sm text-gray-600">Existing Debt</p>
                  <p className="font-medium">${application.existingDebt.toLocaleString()}</p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Funding Request">
            <div className="space-y-4">
              {application.fundingAmount && (
                <div>
                  <p className="text-sm text-gray-600">Requested Amount</p>
                  <p className="text-2xl font-bold text-primary-600">
                    ${application.fundingAmount.toLocaleString()}
                  </p>
                </div>
              )}
              {application.fundingPurpose && (
                <div>
                  <p className="text-sm text-gray-600">Purpose</p>
                  <p className="font-medium">{application.fundingPurpose}</p>
                </div>
              )}
            </div>
          </Card>

          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
            <p className="font-medium mb-2">Before you submit:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Verify all information is accurate</li>
              <li>Make sure you have provided all required details</li>
              <li>Once submitted, you cannot edit your application</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/application')}
              variant="outline"
              size="lg"
            >
              Edit Application
            </Button>
            <Button
              onClick={handleSubmit}
              size="lg"
              isLoading={submitting}
              disabled={application.status !== 'DRAFT'}
            >
              {application.status === 'DRAFT' ? 'Submit Application' : 'Already Submitted'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
