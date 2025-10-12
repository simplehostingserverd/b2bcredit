import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/70">
            Last updated: January 2025
          </p>
        </div>

        <div className="card-dark rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              B2B Credit Builder ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services located at b2bcreditbuilder.com (the "Services").
            </p>
            <p className="text-white/70 leading-relaxed">
              By accessing or using our Services, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Personal Information</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Register for an account</li>
              <li>Apply for business formation services</li>
              <li>Apply for business funding</li>
              <li>Contact us for support</li>
              <li>Subscribe to our newsletter or marketing communications</li>
            </ul>

            <p className="text-white/70 leading-relaxed mt-4">
              This information may include:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Name and contact information (email, phone, address)</li>
              <li>Business information (business name, EIN, business structure)</li>
              <li>Financial information (bank account details, tax returns, financial statements)</li>
              <li>Identification documents (driver's license, passport)</li>
              <li>Payment information (credit card details, billing address)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              When you access our Services, we automatically collect certain information, including:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, navigation paths)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process your business formation or funding applications</li>
              <li>Communicate with you about your account and our services</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Comply with legal obligations and prevent fraud</li>
              <li>Analyze usage patterns and improve user experience</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. How We Share Your Information</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              We may share your information with:
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.1 Service Providers</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              We share information with third-party service providers who perform services on our behalf, including:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Payment processors and financial institutions</li>
              <li>Business formation and registration services</li>
              <li>Credit reporting agencies and lenders</li>
              <li>Cloud hosting and data storage providers</li>
              <li>Email and communication platforms</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Legal Requirements</h3>
            <p className="text-white/70 leading-relaxed">
              We may disclose your information if required by law or in response to valid legal requests, such as subpoenas or court orders.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Business Transfers</h3>
            <p className="text-white/70 leading-relaxed">
              If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              We implement appropriate technical and organizational security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure access controls and authentication mechanisms</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Employee training on data protection and privacy</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights and Choices</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              You have certain rights regarding your personal information:
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">6.1 Access and Correction</h3>
            <p className="text-white/70 leading-relaxed">
              You can access and update your account information by logging into your account or contacting us.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.2 Data Deletion</h3>
            <p className="text-white/70 leading-relaxed">
              You can request deletion of your personal information, subject to certain legal exceptions.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.3 Marketing Communications</h3>
            <p className="text-white/70 leading-relaxed">
              You can opt out of receiving marketing emails by clicking the "unsubscribe" link in any marketing email or by contacting us.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.4 Cookies</h3>
            <p className="text-white/70 leading-relaxed">
              You can control cookies through your browser settings. Note that disabling cookies may affect your ability to use certain features of our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
            <p className="text-white/70 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our Services, you consent to such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our Services after any changes indicates your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-white/5 rounded-lg p-4 text-white/70">
              <p className="mb-2"><strong className="text-white">B2B Credit Builder</strong></p>
              <p className="mb-2">123 Business Way</p>
              <p className="mb-2">Cheyenne, Wyoming 82001</p>
              <p className="mb-2">Email: privacy@b2bcreditbuilder.com</p>
              <p>Phone: 1-800-555-1234</p>
            </div>
          </section>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/70 text-sm text-center">
              For general inquiries, please visit our{' '}
              <Link href="/contact" className="text-purple-300 hover:text-purple-200">Contact page</Link>
              {' '}or our{' '}
              <Link href="/support" className="text-purple-300 hover:text-purple-200">Support Center</Link>.
            </p>
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
