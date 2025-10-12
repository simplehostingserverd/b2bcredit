'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Navbar } from '@/components/Navbar'

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What services does B2B Credit Builder offer?",
      answer: "We offer two main services: 1) Automated business formation for startups - including company registration, EIN setup, business licenses, and funding assistance. 2) Business funding solutions for existing companies - helping you secure expansion capital, working capital lines, and equipment financing."
    },
    {
      question: "How long does the business formation process take?",
      answer: "Our automated business formation process typically takes 5-10 business days, depending on your state and business structure. Wyoming formations are often faster. We handle all the paperwork and filing, so you can focus on building your business."
    },
    {
      question: "What business structures can you help me form?",
      answer: "We can help you form LLCs, S-Corporations, C-Corporations, and partnerships. We'll guide you through choosing the right structure based on your business goals, tax situation, and future plans."
    },
    {
      question: "Do I need to have a business already to apply for funding?",
      answer: "No! We work with both scenarios. If you're starting from scratch, our automated business formation service will set up your company AND help you apply for startup funding. If you already have an established business, we connect you with funding sources for expansion and growth."
    },
    {
      question: "Why is your company based in Wyoming?",
      answer: "Wyoming offers some of the most business-friendly regulations in the United States, including favorable tax structures, strong privacy protections, and low formation costs. We extend these advantages to entrepreneurs nationwide through our platform."
    },
    {
      question: "What documents do I need to get started?",
      answer: "For business formation, you'll need: your proposed business name, business address, owner/member information, and a business description. For funding applications, you'll also need financial documents, tax returns, and business plans (we can help you create these)."
    },
    {
      question: "How much does it cost to form a business through your service?",
      answer: "Our pricing varies based on the business structure and services needed. Contact us for a personalized quote. We're transparent about all costs upfront - no hidden fees."
    },
    {
      question: "What kind of funding amounts can I qualify for?",
      answer: "Funding amounts vary widely based on your business stage, credit history, revenue, and needs. Startups may qualify for $10K-$100K, while established businesses can access $100K-$5M+ in various forms of financing."
    },
    {
      question: "Do you help with ongoing compliance and annual filings?",
      answer: "Yes! We can help you stay compliant with annual reports, registered agent services, and ongoing business requirements. This ensures your business remains in good standing."
    },
    {
      question: "Can you help me if I'm in a different state?",
      answer: "Absolutely! While we're based in Wyoming, we help entrepreneurs form businesses and secure funding in all 50 states. Our platform works nationwide."
    },
    {
      question: "What if I need help choosing between starting a new business or expanding an existing one?",
      answer: "That's what we're here for! Schedule a consultation with our team, and we'll review your situation, goals, and options to help you make the best decision."
    },
    {
      question: "How do I get started?",
      answer: "Simply click 'Get Started' to create your free account. You'll go through our onboarding process where we'll learn about your business goals and recommend the best path forward - whether that's automated business formation or funding for your existing business."
    }
  ]

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/70">
            Everything you need to know about our services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card-dark rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-purple-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card-dark rounded-xl p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-white/70 mb-6">
            Our team is here to help. Contact us and we'll get back to you within 24 hours.
          </p>
          <Link href="/contact">
            <button className="bg-white text-purple-900 hover:bg-white/90 btn-glow px-8 py-3 rounded-lg font-semibold">
              Contact Support
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
