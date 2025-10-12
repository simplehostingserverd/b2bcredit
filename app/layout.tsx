import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// @ts-ignore
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'B2B Credit Builder - Business Funding Made Simple',
  description: 'Simplify your business funding journey with our comprehensive credit building and capital access platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
