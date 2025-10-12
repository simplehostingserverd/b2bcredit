'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

interface BusinessFormationFormProps {
  initialData?: {
    businessName?: string
    businessStructure?: string
    stateOfFormation?: string
    businessIndustry?: string
  }
}

export function BusinessFormationForm({ initialData = {} }: BusinessFormationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    businessName: initialData.businessName || '',
    businessStructure: initialData.businessStructure || '',
    stateOfFormation: initialData.stateOfFormation || '',
    businessIndustry: initialData.businessIndustry || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const payload = {
        ...formData,
        applicationType: 'formation',
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
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Formation Application</h1>
        <p className="text-gray-600 mt-2">
          Let&apos;s get your new business started with the right foundation
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
        <Card title="Business Formation Details">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Desired Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                placeholder="e.g., Acme Solutions LLC"
              />
              <p className="text-xs text-gray-500 mt-1">We&apos;ll check availability in your chosen state</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Business Structure
              </label>
              <select
                name="businessStructure"
                value={formData.businessStructure}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select structure</option>
                <option value="LLC">LLC (Limited Liability Company)</option>
                <option value="S-Corp">S-Corporation</option>
                <option value="C-Corp">C-Corporation</option>
                <option value="Partnership">Partnership</option>
                <option value="Not sure">Not sure - need guidance</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Don&apos;t worry, we&apos;ll help you choose the best option</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State of Formation
              </label>
              <select
                name="stateOfFormation"
                value={formData.stateOfFormation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select state</option>
                <option value="Wyoming">Wyoming (Recommended - Tax Benefits)</option>
                <option value="Delaware">Delaware</option>
                <option value="Nevada">Nevada</option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
                <option value="New York">New York</option>
                <option value="Other">Other State</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Industry
              </label>
              <select
                name="businessIndustry"
                value={formData.businessIndustry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select industry</option>
                <option value="Technology">Technology / Software</option>
                <option value="E-commerce">E-commerce / Retail</option>
                <option value="Professional Services">Professional Services / Consulting</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Construction">Construction / Contracting</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Marketing">Marketing / Advertising</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title="Next Steps">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Once you submit this form, we&apos;ll begin the business formation process and help you obtain your EIN, business license, and banking setup.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" isLoading={loading}>
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
  )
}