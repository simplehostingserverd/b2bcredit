import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { Button } from '@/components/Button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About B2B Credit Builder
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Our mission is to empower entrepreneurs by simplifying business funding.
            </p>
          </div>

          <div className="prose prose-lg mx-auto text-gray-700">
            <p>
              Founded in 2024, B2B Credit Builder was created with a single goal in mind: to demystify the world of business credit and funding. We saw countless entrepreneurs with brilliant ideas struggle to secure the capital they needed to grow. The traditional funding landscape can be complex, intimidating, and slow. We knew there had to be a better way.
            </p>
            <p>
              Our platform combines cutting-edge technology with expert guidance to provide a streamlined, transparent, and efficient path to business funding. We help you build a strong business credit profile, connect you with a wide network of lenders, and provide the tools and resources you need to make informed financial decisions.
            </p>
            <p>
              Whether you&apos;re just starting out or looking to scale, our team is dedicated to your success. We believe that every great business deserves the opportunity to thrive, and we&apos;re here to help make that happen.
            </p>
          </div>

          <div className="text-center mt-16">
            <Link href="/register">
              <Button size="lg">Join Us Today</Button>
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