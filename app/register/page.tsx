'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        setIsLoading(false)
        return
      }

      // Registration successful, redirect to onboarding
      router.push('/onboarding/step-1')
    } catch (error) {
      setError('Something went wrong')
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen stars-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <span className="text-3xl font-bold text-white">B2B Credit</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-white/70">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-purple-300 hover:text-purple-200">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-dark rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className="w-full bg-white/5 border-white/10 text-white placeholder-white/40"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-white mb-2">
                Business Name
              </label>
              <Input
                id="businessName"
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border-white/10 text-white placeholder-white/40"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full bg-white/5 border-white/10 text-white placeholder-white/40"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full bg-white/5 border-white/10 text-white placeholder-white/40"
              />
            </div>

            <div className="text-xs text-white/70">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-purple-300 hover:text-purple-200">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-purple-300 hover:text-purple-200">
                Privacy Policy
              </a>
            </div>

            <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-700 btn-glow" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
