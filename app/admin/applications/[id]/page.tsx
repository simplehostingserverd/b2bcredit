'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default function ApplicationDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [notes, setNotes] = useState('')

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
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/admin/applications/${id}`)
        if (response.ok) {
          const data = await response.json()
          setApplication(data)
        } else {
          setError('Failed to load application')
        }
      } catch (error) {
        console.error('Error fetching application:', error)
        setError('Failed to load application')
      } finally {
        setLoading(false)
      }
    }

    if (id && status === 'authenticated') {
      fetchApplication()
    }
  }, [id, status])

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    setError('')
    setSuccess('')

    try {
      const updateData: any = {
        status: newStatus,
      }

      if (newStatus === 'UNDER_REVIEW') {
        updateData.reviewedAt = new Date().toISOString()
      } else if (newStatus === 'APPROVED') {
        updateData.approvedAt = new Date().toISOString()
      } else if (newStatus === 'REJECTED') {
        updateData.rejectedAt = new Date().toISOString()
        if (notes) {
          updateData.rejectionReason = notes
        }
      }

      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updated = await response.json()
        setApplication(updated)
        setSuccess(`Application ${newStatus.toLowerCase().replace('_', ' ')}`)
        setNotes('')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update application')
      }
    } catch (err) {
      setError('Failed to update application')
    } finally {
      setUpdating(false)
    }
  }

  const deleteApplication = async () => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return
    }

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        setError('Failed to delete application')
      }
    } catch (err) {
      setError('Failed to delete application')
    } finally {
      setUpdating(false)
    }
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

  if (!application) {
    return (
      <div className="min-h-screen stars-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-white">
            <p>Application not found</p>
            <Link href="/admin" className="text-purple-400 hover:text-purple-300">
              Back to admin dashboard
            </Link>
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
    }
    return colors[status] || colors.DRAFT
  }

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Admin Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">{application.businessName}</h1>
              <p className="text-white/70 mt-2">
                Application ID: {application.id}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <div className="card-dark rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Business Information</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/70">Business Name</p>
                  <p className="text-white font-medium">{application.businessName}</p>
                </div>
                <div>
                  <p className="text-white/70">Business Type</p>
                  <p className="text-white font-medium">{application.businessType?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-white/70">EIN</p>
                  <p className="text-white font-medium">{application.ein || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/70">Industry</p>
                  <p className="text-white font-medium">{application.industry || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/70">Date Established</p>
                  <p className="text-white font-medium">
                    {application.dateEstablished ? new Date(application.dateEstablished).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Address */}
            {(application.businessAddress || application.businessCity) && (
              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Business Address</h2>
                <div className="text-white">
                  <p>{application.businessAddress}</p>
                  <p>{application.businessCity}, {application.businessState} {application.businessZip}</p>
                </div>
              </div>
            )}

            {/* Financial Information */}
            <div className="card-dark rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Financial Information</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/70">Annual Revenue</p>
                  <p className="text-white font-medium text-lg">
                    {application.annualRevenue ? `$${application.annualRevenue.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-white/70">Monthly Revenue</p>
                  <p className="text-white font-medium text-lg">
                    {application.monthlyRevenue ? `$${application.monthlyRevenue.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-white/70">Credit Score</p>
                  <p className="text-white font-medium text-lg">{application.creditScore || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/70">Existing Debt</p>
                  <p className="text-white font-medium text-lg">
                    {application.existingDebt ? `$${application.existingDebt.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Funding Request */}
            <div className="card-dark rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Funding Request</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm">Requested Amount</p>
                  <p className="text-white font-bold text-3xl">
                    {application.fundingAmount ? `$${application.fundingAmount.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Purpose</p>
                  <p className="text-white">{application.fundingPurpose || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            {application.documents && application.documents.length > 0 && (
              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Uploaded Documents</h2>
                <div className="space-y-3">
                  {application.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-white font-medium">{doc.name}</p>
                          <p className="text-white/70 text-sm">{doc.type}</p>
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                      >
                        View →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="card-dark rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-white/70 text-sm">Name</p>
                  <p className="text-white">{application.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Email</p>
                  <a href={`mailto:${application.user?.email}`} className="text-purple-400 hover:text-purple-300">
                    {application.user?.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card-dark rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Timeline</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-white/70">Created</p>
                  <p className="text-white">{new Date(application.createdAt).toLocaleString()}</p>
                </div>
                {application.submittedAt && (
                  <div>
                    <p className="text-white/70">Submitted</p>
                    <p className="text-white">{new Date(application.submittedAt).toLocaleString()}</p>
                  </div>
                )}
                {application.reviewedAt && (
                  <div>
                    <p className="text-white/70">Reviewed</p>
                    <p className="text-white">{new Date(application.reviewedAt).toLocaleString()}</p>
                  </div>
                )}
                {application.approvedAt && (
                  <div>
                    <p className="text-white/70">Approved</p>
                    <p className="text-white">{new Date(application.approvedAt).toLocaleString()}</p>
                  </div>
                )}
                {application.rejectedAt && (
                  <div>
                    <p className="text-white/70">Rejected</p>
                    <p className="text-white">{new Date(application.rejectedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Actions */}
            <div className="card-dark rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Update Status</h2>
              <div className="space-y-3">
                {application.status !== 'UNDER_REVIEW' && (
                  <Button
                    onClick={() => updateStatus('UNDER_REVIEW')}
                    isLoading={updating}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    Mark as Under Review
                  </Button>
                )}
                {application.status !== 'APPROVED' && (
                  <Button
                    onClick={() => updateStatus('APPROVED')}
                    isLoading={updating}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Approve Application
                  </Button>
                )}
                {application.status !== 'REJECTED' && (
                  <div className="space-y-2">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Rejection reason (optional)"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm"
                      rows={3}
                    />
                    <Button
                      onClick={() => updateStatus('REJECTED')}
                      isLoading={updating}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Reason */}
            {application.rejectionReason && (
              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Rejection Reason</h2>
                <p className="text-white/90">{application.rejectionReason}</p>
              </div>
            )}

            {/* Danger Zone */}
            <div className="card-dark rounded-2xl p-6 border border-red-500/30">
              <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
              <Button
                onClick={deleteApplication}
                isLoading={updating}
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Delete Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
