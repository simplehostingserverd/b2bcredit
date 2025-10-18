/**
 * Fastly CDN utilities for cache purging and management
 */

export interface FastlyConfig {
  serviceId: string
  apiKey: string
  enabled: boolean
}

/**
 * Get Fastly configuration from environment
 */
export function getFastlyConfig(): FastlyConfig {
  return {
    serviceId: process.env.FASTLY_SERVICE_ID || '',
    apiKey: process.env.FASTLY_API_KEY || '',
    enabled: !!(process.env.FASTLY_SERVICE_ID && process.env.FASTLY_API_KEY),
  }
}

/**
 * Purge content by Surrogate-Key
 */
export async function purgeSurrogateKey(
  key: string,
  soft: boolean = true
): Promise<{ id: string; status: string }> {
  const config = getFastlyConfig()

  if (!config.enabled) {
    console.log(`[Fastly] Not configured, skipping purge of key: ${key}`)
    return { id: 'not-configured', status: 'skipped' }
  }

  const url = `https://api.fastly.com/service/${config.serviceId}/purge/${key}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Fastly-Key': config.apiKey,
        ...(soft && { 'Fastly-Soft-Purge': '1' }),
      },
    })

    if (!response.ok) {
      throw new Error(`Fastly purge failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log(`[Fastly] Purged key: ${key}, status: ${result.status}`)

    return result
  } catch (error) {
    console.error(`[Fastly] Purge error for key ${key}:`, error)
    throw error
  }
}

/**
 * Purge specific URL
 */
export async function purgeUrl(
  url: string,
  soft: boolean = true
): Promise<{ id: string; status: string }> {
  const config = getFastlyConfig()

  if (!config.enabled) {
    console.log(`[Fastly] Not configured, skipping purge of URL: ${url}`)
    return { id: 'not-configured', status: 'skipped' }
  }

  try {
    const response = await fetch(url, {
      method: 'PURGE',
      headers: {
        'Fastly-Key': config.apiKey,
        ...(soft && { 'Fastly-Soft-Purge': '1' }),
      },
    })

    if (!response.ok) {
      throw new Error(`Fastly URL purge failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log(`[Fastly] Purged URL: ${url}, status: ${result.status}`)

    return result
  } catch (error) {
    console.error(`[Fastly] Purge error for URL ${url}:`, error)
    throw error
  }
}

/**
 * Purge all content (use sparingly!)
 */
export async function purgeAll(): Promise<{ status: string }> {
  const config = getFastlyConfig()

  if (!config.enabled) {
    console.log('[Fastly] Not configured, skipping purge all')
    return { status: 'skipped' }
  }

  const url = `https://api.fastly.com/service/${config.serviceId}/purge_all`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Fastly-Key': config.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Fastly purge all failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log('[Fastly] Purged all content, status:', result.status)

    return result
  } catch (error) {
    console.error('[Fastly] Purge all error:', error)
    throw error
  }
}

/**
 * Purge multiple Surrogate-Keys at once
 */
export async function purgeSurrogateKeys(
  keys: string[],
  soft: boolean = true
): Promise<Array<{ key: string; result: any }>> {
  const results = await Promise.all(
    keys.map(async (key) => ({
      key,
      result: await purgeSurrogateKey(key, soft),
    }))
  )

  return results
}

/**
 * Helper to purge blog content
 */
export async function purgeBlogContent(options?: {
  postId?: string
  categoryId?: string
  all?: boolean
}) {
  const keys: string[] = []

  if (options?.all) {
    keys.push('blog-posts')
  }

  if (options?.postId) {
    keys.push(`blog-post-${options.postId}`)
  }

  if (options?.categoryId) {
    keys.push(`blog-category-${options.categoryId}`)
  }

  // Always purge the blog list when content changes
  keys.push('blog-posts')

  return purgeSurrogateKeys(keys)
}

/**
 * Get Fastly real-time statistics
 */
export async function getFastlyStats(
  from: string = '1 hour ago'
): Promise<any> {
  const config = getFastlyConfig()

  if (!config.enabled) {
    return { error: 'Fastly not configured' }
  }

  const url = `https://api.fastly.com/stats/service/${config.serviceId}?from=${encodeURIComponent(from)}`

  try {
    const response = await fetch(url, {
      headers: {
        'Fastly-Key': config.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Fastly stats failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('[Fastly] Stats error:', error)
    throw error
  }
}
