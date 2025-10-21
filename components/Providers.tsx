'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { RybbitProvider } from './RybbitProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <RybbitProvider />
      {children}
    </SessionProvider>
  )
}
