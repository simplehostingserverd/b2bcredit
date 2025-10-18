import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation - B2B Credit',
  description: 'Interactive API documentation for B2B Credit Building SaaS',
  robots: 'noindex, nofollow', // Don't index API docs
}

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
