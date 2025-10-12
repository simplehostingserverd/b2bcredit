import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/Card'
import Link from 'next/link'
import { Button } from '@/components/Button'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Services
            </h1>
            <p className="text-xl text-gray-600 mb-16">
              A complete suite of tools to fuel your business growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-2xl font-semibold mb-3">Business Credit Building</h3>
              <p className="text-gray-600 mb-4">
                We guide you step-by-step to establish and grow your business credit profile, separate from your personal credit. Access better terms and higher funding amounts.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Establish your business credit file with major bureaus.</li>
                <li>Access to vendor and trade credit to build your history.</li>
                <li>Monitor your credit scores and reports in real-time.</li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-2xl font-semibold mb-3">Funding Application Platform</h3>
              <p className="text-gray-600 mb-4">
                Our streamlined application process makes it easy to apply for various types of business funding. We match you with the best lenders for your needs.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>One simple application for multiple funding options.</li>
                <li>Access to business loans, lines of credit, and more.</li>
                <li>Fast approvals and funding to keep your business moving.</li>
              </ul>
            </Card>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Take the first step towards a stronger financial future for your business.
            </p>
            <Link href="/register">
              <Button size="lg" variant="primary">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 B2B Credit Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}