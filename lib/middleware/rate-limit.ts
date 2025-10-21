import { NextResponse } from 'next/server'
import { errorResponses } from '@/lib/utils/errors'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

// In-memory store (for production, use Redis or similar)
const store: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum number of requests per window
}

/**
 * Default rate limit configurations
 */
export const rateLimitConfigs = {
  strict: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  standard: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 requests per minute
  relaxed: { windowMs: 60 * 1000, maxRequests: 120 }, // 120 requests per minute
  public: { windowMs: 60 * 1000, maxRequests: 30 }, // 30 requests per minute
  // Authentication-specific rate limits
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 login attempts per 15 minutes
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 password reset requests per hour
}

/**
 * Get client identifier (IP or user ID)
 */
function getClientId(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

  return `ip:${ip}`
}

/**
 * Clean up expired entries
 */
function cleanup() {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key]
    }
  })
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig = rateLimitConfigs.standard) {
  return async (
    request: Request,
    userId?: string
  ): Promise<{ allowed: boolean; error: NextResponse | null }> => {
    const clientId = getClientId(request, userId)
    const key = `${clientId}:${request.url}`
    const now = Date.now()

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      cleanup()
    }

    // Get or create rate limit entry
    let entry = store[key]

    if (!entry || entry.resetAt < now) {
      // Create new window
      entry = {
        count: 1,
        resetAt: now + config.windowMs,
      }
      store[key] = entry
      return { allowed: true, error: null }
    }

    // Increment count
    entry.count++

    if (entry.count > config.maxRequests) {
      const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000)

      return {
        allowed: false,
        error: NextResponse.json(
          {
            error: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: resetInSeconds,
            timestamp: new Date().toISOString(),
          },
          {
            status: 429,
            headers: {
              'Retry-After': resetInSeconds.toString(),
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': entry.resetAt.toString(),
            },
          }
        ),
      }
    }

    return { allowed: true, error: null }
  }
}

/**
 * Apply rate limit to route handler
 */
export function withRateLimit(
  handler: (req: Request, context?: any) => Promise<NextResponse>,
  config: RateLimitConfig = rateLimitConfigs.standard
) {
  return async (req: Request, context?: any): Promise<NextResponse> => {
    const { allowed, error } = await rateLimit(config)(req)

    if (!allowed && error) {
      return error
    }

    return handler(req, context)
  }
}
