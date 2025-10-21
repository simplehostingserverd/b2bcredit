'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { BusinessFormationForm } from '@/components/BusinessFormationForm'

export default function ApplicationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userServiceType, setUserServiceType] = useState<'formation' | 'funding' | null>(null)

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'LLC',
    ein: '',
    dateEstablished: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    industry: '',
    annualRevenue: '',
    monthlyRevenue: '',
    creditScore: '',
    existingDebt: '',
    fundingAmount: '',
    fundingPurpose: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    // Set service type from session data
    if (status === 'authenticated' && session?.user) {
      const serviceType = session.user.serviceType
      if (serviceType === 'formation' || serviceType === 'funding') {
        setUserServiceType(serviceType)
      } else {
        setUserServiceType(null)
      }
    }
  }, [status, session])

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch('/api/applications')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setFormData({
              businessName: data.businessName || '',
              businessType: data.businessType || 'LLC',
              ein: data.ein || '',
              dateEstablished: data.dateEstablished
                ? new Date(data.dateEstablished).toISOString().split('T')[0]
                : '',
              businessAddress: data.businessAddress || '',
              businessCity: data.businessCity || '',
              businessState: data.businessState || '',
              businessZip: data.businessZip || '',
              industry: data.industry || '',
              annualRevenue: data.annualRevenue?.toString() || '',
              monthlyRevenue: data.monthlyRevenue?.toString() || '',
              creditScore: data.creditScore?.toString() || '',
              existingDebt: data.existingDebt?.toString() || '',
              fundingAmount: data.fundingAmount?.toString() || '',
              fundingPurpose: data.fundingPurpose || '',
            })
          }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      const payload = {
        ...formData,
        annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : undefined,
        monthlyRevenue: formData.monthlyRevenue ? parseFloat(formData.monthlyRevenue) : undefined,
        creditScore: formData.creditScore ? parseInt(formData.creditScore) : undefined,
        existingDebt: formData.existingDebt ? parseFloat(formData.existingDebt) : undefined,
        fundingAmount: formData.fundingAmount ? parseFloat(formData.fundingAmount) : undefined,
      }

      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save application')
      }

      setSuccess(true)
      if (typeof window !== 'undefined' && window.rybbit) {
        window.rybbit.event('application_saved', { 
          businessType: formData.businessType,
          fundingAmount: formData.fundingAmount ? parseFloat(formData.fundingAmount) : undefined
        })
      }
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
      if (typeof window !== 'undefined' && window.rybbit) {
        window.rybbit.event('application_save_error', { error: err.message })
      }
    } finally {
      setSaving(false)
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

  // Show different forms based on service type
  if (userServiceType === 'formation') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BusinessFormationForm initialData={{
            businessName: formData.businessName,
            businessStructure: formData.businessType,
            stateOfFormation: formData.businessState,
            businessIndustry: formData.industry,
          }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Funding Application</h1>
          <p className="text-gray-600 mt-2">
            Complete your application to access business funding opportunities
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            Application saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card title="Business Information">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="LLC">LLC</option>
                  <option value="CORPORATION">Corporation</option>
                  <option value="S_CORPORATION">S Corporation</option>
                  <option value="NON_PROFIT">Non-Profit</option>
                </select>
              </div>

              <Input
                label="EIN (Tax ID)"
                name="ein"
                value={formData.ein}
                onChange={handleChange}
                placeholder="XX-XXXXXXX"
              />

              <Input
                label="Date Established"
                name="dateEstablished"
                type="date"
                value={formData.dateEstablished}
                onChange={handleChange}
              />

              <Input
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., Technology, Retail"
              />
            </div>
          </Card>

          <Card title="Business Address">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="City"
                name="businessCity"
                value={formData.businessCity}
                onChange={handleChange}
              />

              <Input
                label="State"
                name="businessState"
                value={formData.businessState}
                onChange={handleChange}
                placeholder="e.g., CA"
              />

              <Input
                label="ZIP Code"
                name="businessZip"
                value={formData.businessZip}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card title="Financial Information">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Annual Revenue ($)"
                name="annualRevenue"
                type="number"
                value={formData.annualRevenue}
                onChange={handleChange}
                placeholder="500000"
              />

              <Input
                label="Monthly Revenue ($)"
                name="monthlyRevenue"
                type="number"
                value={formData.monthlyRevenue}
                onChange={handleChange}
                placeholder="50000"
              />

              <Input
                label="Business Credit Score"
                name="creditScore"
                type="number"
                value={formData.creditScore}
                onChange={handleChange}
                placeholder="650"
                min="0"
                max="850"
              />

              <Input
                label="Existing Debt ($)"
                name="existingDebt"
                type="number"
                value={formData.existingDebt}
                onChange={handleChange}
                placeholder="10000"
              />
            </div>
          </Card>

          <Card title="Funding Request">
            <div className="space-y-4">
              <Input
                label="Requested Funding Amount ($)"
                name="fundingAmount"
                type="number"
                value={formData.fundingAmount}
                onChange={handleChange}
                placeholder="100000"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Purpose
                </label>
                <textarea
                  name="fundingPurpose"
                  value={formData.fundingPurpose}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe how you plan to use the funding..."
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" isLoading={saving}>
              Save Progress
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push('/application/review')}
            >
              Review & Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
