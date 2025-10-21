'use client'

import Script from 'next/script'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'

export function RybbitProvider() {
  const { data: session, status } = useSession()
  const siteId = process.env.NEXT_PUBLIC_RYBBIT_SITE_ID
  const host = process.env.NEXT_PUBLIC_RYBBIT_HOST || 'https://app.rybbit.io'

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      analytics.identify(session.user.id)
    } else if (status === 'unauthenticated') {
      analytics.clearUserId()
    }
  }, [status, session?.user?.id])

  if (!siteId) {
    console.warn('Rybbit: NEXT_PUBLIC_RYBBIT_SITE_ID not configured')
    return null
  }

  return (
    <Script
      src={`${host}/api/script.js`}
      data-site-id={siteId}
      strategy="afterInteractive"
    />
  )
}
