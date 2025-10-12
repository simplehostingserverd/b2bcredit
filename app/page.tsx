import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/Button'

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg stars-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center relative z-10">
            <div className="mb-4">
              <span className="text-purple-300 text-sm uppercase tracking-wider">TRUSTED WYOMING PARTNER</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
              Redefining the Future of <br />Business Finance
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-3xl mx-auto">
              Experience the future of finance with Uneon, where innovative solutions help you manage & grow your business with financial clarity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90 btn-glow px-8 py-4 text-lg font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose B2B Credit Builder?
            </h2>
            <p className="text-xl text-white/70">
              Everything you need to secure business funding in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-dark rounded-2xl p-8 transition-all duration-300">
              <div className="text-purple-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Fast & Simple</h3>
              <p className="text-white/70">
                Streamlined application process that takes minutes, not hours. Get started with your funding journey today.
              </p>
            </div>

            <div className="card-dark rounded-2xl p-8 transition-all duration-300">
              <div className="text-purple-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Secure & Trusted</h3>
              <p className="text-white/70">
                Your data is protected with bank-level security. We never share your information without permission.
              </p>
            </div>

            <div className="card-dark rounded-2xl p-8 transition-all duration-300">
              <div className="text-purple-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Multiple Options</h3>
              <p className="text-white/70">
                Access various funding sources and choose the best option for your business needs and goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-white/70">
              Three simple steps to get your business funded
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-purple-500/20 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 glow-effect">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Create Account</h3>
              <p className="text-white/70">
                Sign up in minutes with your business information. No credit card required to get started.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500/20 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 glow-effect">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Complete Application</h3>
              <p className="text-white/70">
                Fill out our simple application form with your business and financial details.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500/20 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 glow-effect">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Get Funded</h3>
              <p className="text-white/70">
                Receive funding options tailored to your business. Get approved and funded fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Fund Your Business?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join hundreds of businesses that have simplified their funding journey
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90 btn-glow px-8 py-4 text-lg font-semibold">
              Get Started Today
            </Button>
          </Link>
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
