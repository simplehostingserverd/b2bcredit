import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function TermsPage() {
  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-white/70">
            Last updated: January 2025
          </p>
        </div>

        <div className="card-dark rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and B2B Credit Builder ("Company," "we," "our," or "us") concerning your access to and use of the b2bcreditbuilder.com website and our business formation and funding services (collectively, the "Services").
            </p>
            <p className="text-white/70 leading-relaxed">
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree with these Terms, you must not access or use our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              To use our Services, you must:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be prohibited from using our Services under applicable laws</li>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Services Overview</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.1 Business Formation Services</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              We provide automated business formation services, including:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Business entity registration (LLC, S-Corp, C-Corp, etc.)</li>
              <li>EIN (Employer Identification Number) application assistance</li>
              <li>Business license and permit guidance</li>
              <li>Registered agent services</li>
              <li>Compliance and annual report filing</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Funding Services</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              We assist businesses in securing funding through:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Connecting you with potential lenders and investors</li>
              <li>Application preparation and submission assistance</li>
              <li>Credit building strategies</li>
              <li>Financial document review and guidance</li>
            </ul>

            <p className="text-white/70 leading-relaxed mt-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <strong className="text-yellow-300">Important Note:</strong> We are not a lender and do not guarantee approval for any funding. Funding decisions are made by third-party lenders based on their own criteria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. User Responsibilities</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              When using our Services, you agree to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Provide accurate, truthful, and complete information</li>
              <li>Update your information as necessary to maintain accuracy</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Comply with all applicable federal, state, and local laws</li>
              <li>Not use our Services for any fraudulent or illegal purposes</li>
              <li>Not attempt to interfere with or disrupt our Services</li>
              <li>Not use automated systems to access our Services without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Fees and Payment</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              Certain Services require payment of fees. You agree to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Pay all applicable fees for Services you purchase</li>
              <li>Provide valid payment information</li>
              <li>Pay any additional taxes or charges as required by law</li>
              <li>Understand that fees are generally non-refundable except as required by law</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              We reserve the right to change our fees at any time. We will provide advance notice of any fee changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property Rights</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              The Services and all content, features, and functionality are owned by B2B Credit Builder and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-white/70 leading-relaxed mb-3">
              You are granted a limited, non-exclusive, non-transferable license to access and use our Services for your personal or business purposes. You may not:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Copy, modify, or create derivative works from our content</li>
              <li>Distribute, sell, or license our content to third parties</li>
              <li>Reverse engineer or attempt to extract source code from our Services</li>
              <li>Remove or alter any copyright, trademark, or proprietary notices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Services</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Our Services may contain links to or integrate with third-party websites, services, or content. We do not control, endorse, or assume responsibility for any third-party services. Your use of third-party services is at your own risk and subject to their terms and conditions.
            </p>
            <p className="text-white/70 leading-relaxed">
              This includes but is not limited to: payment processors, lenders, credit bureaus, government agencies, and registered agent services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="text-white/70 leading-relaxed">
              We do not warrant that our Services will be uninterrupted, error-free, or secure. We do not guarantee any specific results from using our Services, including but not limited to successful business formation or funding approval.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, B2B CREDIT BUILDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING FROM YOUR USE OF OR INABILITY TO USE OUR SERVICES.
            </p>
            <p className="text-white/70 leading-relaxed">
              Our total liability to you for any claims arising from these Terms or your use of our Services shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
            <p className="text-white/70 leading-relaxed">
              You agree to indemnify, defend, and hold harmless B2B Credit Builder and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from: (a) your use of our Services; (b) your violation of these Terms; (c) your violation of any rights of another party; or (d) any content you submit through our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              We may terminate or suspend your access to our Services at any time, with or without cause or notice, including if:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>You breach these Terms</li>
              <li>You provide false or misleading information</li>
              <li>We are required to do so by law</li>
              <li>Your account has been inactive for an extended period</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              You may terminate your account at any time by contacting us. Upon termination, your right to use our Services will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">12.1 Governing Law</h3>
            <p className="text-white/70 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Wyoming, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">12.2 Arbitration</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              Any dispute arising from these Terms or your use of our Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in Cheyenne, Wyoming.
            </p>
            <p className="text-white/70 leading-relaxed">
              You agree to waive any right to a jury trial or to participate in a class action lawsuit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Modifications to Terms</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last updated" date.
            </p>
            <p className="text-white/70 leading-relaxed">
              Your continued use of our Services after any changes indicates your acceptance of the modified Terms. If you do not agree to the changes, you must stop using our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Severability</h2>
            <p className="text-white/70 leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">15. Entire Agreement</h2>
            <p className="text-white/70 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and B2B Credit Builder regarding your use of our Services and supersede any prior agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">16. Contact Information</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-white/5 rounded-lg p-4 text-white/70">
              <p className="mb-2"><strong className="text-white">B2B Credit Builder</strong></p>
              <p className="mb-2">123 Business Way</p>
              <p className="mb-2">Cheyenne, Wyoming 82001</p>
              <p className="mb-2">Email: legal@b2bcreditbuilder.com</p>
              <p>Phone: 1-800-555-1234</p>
            </div>
          </section>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/70 text-sm text-center">
              For general inquiries, please visit our{' '}
              <Link href="/contact" className="text-purple-300 hover:text-purple-200">Contact page</Link>
              {' '}or review our{' '}
              <Link href="/privacy" className="text-purple-300 hover:text-purple-200">Privacy Policy</Link>.
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
