import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Validates request body against a Zod schema
 * Returns validated data or error response
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.Schema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors.map((e) => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        ),
      }
    }

    if (error instanceof SyntaxError) {
      return {
        data: null,
        error: NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        ),
      }
    }

    return {
      data: null,
      error: NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      ),
    }
  }
}

/**
 * Validates query parameters against a Zod schema
 */
export function validateQueryParams<T>(
  url: URL,
  schema: z.Schema<T>
): { data: T; error: null } | { data: null; error: NextResponse } {
  try {
    const params: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      params[key] = value
    })
    const data = schema.parse(params)
    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: error.errors.map((e) => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        ),
      }
    }

    return {
      data: null,
      error: NextResponse.json(
        { error: 'Failed to process query parameters' },
        { status: 500 }
      ),
    }
  }
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  id: z.string().cuid(),
  email: z.string().email(),
  pagination: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val) : 20)),
  }),
  search: z.object({
    search: z.string().optional(),
  }),
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
}

/**
 * Sanitizes string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML tags
    .trim()
}

/**
 * Sanitizes object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj } as any
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key])
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key])
    }
  }
  return sanitized as T
}
