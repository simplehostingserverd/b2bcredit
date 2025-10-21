import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      serviceType?: string
    } & DefaultSession['user']
  }

  interface User {
    role?: string
    serviceType?: string
  }
}