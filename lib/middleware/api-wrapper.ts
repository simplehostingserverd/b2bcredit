import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/utils/errors'
import { rateLimit, RateLimitConfig, rateLimitConfigs } from './rate-limit'
import { AuthenticatedUser } from './rbac'

interface WrapperOptions {
  rateLimit?: RateLimitConfig | false
  requireAuth?: boolean
}

/**
 * Comprehensive wrapper for API routes that applies:
 * - Error handling
 * - Rate limiting
 * - Consistent response format
 */
export function wrapApiRoute(
  handler: (req: Request, context?: any) => Promise<NextResponse>,
  options: WrapperOptions = {}
) {
  const {
    rateLimit: rateLimitConfig = rateLimitConfigs.standard,
    requireAuth = false,
  } = options

  return withErrorHandling(async (req: Request, context?: any): Promise<NextResponse> => {
    // Apply rate limiting if enabled
    if (rateLimitConfig !== false) {
      const rateLimiter = rateLimit(rateLimitConfig)
      const { allowed, error } = await rateLimiter(req)

      if (!allowed && error) {
        return error
      }
    }

    // Execute the handler
    return await handler(req, context)
  })
}

/**
 * Wrapper for public API routes (strict rate limiting)
 */
export function wrapPublicRoute(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return wrapApiRoute(handler, {
    rateLimit: rateLimitConfigs.public,
    requireAuth: false,
  })
}

/**
 * Wrapper for authenticated routes (standard rate limiting)
 */
export function wrapAuthRoute(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return wrapApiRoute(handler, {
    rateLimit: rateLimitConfigs.standard,
    requireAuth: true,
  })
}

/**
 * Wrapper for admin routes (relaxed rate limiting)
 */
export function wrapAdminRoute(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return wrapApiRoute(handler, {
    rateLimit: rateLimitConfigs.relaxed,
    requireAuth: true,
  })
}

/**
 * Wrapper for routes that need strict rate limiting (e.g., login, register)
 */
export function wrapStrictRoute(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return wrapApiRoute(handler, {
    rateLimit: rateLimitConfigs.strict,
    requireAuth: false,
  })
}
