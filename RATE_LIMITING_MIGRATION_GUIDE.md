# Rate Limiting Migration Guide

This guide shows how to apply rate limiting to all API routes in the application.

## Already Implemented

The following routes now have rate limiting:

1. ✅ `/api/auth/register` - **Strict** (10 req/min)
2. ✅ `/api/leads` - **Public** (30 req/min)

## Available Rate Limit Wrappers

Located in `lib/middleware/api-wrapper.ts`:

```typescript
import {
  wrapStrictRoute,   // 10 req/min - for auth endpoints
  wrapPublicRoute,   // 30 req/min - for public endpoints
  wrapAuthRoute,     // 60 req/min - for authenticated users
  wrapAdminRoute,    // 120 req/min - for admin/staff users
  wrapApiRoute       // Custom configuration
} from '@/lib/middleware/api-wrapper'
```

## How to Apply Rate Limiting

### Pattern 1: Refactor existing function

**Before:**
```typescript
export async function POST(req: Request) {
  // ... handler code
}
```

**After:**
```typescript
import { wrapPublicRoute } from '@/lib/middleware/api-wrapper'

async function handler(req: Request) {
  // ... handler code (same as before)
}

export const POST = wrapPublicRoute(handler)
```

### Pattern 2: Multiple HTTP methods

```typescript
import { wrapAuthRoute, wrapAdminRoute } from '@/lib/middleware/api-wrapper'

async function getHandler(req: Request) {
  // GET logic
}

async function postHandler(req: Request) {
  // POST logic
}

export const GET = wrapAuthRoute(getHandler)
export const POST = wrapAdminRoute(postHandler)
```

## Recommended Rate Limits by Route

### Strict Rate Limiting (10 req/min)
Use `wrapStrictRoute` for:
- ✅ `/api/auth/register`
- ⏳ `/api/auth/[...nextauth]` (if custom handlers)
- ⏳ `/api/newsletter/subscribe`
- ⏳ `/api/newsletter/unsubscribe`

### Public Rate Limiting (30 req/min)
Use `wrapPublicRoute` for:
- ✅ `/api/leads`
- ⏳ `/api/blog` (list)
- ⏳ `/api/blog/[slug]` (single post)
- ⏳ `/api/blog/[slug]/related`
- ⏳ `/api/blog/categories`
- ⏳ `/api/blog/categories/[id]`
- ⏳ `/api/health`

### Auth Rate Limiting (60 req/min)
Use `wrapAuthRoute` for:
- ⏳ `/api/applications` (GET, POST, PATCH)
- ⏳ `/api/applications/submit`
- ⏳ `/api/documents`
- ⏳ `/api/documents/[id]`
- ⏳ `/api/onboarding/progress`

### Admin Rate Limiting (120 req/min)
Use `wrapAdminRoute` for:
- ⏳ `/api/admin/leads`
- ⏳ `/api/admin/leads/[id]`
- ⏳ `/api/admin/applications`
- ⏳ `/api/admin/applications/[id]`
- ⏳ `/api/admin/users`
- ⏳ `/api/admin/users/[id]`
- ⏳ `/api/admin/blog`
- ⏳ `/api/admin/blog/[id]`
- ⏳ `/api/admin/newsletter`
- ⏳ `/api/admin/newsletter/[id]`
- ⏳ `/api/status`

## Quick Migration Script

To help migrate all routes, you can use this pattern:

1. Open the route file
2. Find the export (e.g., `export async function POST(req: Request)`)
3. Change to:
   ```typescript
   async function handler(req: Request) { /* existing code */ }
   export const POST = wrapAppropriateWrapper(handler)
   ```
4. Add import at top: `import { wrapAppropriateWrapper } from '@/lib/middleware/api-wrapper'`

## Testing Rate Limits

You can test rate limits with curl:

```bash
# Test strict rate limit (should block after 10 requests)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@example.com","password":"test1234","name":"Test"}' \
    && echo " - Request $i"
done
```

## Route Priority List

### High Priority (Security Critical) 🔴
1. `/api/auth/register` - ✅ DONE
2. `/api/leads` - ✅ DONE
3. `/api/newsletter/subscribe`
4. `/api/newsletter/unsubscribe`

### Medium Priority (User-Facing) 🟡
5. `/api/applications` (all methods)
6. `/api/documents` (all methods)
7. `/api/onboarding/progress`
8. `/api/blog` routes (all)

### Lower Priority (Admin Only) 🟢
9. All `/api/admin/*` routes
10. `/api/status`

## Benefits of Rate Limiting

✅ **DDoS Protection** - Prevents overwhelming the server
✅ **Brute Force Prevention** - Limits password guessing attacks
✅ **Fair Usage** - Ensures all users get access
✅ **Cost Control** - Limits database queries and API calls
✅ **Improved Stability** - Prevents resource exhaustion

## Monitoring Rate Limits

Rate limit headers are automatically added to responses:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - When the limit resets
- `Retry-After` - Seconds until retry (when blocked)

## Production Considerations

The current implementation uses in-memory storage. For production:

1. **Use Redis** for distributed rate limiting:
   ```typescript
   // Install: npm install ioredis
   // Update lib/middleware/rate-limit.ts to use Redis instead of memory
   ```

2. **Monitor rate limit hits** in your logging service

3. **Adjust limits** based on usage patterns

4. **Consider IP whitelisting** for trusted services

## Next Steps

1. Apply rate limiting to remaining 29 routes (see checklist above)
2. Consider adding Redis for production
3. Set up monitoring for rate limit violations
4. Document API rate limits in API_DOCUMENTATION.md
