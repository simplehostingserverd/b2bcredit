import { NextRequest, NextResponse } from 'next/server'

export interface CacheConfig {
  public?: boolean
  private?: boolean
  maxAge?: number
  sMaxAge?: number
  staleWhileRevalidate?: number
  staleIfError?: number
  mustRevalidate?: boolean
  noCache?: boolean
  noStore?: boolean
}

/**
 * Cache configurations optimized for Fastly CDN
 */
export const cacheConfigs = {
  /**
   * Static content - long cache, public
   * Use for: Images, blog posts, public pages
   */
  static: {
    public: true,
    maxAge: 3600, // 1 hour browser cache
    sMaxAge: 86400, // 24 hours CDN cache
    staleWhileRevalidate: 172800, // 2 days stale-while-revalidate
  },

  /**
   * Dynamic content - short cache, public
   * Use for: API responses, blog listings
   */
  dynamic: {
    public: true,
    maxAge: 60, // 1 minute browser cache
    sMaxAge: 300, // 5 minutes CDN cache
    staleWhileRevalidate: 600, // 10 minutes stale-while-revalidate
  },

  /**
   * User-specific content - no public cache
   * Use for: Dashboard, user applications
   */
  private: {
    private: true,
    maxAge: 0,
    noCache: true,
  },

  /**
   * Never cache
   * Use for: Auth endpoints, mutations
   */
  noCache: {
    noStore: true,
    noCache: true,
    maxAge: 0,
  },

  /**
   * Blog posts - aggressive caching
   */
  blogPost: {
    public: true,
    maxAge: 300, // 5 minutes browser cache
    sMaxAge: 600, // 10 minutes CDN cache
    staleWhileRevalidate: 1200, // 20 minutes stale
    staleIfError: 86400, // Serve stale if error for 1 day
  },

  /**
   * API responses - moderate caching
   */
  api: {
    public: true,
    maxAge: 30, // 30 seconds browser
    sMaxAge: 60, // 1 minute CDN
    staleWhileRevalidate: 120, // 2 minutes stale
  },
}

/**
 * Build Cache-Control header from config
 */
export function buildCacheControl(config: CacheConfig): string {
  const parts: string[] = []

  if (config.public) parts.push('public')
  if (config.private) parts.push('private')
  if (config.noCache) parts.push('no-cache')
  if (config.noStore) parts.push('no-store')
  if (config.mustRevalidate) parts.push('must-revalidate')

  if (config.maxAge !== undefined) {
    parts.push(`max-age=${config.maxAge}`)
  }

  if (config.sMaxAge !== undefined) {
    parts.push(`s-maxage=${config.sMaxAge}`)
  }

  if (config.staleWhileRevalidate !== undefined) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`)
  }

  if (config.staleIfError !== undefined) {
    parts.push(`stale-if-error=${config.staleIfError}`)
  }

  return parts.join(', ')
}

/**
 * Add cache headers to response
 */
export function withCache(
  response: NextResponse,
  config: CacheConfig = cacheConfigs.dynamic
): NextResponse {
  const cacheControl = buildCacheControl(config)
  response.headers.set('Cache-Control', cacheControl)

  // Add Fastly-specific headers
  if (config.public) {
    // Surrogate-Control is Fastly-specific, overrides Cache-Control at edge
    if (config.sMaxAge) {
      response.headers.set('Surrogate-Control', `max-age=${config.sMaxAge}`)
    }

    // Surrogate-Key for cache purging
    // You can purge all blog posts with: fastly purge-key blog-posts
    response.headers.set('Surrogate-Key', 'api-response')
  }

  // Vary header for proper caching
  response.headers.set('Vary', 'Accept-Encoding, Accept')

  return response
}

/**
 * Wrapper for cacheable API routes
 */
export function withCacheable(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  config: CacheConfig = cacheConfigs.dynamic
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    const response = await handler(req, context)
    return withCache(response, config)
  }
}

/**
 * Set Surrogate-Key for Fastly cache purging
 *
 * Usage:
 * setSurrogateKeys(response, ['blog-posts', 'blog-category-tech'])
 *
 * Purge with:
 * curl -X PURGE https://api.yourdomain.com -H "Fastly-Soft-Purge: 1" -H "Surrogate-Key: blog-posts"
 */
export function setSurrogateKeys(response: NextResponse, keys: string[]): NextResponse {
  response.headers.set('Surrogate-Key', keys.join(' '))
  return response
}

/**
 * Conditional cache based on authentication
 */
export function withConditionalCache(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  publicConfig: CacheConfig = cacheConfigs.dynamic,
  privateConfig: CacheConfig = cacheConfigs.private
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    const response = await handler(req, context)

    // Check if user is authenticated (has session cookie)
    const sessionCookie = req.cookies.get('next-auth.session-token')
    const config = sessionCookie ? privateConfig : publicConfig

    return withCache(response, config)
  }
}
