import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface ApiError {
  error: string
  code: ErrorCode
  details?: any
  timestamp: string
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  code: ErrorCode,
  status: number,
  details?: any
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: message,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Common error responses
 */
export const errorResponses = {
  unauthorized: (message = 'Unauthorized. Please log in.') =>
    createErrorResponse(message, ErrorCode.UNAUTHORIZED, 401),

  forbidden: (message = 'Forbidden. You do not have permission to access this resource.') =>
    createErrorResponse(message, ErrorCode.FORBIDDEN, 403),

  notFound: (resource = 'Resource', details?: any) =>
    createErrorResponse(`${resource} not found`, ErrorCode.NOT_FOUND, 404, details),

  badRequest: (message = 'Bad request', details?: any) =>
    createErrorResponse(message, ErrorCode.BAD_REQUEST, 400, details),

  validationError: (details: any) =>
    createErrorResponse('Validation failed', ErrorCode.VALIDATION_ERROR, 400, details),

  conflict: (message = 'Resource already exists', details?: any) =>
    createErrorResponse(message, ErrorCode.CONFLICT, 409, details),

  internalError: (message = 'Internal server error', details?: any) =>
    createErrorResponse(message, ErrorCode.INTERNAL_ERROR, 500, details),

  databaseError: (message = 'Database operation failed', details?: any) =>
    createErrorResponse(message, ErrorCode.DATABASE_ERROR, 500, details),

  rateLimitExceeded: (message = 'Rate limit exceeded. Please try again later.') =>
    createErrorResponse(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429),
}

/**
 * Handles Prisma errors and returns appropriate response
 */
export function handlePrismaError(error: any): NextResponse {
  console.error('Prisma error:', error)

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        return errorResponses.conflict(
          'A record with this value already exists',
          { field: error.meta?.target }
        )

      case 'P2025':
        // Record not found
        return errorResponses.notFound('Record')

      case 'P2003':
        // Foreign key constraint violation
        return errorResponses.badRequest(
          'Invalid reference to related record',
          { field: error.meta?.field_name }
        )

      case 'P2014':
        // Required relation violation
        return errorResponses.badRequest(
          'Cannot delete record with existing relationships',
          { relation: error.meta?.relation_name }
        )

      default:
        return errorResponses.databaseError('Database operation failed', {
          code: error.code,
        })
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return errorResponses.validationError('Invalid data format')
  }

  return errorResponses.internalError()
}

/**
 * Wraps async route handler with error handling
 */
export function withErrorHandling(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return async (req: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context)
    } catch (error) {
      console.error('Unhandled error in route:', error)

      if (error instanceof Prisma.PrismaClientKnownRequestError ||
          error instanceof Prisma.PrismaClientValidationError) {
        return handlePrismaError(error)
      }

      return errorResponses.internalError()
    }
  }
}

/**
 * Logs error with context
 */
export function logError(error: any, context: Record<string, any> = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    context,
  }

  console.error('Application Error:', JSON.stringify(errorLog, null, 2))

  // Send to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    try {
      const { captureException } = require('@/lib/sentry')
      captureException(error, context)
    } catch (e) {
      // Sentry not installed or failed, continue
      console.error('Failed to send error to Sentry:', e)
    }
  }
}
