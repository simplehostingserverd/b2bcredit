import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/Button'

export default function ServicesPage() {
  return (
    <div className="min-h-screen gradient-bg stars-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-glow">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Whether you're growing an established business or starting from scratch,
              we have the perfect solution for you.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Established Businesses */}
            <div className="card-dark rounded-2xl p-10 hover:scale-105 transition-transform duration-300">
              <div className="text-purple-400 mb-6">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                For Established Businesses
              </h2>
              <p className="text-white/70 text-lg mb-6">
                Already running a successful business? We help you find the perfect funding
                solutions to take your company to the next level.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Business expansion funding</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Equipment and inventory financing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Working capital loans</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Business credit line establishment</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Competitive rate shopping and comparison</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Expert guidance through the funding process</span>
                </li>
              </ul>
              <Link href="/register">
                <Button className="w-full bg-white text-purple-900 hover:bg-white/90 btn-glow">
                  Get Funding for Your Business
                </Button>
              </Link>
            </div>

            {/* New Businesses */}
            <div className="card-dark rounded-2xl p-10 hover:scale-105 transition-transform duration-300 border-2 border-purple-500/30">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-purple-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                  POPULAR
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Start from Scratch
              </h2>
              <p className="text-white/70 text-lg mb-6">
                Have a business idea but don't know where to start? We offer automated company
                building and comprehensive support to launch your dream business.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Automated company formation and registration</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">EIN and business license assistance</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Business bank account setup guidance</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Business credit profile creation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Startup funding options and applications</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Step-by-step business launch guidance</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">Automated document preparation and filing</span>
                </li>
              </ul>
              <Link href="/register">
                <Button className="w-full bg-white text-purple-900 hover:bg-white/90 btn-glow">
                  Start Building Your Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose Our Services?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card-dark rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🏔️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Wyoming Based</h3>
              <p className="text-white/70 text-sm">
                Operating from business-friendly Wyoming
              </p>
            </div>
            <div className="card-dark rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast Process</h3>
              <p className="text-white/70 text-sm">
                Automated systems speed up your journey
              </p>
            </div>
            <div className="card-dark rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
              <p className="text-white/70 text-sm">
                Professional guidance every step
              </p>
            </div>
            <div className="card-dark rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-lg font-semibold text-white mb-2">Complete Solution</h3>
              <p className="text-white/70 text-sm">
                Everything you need in one place
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Whether you're expanding or just starting out, we're here to help you succeed
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90 btn-glow px-8 py-4 text-lg font-semibold">
                Get Started Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 text-white/70 py-12">
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
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
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
