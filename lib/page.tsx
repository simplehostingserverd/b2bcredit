'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

export default function ContactPage() {
  const [status, setStatus] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Thank you for your message! We will get back to you shortly.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              We&apos;re here to help. Reach out to us with any questions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
              {status ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{status}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input label="Your Name" name="name" type="text" required />
                  <Input label="Your Email" name="email" type="email" required />
                  <Input label="Subject" name="subject" type="text" required />
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              )}
            </div>
            <div className="space-y-8 text-lg">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Our Office</h3>
                <p className="text-gray-600 mt-2">123 Business Lane<br />Suite 100<br />Funding City, FS 54321</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Email Us</h3>
                <p className="text-gray-600 mt-2">
                  <a href="mailto:support@b2bcreditbuilder.com" className="text-primary-600 hover:underline">support@b2bcreditbuilder.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}