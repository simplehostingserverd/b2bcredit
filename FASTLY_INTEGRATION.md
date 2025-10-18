# Fastly CDN Integration Guide

This guide shows how to integrate your B2B Credit SaaS API with Fastly CDN for improved performance, caching, and global distribution.

## Why Fastly?

- **Edge Caching**: Cache API responses at 65+ global POPs
- **Instant Purging**: Clear cache in <150ms globally
- **VCL Control**: Customize caching logic with Varnish Configuration Language
- **Real-time Analytics**: Monitor cache hit rates, bandwidth, errors
- **DDoS Protection**: Built-in protection against attacks
- **API-First**: Full API for programmatic control

## Prerequisites

1. Fastly account (start at https://www.fastly.com/signup)
2. Domain name with DNS access
3. SSL certificate (Fastly provides free Let's Encrypt certs)

---

## Quick Start

### 1. Create Fastly Service

```bash
# Using Fastly CLI (recommended)
fastly service create --name="b2bcredit-api" --type=wasm

# Or use the Fastly web console
# https://manage.fastly.com/configure/services/new
```

### 2. Configure Origin Server

In Fastly console:
- **Backend hostname**: `your-app.yourdomain.com` (your actual backend)
- **Backend port**: `443`
- **Use SSL**: Yes
- **SSL cert hostname**: `your-app.yourdomain.com`
- **Auto load balance**: No
- **Between bytes timeout**: 10000ms
- **First byte timeout**: 15000ms
- **Max connections**: 200

### 3. Configure Domain

- **Domain**: `api.b2bcredit.com`
- Point DNS CNAME to your Fastly URL: `xxx.global.ssl.fastly.net`

### 4. Upload Custom VCL

See `fastly.vcl` file in this directory (created below).

---

## Fastly VCL Configuration

Create a file `fastly.vcl` with the following:

```vcl
# Fastly VCL Configuration for B2B Credit API
# This file customizes caching behavior for your API

sub vcl_recv {
  # Set backend
  set req.backend = F_origin_0;

  # Normalize headers for better cache hit rates
  if (req.http.Accept-Encoding) {
    if (req.http.Accept-Encoding ~ "gzip") {
      set req.http.Accept-Encoding = "gzip";
    } elsif (req.http.Accept-Encoding ~ "deflate") {
      set req.http.Accept-Encoding = "deflate";
    } else {
      unset req.http.Accept-Encoding;
    }
  }

  # Don't cache authenticated requests
  if (req.http.Cookie ~ "next-auth.session-token") {
    return(pass);
  }

  # Don't cache mutations
  if (req.request != "GET" && req.request != "HEAD") {
    return(pass);
  }

  # Cache API documentation
  if (req.url ~ "^/openapi\.json" || req.url ~ "^/api-docs") {
    return(lookup);
  }

  # Cache blog content aggressively
  if (req.url ~ "^/api/blog") {
    return(lookup);
  }

  # Cache health endpoint
  if (req.url ~ "^/api/health") {
    return(lookup);
  }

  # Don't cache admin endpoints
  if (req.url ~ "^/api/admin") {
    return(pass);
  }

  # Don't cache auth endpoints
  if (req.url ~ "^/api/auth") {
    return(pass);
  }

  # Default: try to cache
  return(lookup);
}

sub vcl_fetch {
  # Respect backend cache headers
  if (beresp.http.Surrogate-Control) {
    set beresp.ttl = std.atoi(regsub(beresp.http.Surrogate-Control, ".*max-age=(\d+).*", "\1")) s;
    unset beresp.http.Surrogate-Control;
  }

  # Cache blog posts for 10 minutes
  if (req.url ~ "^/api/blog" && beresp.status == 200) {
    set beresp.ttl = 600s;
    set beresp.grace = 3600s; # Serve stale for 1 hour if backend is down
  }

  # Cache health check for 1 minute
  if (req.url ~ "^/api/health" && beresp.status == 200) {
    set beresp.ttl = 60s;
  }

  # Cache API docs for 1 hour
  if (req.url ~ "^/openapi\.json" && beresp.status == 200) {
    set beresp.ttl = 3600s;
  }

  # Don't cache errors
  if (beresp.status >= 500) {
    set beresp.ttl = 0s;
    return(deliver);
  }

  # Don't cache redirects
  if (beresp.status >= 300 && beresp.status < 400) {
    set beresp.ttl = 0s;
    return(deliver);
  }

  return(deliver);
}

sub vcl_deliver {
  # Add cache status header for debugging
  if (obj.hits > 0) {
    set resp.http.X-Cache = "HIT";
    set resp.http.X-Cache-Hits = obj.hits;
  } else {
    set resp.http.X-Cache = "MISS";
  }

  # Remove backend headers in production
  unset resp.http.X-Powered-By;
  unset resp.http.Server;

  return(deliver);
}

sub vcl_error {
  # Custom error page for 503
  if (obj.status == 503 && req.restarts < 1) {
    set obj.http.Content-Type = "application/json";
    synthetic {"{"error":"Service temporarily unavailable","code":"SERVICE_UNAVAILABLE"}"};
    return(deliver);
  }
}
```

Upload to Fastly:
```bash
fastly vcl custom create --name="main" --content=@fastly.vcl --version=latest
```

---

## Backend Code Integration

### 1. Update Blog API Route

Example: `app/api/blog/route.ts`

```typescript
import { withCorsAndCache } from '@/lib/middleware/cors'
import { cacheConfigs } from '@/lib/middleware/cache'
import { setSurrogateKeys } from '@/lib/middleware/cache'

async function handler(req: Request) {
  // ... your existing code

  const response = NextResponse.json({ data: blogPosts, pagination })

  // Add Surrogate-Key for cache purging
  setSurrogateKeys(response, ['blog-posts', 'api-response'])

  return response
}

// Export with CORS and caching
export const GET = withCorsAndCache(handler, undefined, cacheConfigs.blogPost)
```

### 2. Update Blog Single Post

Example: `app/api/blog/[slug]/route.ts`

```typescript
import { withCorsAndCache } from '@/lib/middleware/cors'
import { cacheConfigs, setSurrogateKeys } from '@/lib/middleware/cache'

async function handler(req: Request, { params }: { params: { slug: string } }) {
  // ... fetch blog post

  const response = NextResponse.json(blogPost)

  // Add specific Surrogate-Key for this post
  setSurrogateKeys(response, [
    'blog-posts',
    `blog-post-${blogPost.id}`,
    `blog-category-${blogPost.categoryId}`
  ])

  return response
}

export const GET = withCorsAndCache(handler, undefined, cacheConfigs.blogPost)
```

---

## Cache Purging

### Purge Specific Blog Post

```bash
# When you update a blog post
curl -X PURGE https://api.b2bcredit.com/api/blog/how-to-build-credit \
  -H "Fastly-Key: YOUR_API_KEY"
```

### Purge by Surrogate-Key

```bash
# Purge all blog posts
curl -X POST https://api.fastly.com/service/YOUR_SERVICE_ID/purge/blog-posts \
  -H "Fastly-Key: YOUR_API_KEY" \
  -H "Fastly-Soft-Purge: 1"

# Purge specific category
curl -X POST https://api.fastly.com/service/YOUR_SERVICE_ID/purge/blog-category-tech \
  -H "Fastly-Key: YOUR_API_KEY"
```

### Purge from Code (Webhook)

```typescript
// lib/fastly.ts
export async function purgeSurrogateKey(key: string) {
  const response = await fetch(
    `https://api.fastly.com/service/${process.env.FASTLY_SERVICE_ID}/purge/${key}`,
    {
      method: 'POST',
      headers: {
        'Fastly-Key': process.env.FASTLY_API_KEY!,
        'Fastly-Soft-Purge': '1', // Soft purge allows serving stale
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Fastly purge failed: ${response.statusText}`)
  }

  return response.json()
}

// Usage in admin blog update:
await purgeSurrogateKey(`blog-post-${postId}`)
await purgeSurrogateKey('blog-posts') // Purge list pages
```

---

## Environment Variables

Add to `.env`:

```bash
# Fastly Configuration
FASTLY_SERVICE_ID="your_service_id"
FASTLY_API_KEY="your_api_key"

# Update allowed origins for production
NEXT_PUBLIC_FASTLY_CDN="https://api.b2bcredit.com"
```

Add to `.env.example`:

```bash
# Optional: Fastly CDN Configuration
# FASTLY_SERVICE_ID="your_service_id"
# FASTLY_API_KEY="your_api_key"
```

---

## Testing Cache Behavior

### Test Cache Headers

```bash
# Check cache headers
curl -I https://api.b2bcredit.com/api/blog

# Look for:
# Cache-Control: public, max-age=300, s-maxage=600, stale-while-revalidate=1200
# Surrogate-Control: max-age=600
# Surrogate-Key: blog-posts api-response
# X-Cache: MISS (first request)
# X-Cache: HIT (subsequent requests)
```

### Test Authenticated vs Public

```bash
# Without cookie (should cache)
curl -I https://api.b2bcredit.com/api/blog

# With session cookie (should NOT cache)
curl -I https://api.b2bcredit.com/api/applications \
  -H "Cookie: next-auth.session-token=xxx"
```

---

## Monitoring & Analytics

### Real-time Stats API

```bash
# Get real-time stats
curl "https://api.fastly.com/stats/service/YOUR_SERVICE_ID?from=1+hour+ago" \
  -H "Fastly-Key: YOUR_API_KEY"
```

### Key Metrics to Monitor

1. **Cache Hit Ratio**: Target >80% for blog content
2. **Error Rate**: Should be <1%
3. **95th Percentile Response Time**: Target <200ms
4. **Bandwidth**: Track CDN savings vs origin
5. **Purge Requests**: Monitor purge frequency

### Set Up Alerts

In Fastly console, configure alerts for:
- Cache hit ratio drops below 70%
- 5xx error rate exceeds 1%
- Origin response time > 2 seconds

---

## Best Practices

### 1. Cache Granularity

✅ **Good**: Cache individual blog posts with unique Surrogate-Keys
```typescript
setSurrogateKeys(response, [`blog-post-${id}`, 'blog-posts'])
```

❌ **Bad**: Generic keys that purge too much
```typescript
setSurrogateKeys(response, ['blog'])
```

### 2. Soft Purge

Always use soft purge to serve stale content if origin is down:
```bash
-H "Fastly-Soft-Purge: 1"
```

### 3. Grace Period

Set grace period in VCL to serve stale content:
```vcl
set beresp.grace = 3600s; # Serve stale for 1 hour
```

### 4. Stale-While-Revalidate

Use for better UX during cache updates:
```typescript
staleWhileRevalidate: 1200, // 20 minutes
```

---

## Cost Optimization

### Current API Routes

Routes that benefit most from Fastly:

1. **Blog Routes** (public, high traffic)
   - `/api/blog` - List all posts
   - `/api/blog/[slug]` - Individual posts
   - `/api/blog/[slug]/related` - Related posts
   - Expected: 90%+ cache hit rate

2. **Blog Categories** (public, high traffic)
   - `/api/blog/categories`
   - `/api/blog/categories/[id]`
   - Expected: 95%+ cache hit rate

3. **Health Check** (monitoring, very high traffic)
   - `/api/health`
   - Expected: 99%+ cache hit rate

### Routes NOT to Cache

❌ `/api/auth/*` - Authentication
❌ `/api/admin/*` - Admin operations
❌ `/api/applications` - User-specific data
❌ `/api/documents` - Private files
❌ Any POST/PUT/PATCH/DELETE requests

### Estimated Savings

Assuming 1M requests/month:
- **Without Fastly**: 1M requests hit origin
- **With Fastly**: 200K requests hit origin (80% cache hit rate)
- **Savings**: 800K fewer origin requests = reduced server load & faster responses

---

## Troubleshooting

### Cache Not Working

1. Check `X-Cache` header (should be HIT after first request)
2. Verify `Cache-Control` header is set correctly
3. Check VCL rules in Fastly console
4. Ensure no authentication cookies for public routes

### Stale Content After Update

```bash
# Purge specific content
curl -X POST https://api.fastly.com/service/YOUR_SERVICE_ID/purge/blog-post-123 \
  -H "Fastly-Key: YOUR_API_KEY"

# Or purge all blog content
curl -X POST https://api.fastly.com/service/YOUR_SERVICE_ID/purge/blog-posts \
  -H "Fastly-Key: YOUR_API_KEY"
```

### High Origin Load

Check Fastly stats to verify cache hit rate. If low:
1. Increase TTL values
2. Review VCL `vcl_recv` for unnecessary `return(pass)`
3. Check for varying cookies/headers

---

## Next Steps

1. **Set up Fastly account** - https://www.fastly.com/signup
2. **Configure origin** - Point to your deployment
3. **Upload VCL** - Use configuration above
4. **Update DNS** - Point domain to Fastly
5. **Add cache headers** - Update API routes with cache middleware
6. **Test caching** - Verify with curl commands
7. **Monitor metrics** - Watch cache hit rates
8. **Set up purging** - Integrate with admin panel

---

## Resources

- [Fastly Documentation](https://docs.fastly.com/)
- [VCL Reference](https://docs.fastly.com/vcl/)
- [Surrogate Keys Guide](https://docs.fastly.com/en/guides/purging-with-surrogate-keys)
- [API Documentation](https://docs.fastly.com/api/)

---

## Support

For Fastly-specific issues:
- Email: support@fastly.com
- Chat: Available in Fastly console
- Community: https://community.fastly.com/

For implementation help:
- Review `lib/middleware/cache.ts`
- Review `lib/middleware/cors.ts`
- Check OpenAPI spec at `/api-docs`
