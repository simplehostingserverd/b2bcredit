'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './Button'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-transparent backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">B2B Credit</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/about" className="text-white/80 hover:text-white px-3 py-2 transition-colors">
                About
              </Link>
              <Link href="/services" className="text-white/80 hover:text-white px-3 py-2 transition-colors">
                Services
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white px-3 py-2 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-20 bg-white/10 animate-pulse rounded"></div>
            ) : session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">Dashboard</Button>
                </Link>
                <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10" onClick={() => signOut({ callbackUrl: '/' })}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="bg-white text-purple-900 hover:bg-white/90 btn-glow">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
