import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function BlogPage() {
  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog & Resources
          </h1>
          <p className="text-xl text-white/70">
            Insights, tips, and guides for business owners and entrepreneurs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Post 1 */}
          <div className="card-dark rounded-xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-purple-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              How to Choose the Right Business Structure
            </h3>
            <p className="text-white/70 mb-4">
              LLC, S-Corp, or C-Corp? Learn which business structure is best for your startup and why it matters.
            </p>
            <span className="text-purple-300 text-sm">Coming Soon</span>
          </div>

          {/* Blog Post 2 */}
          <div className="card-dark rounded-xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-purple-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Building Business Credit from Scratch
            </h3>
            <p className="text-white/70 mb-4">
              Essential steps to establish and build strong business credit for your new company.
            </p>
            <span className="text-purple-300 text-sm">Coming Soon</span>
          </div>

          {/* Blog Post 3 */}
          <div className="card-dark rounded-xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-purple-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Essential Documents for Your New Business
            </h3>
            <p className="text-white/70 mb-4">
              A complete checklist of documents you need to get your business up and running legally.
            </p>
            <span className="text-purple-300 text-sm">Coming Soon</span>
          </div>

          {/* Blog Post 4 */}
          <div className="card-dark rounded-xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-purple-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Funding Options for Startups in 2024
            </h3>
            <p className="text-white/70 mb-4">
              Explore different funding sources available for new businesses, from bootstrapping to venture capital.
            </p>
            <span className="text-purple-300 text-sm">Coming Soon</span>
          </div>

          {/* Blog Post 5 */}
          <div className="card-dark rounded-xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-purple-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Wyoming: The Best State to Start Your Business
            </h3>
            <p className="text-white/70 mb-4">
              Discover why Wyoming offers unique advantages for new business formations and tax benefits.
            </p>
            <span className="text-purple-300 text-sm">Coming Soon</span>
          </div>

          {/* Blog Post 6 */}
          <div className="card-dark rounded-xl p-6 hover:scale-105 transition-all duration-300">
            <div className="text-purple-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Hiring Your First Employee: A Complete Guide
            </h3>
            <p className="text-white/70 mb-4">
              Everything you need to know about payroll, taxes, and compliance when hiring your first team member.
            </p>
            <span className="text-purple-300 text-sm">Coming Soon</span>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-white/70 mb-6">
            Want to stay updated with our latest content?
          </p>
          <Link href="/register">
            <button className="bg-purple-600 text-white hover:bg-purple-700 btn-glow px-8 py-3 rounded-lg font-semibold">
              Subscribe to Updates
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 text-white/70 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">B2B Credit Builder</h4>
              <p className="text-sm">
                Based in Wyoming - Simplifying business funding and credit building for entrepreneurs nationwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2024 B2B Credit Builder. All rights reserved. Wyoming, USA</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
