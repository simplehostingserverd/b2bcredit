import { NextResponse } from 'next/server'
import { rateLimit, rateLimitConfigs } from './rate-limit'
import { prisma } from '../prisma'
import { errorResponses } from '../utils/errors'

interface AuthRateLimitResult {
  allowed: boolean
  error?: NextResponse
  userId?: string
}

/**
 * Enhanced rate limiting for authentication endpoints with account lockout support
 */
export async function authRateLimit(
  request: Request,
  userId?: string
): Promise<AuthRateLimitResult> {
  const clientId = userId || `ip:${getClientIp(request)}`
  
  // Apply general rate limiting
  const { allowed, error } = await rateLimit(rateLimitConfigs.login)(request, userId)
  
  if (!allowed && error) {
    return { allowed: false, error }
  }

  // If we have a userId, check for account lockout status
  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          isLocked: true,
          lockUntil: true,
          isDisabled: true,
          failedLoginAttempts: true,
        }
      })

      if (!user) {
        return { allowed: false, error: errorResponses.internalError('User not found') }
      }

      // Check if account is disabled
      if (user.isDisabled) {
        return { 
          allowed: false, 
          error: NextResponse.json(
            {
              error: 'Account is disabled. Please contact support.',
              code: 'ACCOUNT_DISABLED',
              timestamp: new Date().toISOString(),
            },
            { status: 403 }
          )
        }
      }

      // Check if account is locked
      if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
        const lockTimeRemaining = Math.ceil((user.lockUntil.getTime() - Date.now()) / (1000 * 60))
        return { 
          allowed: false, 
          error: NextResponse.json(
            {
              error: `Account locked. Please try again in ${lockTimeRemaining} minutes.`,
              code: 'ACCOUNT_LOCKED',
              retryAfter: lockTimeRemaining * 60,
              timestamp: new Date().toISOString(),
            },
            { 
              status: 429,
              headers: {
                'Retry-After': (lockTimeRemaining * 60).toString(),
              }
            }
          )
        }
      }

      // Check if account has too many recent failed attempts
      if (user.failedLoginAttempts >= 5) {
        const lastFailedLogin = user.failedLoginAttempts > 0 ? 
          new Date(Date.now() - (user.failedLoginAttempts * 5 * 60 * 1000)) : 
          new Date(Date.now() - (30 * 60 * 1000))

        // If failed attempts are recent, apply stricter rate limiting
        if (lastFailedLogin > new Date(Date.now() - 15 * 60 * 1000)) {
          const { allowed: strictAllowed, error: strictError } = await rateLimit({
            windowMs: 5 * 60 * 1000, // 5 minutes
            maxRequests: 1, // Only 1 attempt every 5 minutes
          })(request, userId)

          if (!strictAllowed && strictError) {
            return { allowed: false, error: strictError }
          }
        }
      }

    } catch (error) {
      console.error('Auth rate limit check failed:', error)
      // If we can't check the user status, allow the request but log the error
      return { allowed: true }
    }
  }

  return { allowed: true }
}

/**
 * Get client IP address from request
 */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  return ip
}

/**
 * Apply auth rate limit to route handler
 */
export function withAuthRateLimit(
  handler: (req: Request, context?: any) => Promise<NextResponse>,
  userId?: string
) {
  return async (req: Request, context?: any): Promise<NextResponse> => {
    const { allowed, error } = await authRateLimit(req, userId)

    if (!allowed && error) {
      return error
    }

    return handler(req, context)
  }
}