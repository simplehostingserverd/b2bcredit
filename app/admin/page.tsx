'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/Card'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
    const fetchData = async () => {
      try {
        const [appsResponse, leadsResponse] = await Promise.all([
          fetch('/api/admin/applications'),
          fetch('/api/admin/leads'),
        ])

        if (appsResponse.ok) {
          const appsData = await appsResponse.json()
          setApplications(appsData)
        }

        if (leadsResponse.ok) {
          const leadsData = await leadsResponse.json()
          setLeads(leadsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  const getStatusColor = (status: string) => {
    const colors: any = {
      DRAFT: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
      SUBMITTED: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      UNDER_REVIEW: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      APPROVED: 'bg-green-500/20 text-green-300 border border-green-500/30',
      REJECTED: 'bg-red-500/20 text-red-300 border border-red-500/30',
      FUNDED: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      NEW: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      CONTACTED: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      QUALIFIED: 'bg-green-500/20 text-green-300 border border-green-500/30',
      CONVERTED: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      LOST: 'bg-red-500/20 text-red-300 border border-red-500/30',
    }
    return colors[status] || colors.DRAFT
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen gradient-bg stars-bg">
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

  const stats = {
    totalApplications: applications.length,
    submitted: applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length,
    approved: applications.filter(a => a.status === 'APPROVED').length,
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'NEW').length,
    qualified: leads.filter(l => l.status === 'QUALIFIED').length,
  }

  return (
    <div className="min-h-screen gradient-bg stars-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/70 mt-2">
            Manage applications and leads
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card-dark rounded-xl p-4 text-center">
            <p className="text-sm text-white/70">Total Applications</p>
            <p className="text-3xl font-bold text-white">{stats.totalApplications}</p>
          </div>
          <div className="card-dark rounded-xl p-4 text-center">
            <p className="text-sm text-white/70">Pending Review</p>
            <p className="text-3xl font-bold text-blue-400">{stats.submitted}</p>
          </div>
          <div className="card-dark rounded-xl p-4 text-center">
            <p className="text-sm text-white/70">Approved</p>
            <p className="text-3xl font-bold text-green-400">{stats.approved}</p>
          </div>
          <div className="card-dark rounded-xl p-4 text-center">
            <p className="text-sm text-white/70">Total Leads</p>
            <p className="text-3xl font-bold text-white">{stats.totalLeads}</p>
          </div>
          <div className="card-dark rounded-xl p-4 text-center">
            <p className="text-sm text-white/70">New Leads</p>
            <p className="text-3xl font-bold text-blue-400">{stats.newLeads}</p>
          </div>
          <div className="card-dark rounded-xl p-4 text-center">
            <p className="text-sm text-white/70">Qualified</p>
            <p className="text-3xl font-bold text-green-400">{stats.qualified}</p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card-dark rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Applications</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Funding Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-white/70">
                      No applications yet
                    </td>
                  </tr>
                ) : (
                  applications.slice(0, 10).map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {app.businessName}
                        </div>
                        <div className="text-sm text-white/70">
                          {app.businessType.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{app.user.name}</div>
                        <div className="text-sm text-white/70">{app.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {app.fundingAmount
                          ? `$${app.fundingAmount.toLocaleString()}`
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                        {app.submittedAt
                          ? new Date(app.submittedAt).toLocaleDateString()
                          : 'Not submitted'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="card-dark rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Leads</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-white/70">
                      No leads yet
                    </td>
                  </tr>
                ) : (
                  leads.slice(0, 10).map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {lead.businessName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{lead.contactName}</div>
                        <div className="text-sm text-white/70">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                        {lead.industry || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
