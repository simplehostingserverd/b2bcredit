import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/Button'

export default function AboutPage() {
  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-glow">
              About B2B Credit Builder
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Based in Wyoming, we're revolutionizing how businesses access funding and build credit.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-white/70 text-lg">
                <p>
                  Founded in Wyoming, B2B Credit Builder was born from a simple observation:
                  accessing business funding shouldn't be complicated, time-consuming, or confusing.
                </p>
                <p>
                  We've helped hundreds of businesses secure the funding they need to grow,
                  whether they're established companies looking to expand or entrepreneurs
                  just starting their journey.
                </p>
                <p>
                  Our platform combines cutting-edge technology with personalized service to
                  deliver a funding experience that's fast, transparent, and tailored to your needs.
                </p>
              </div>
            </div>
            <div className="card-dark rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Why Wyoming?</h3>
              <p className="text-white/70 mb-4">
                Wyoming offers one of the most business-friendly environments in the United States,
                with favorable tax structures and regulations that benefit entrepreneurs.
              </p>
              <p className="text-white/70">
                We're proud to call Wyoming home and extend its business-friendly advantages
                to entrepreneurs nationwide through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-dark rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              To democratize access to business funding by providing innovative, transparent,
              and efficient solutions that empower entrepreneurs to achieve their financial goals
              and build successful, sustainable businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-dark rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-3">Transparency</h3>
              <p className="text-white/70">
                No hidden fees, no surprises. We believe in clear communication and honest dealings.
              </p>
            </div>
            <div className="card-dark rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">Speed</h3>
              <p className="text-white/70">
                We value your time. Our streamlined process gets you answers and funding fast.
              </p>
            </div>
            <div className="card-dark rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-white mb-3">Partnership</h3>
              <p className="text-white/70">
                Your success is our success. We're here to support you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join the businesses that trust B2B Credit Builder for their funding needs
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90 btn-glow px-8 py-4 text-lg font-semibold">
              Start Your Application
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
