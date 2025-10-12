import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function SupportPage() {
  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Support Center
          </h1>
          <p className="text-xl text-white/70">
            We're here to help you succeed
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-dark rounded-xl p-8 text-center hover:scale-105 transition-all duration-300">
            <div className="text-purple-400 mb-4 flex justify-center">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Email Support
            </h3>
            <p className="text-white/70 mb-4">
              Get detailed help via email. We respond within 24 hours.
            </p>
            <Link href="/contact">
              <button className="bg-purple-600 text-white hover:bg-purple-700 btn-glow px-6 py-2 rounded-lg font-semibold">
                Send Email
              </button>
            </Link>
          </div>

          <div className="card-dark rounded-xl p-8 text-center hover:scale-105 transition-all duration-300">
            <div className="text-purple-400 mb-4 flex justify-center">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Live Chat
            </h3>
            <p className="text-white/70 mb-4">
              Chat with our team in real-time during business hours.
            </p>
            <button className="bg-purple-600 text-white hover:bg-purple-700 btn-glow px-6 py-2 rounded-lg font-semibold">
              Start Chat
            </button>
          </div>

          <div className="card-dark rounded-xl p-8 text-center hover:scale-105 transition-all duration-300">
            <div className="text-purple-400 mb-4 flex justify-center">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Phone Support
            </h3>
            <p className="text-white/70 mb-4">
              Speak directly with a business specialist.
            </p>
            <a href="tel:+18005551234" className="bg-purple-600 text-white hover:bg-purple-700 btn-glow px-6 py-2 rounded-lg font-semibold inline-block">
              Call Us
            </a>
          </div>
        </div>

        {/* Help Topics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Popular Help Topics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-dark rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Getting Started
              </h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>How to create your account</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Completing the onboarding process</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Choosing between formation or funding services</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Understanding our pricing</span>
                </li>
              </ul>
            </div>

            <div className="card-dark rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Business Formation
              </h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>LLC vs S-Corp vs C-Corp - which is right for me?</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Required documents for business registration</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Timeline for business formation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>EIN and tax registration help</span>
                </li>
              </ul>
            </div>

            <div className="card-dark rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Funding Applications
              </h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>How to apply for business funding</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Required financial documents</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Understanding funding approval criteria</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Tracking your application status</span>
                </li>
              </ul>
            </div>

            <div className="card-dark rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Account & Billing
              </h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Managing your account settings</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Payment methods and billing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Resetting your password</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Updating business information</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card-dark rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Additional Resources
          </h3>
          <p className="text-white/70 mb-6">
            Find more information to help you succeed
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/faqs">
              <button className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg font-semibold">
                View FAQs
              </button>
            </Link>
            <Link href="/blog">
              <button className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg font-semibold">
                Read Our Blog
              </button>
            </Link>
            <Link href="/services">
              <button className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg font-semibold">
                Our Services
              </button>
            </Link>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-12 card-dark rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Business Hours
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <h4 className="text-white font-semibold mb-3">Support Available</h4>
              <p className="text-white/70">Monday - Friday: 8:00 AM - 8:00 PM MST</p>
              <p className="text-white/70">Saturday: 9:00 AM - 5:00 PM MST</p>
              <p className="text-white/70">Sunday: Closed</p>
            </div>
            <div className="text-center">
              <h4 className="text-white font-semibold mb-3">Emergency Contact</h4>
              <p className="text-white/70 mb-2">For urgent business formation issues:</p>
              <p className="text-purple-300 font-semibold">1-800-555-1234</p>
              <p className="text-white/70 text-sm mt-2">(Available 24/7)</p>
            </div>
          </div>
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
