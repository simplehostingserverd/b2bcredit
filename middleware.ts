import { NextResponse } from 'next/server'
import { authRateLimit } from './lib/middleware/auth-rate-limit'

export async function middleware(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Apply authentication rate limiting to login and auth-related routes
  if (pathname.startsWith('/login') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/register')) {
    
    const result = await authRateLimit(request)
    
    if (!result.allowed && result.error) {
      return result.error
    }
  }

  // Apply NextAuth middleware to protected routes
  if (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/application') ||
      pathname.startsWith('/admin')) {
    
    const response = NextResponse.next()
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.rybbit.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: https://app.rybbit.io; frame-src 'none'; object-src 'none';")
    
    // Add HSTS header in production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    }
    
    // Add authentication-specific security headers
    if (pathname.startsWith('/api/auth')) {
      response.headers.set('Cache-Control', 'no-store, max-age=0')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    }
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login/:path*',
    '/register/:path*',
    '/api/auth/:path*',
    '/dashboard/:path*',
    '/application/:path*',
    '/admin/:path*',
  ],
}
