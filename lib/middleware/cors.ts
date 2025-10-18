import { NextResponse } from 'next/server'

export interface CorsConfig {
  origin?: string | string[] | boolean
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

/**
 * CORS configurations for different environments
 */
export const corsConfigs = {
  /**
   * Development - allow all origins
   */
  development: {
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  /**
   * Production - specific origins only
   */
  production: {
    origin: [
      'https://b2bcredit.com',
      'https://www.b2bcredit.com',
      'https://app.b2bcredit.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials: true,
    maxAge: 86400,
  },

  /**
   * Public API - read-only, no credentials
   */
  publicApi: {
    origin: true,
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    credentials: false,
    maxAge: 86400,
  },
}

/**
 * Get appropriate CORS config based on environment
 */
export function getCorsConfig(): CorsConfig {
  const env = process.env.NODE_ENV || 'development'

  if (env === 'production') {
    return corsConfigs.production
  }

  return corsConfigs.development
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null, config: CorsConfig): boolean {
  if (!origin) return false

  const { origin: allowedOrigins } = config

  // Allow all origins
  if (allowedOrigins === true) return true

  // No origins allowed
  if (allowedOrigins === false) return false

  // Check if origin is in allowed list
  if (typeof allowedOrigins === 'string') {
    return origin === allowedOrigins
  }

  if (Array.isArray(allowedOrigins)) {
    return allowedOrigins.includes(origin)
  }

  return false
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  request: Request,
  config: CorsConfig = getCorsConfig()
): NextResponse {
  const origin = request.headers.get('origin')

  // Set Access-Control-Allow-Origin
  if (config.origin === true) {
    response.headers.set('Access-Control-Allow-Origin', '*')
  } else if (origin && isOriginAllowed(origin, config)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Vary', 'Origin')
  }

  // Set Access-Control-Allow-Methods
  if (config.methods) {
    response.headers.set('Access-Control-Allow-Methods', config.methods.join(', '))
  }

  // Set Access-Control-Allow-Headers
  if (config.allowedHeaders) {
    response.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '))
  }

  // Set Access-Control-Expose-Headers
  if (config.exposedHeaders) {
    response.headers.set('Access-Control-Expose-Headers', config.exposedHeaders.join(', '))
  }

  // Set Access-Control-Allow-Credentials
  if (config.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // Set Access-Control-Max-Age
  if (config.maxAge) {
    response.headers.set('Access-Control-Max-Age', config.maxAge.toString())
  }

  return response
}

/**
 * Handle CORS preflight (OPTIONS) requests
 */
export function handlePreflight(
  request: Request,
  config: CorsConfig = getCorsConfig()
): NextResponse {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, request, config)
}

/**
 * Wrapper for API routes with CORS support
 */
export function withCors(
  handler: (req: Request, context?: any) => Promise<NextResponse>,
  config: CorsConfig = getCorsConfig()
) {
  return async (req: Request, context?: any): Promise<NextResponse> => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return handlePreflight(req, config)
    }

    // Process the request
    const response = await handler(req, context)

    // Add CORS headers to response
    return addCorsHeaders(response, req, config)
  }
}

/**
 * Wrapper for public API routes (GET only, no credentials)
 */
export function withPublicCors(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return withCors(handler, corsConfigs.publicApi)
}

/**
 * Combined wrapper for CORS + other middleware
 */
export function withCorsAndCache(
  handler: (req: Request, context?: any) => Promise<NextResponse>,
  corsConfig: CorsConfig = getCorsConfig(),
  cacheConfig?: any // Import from cache.ts if needed
) {
  return async (req: Request, context?: any): Promise<NextResponse> => {
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return handlePreflight(req, corsConfig)
    }

    // Execute handler
    let response = await handler(req, context)

    // Add CORS headers
    response = addCorsHeaders(response, req, corsConfig)

    // Add cache headers if config provided
    if (cacheConfig) {
      const { withCache } = await import('./cache')
      response = withCache(response, cacheConfig)
    }

    return response
  }
}
