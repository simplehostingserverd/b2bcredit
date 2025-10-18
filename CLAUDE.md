# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

B2B Credit Building SaaS - A Next.js-based platform for business funding and credit building with onboarding flows, blog/CMS, and role-based access control.

**Tech Stack:**
- Next.js 15 (App Router) + React 18 + TypeScript
- NextAuth.js for authentication (JWT sessions)
- Prisma ORM with PostgreSQL
- Tailwind CSS
- Vitest + Testing Library for tests
- TipTap for rich text editing (blog content)

## Development Commands

### Running the Application
```bash
npm run dev              # Start development server at http://localhost:3000
npm run dev:https        # Start with HTTPS (uses server.js)
npm run build            # Build for production
npm start                # Start production server
```

### Database Management
```bash
npx prisma generate      # Generate Prisma Client (auto-runs after npm install)
npx prisma db push       # Push schema changes to database (development)
npx prisma migrate dev   # Create and apply migration
npx prisma migrate deploy # Apply migrations (production)
npx prisma studio        # Open Prisma Studio database GUI
npm run db:seed          # Seed database with sample data (prisma/seed.ts)
npm run db:seed:blog     # Seed blog posts only (prisma/seed-blog-posts.ts)
```

### Testing
```bash
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Generate coverage report
```

Run a single test file:
```bash
npx vitest run app/api/auth/__tests__/register.test.ts
```

### Linting
```bash
npm run lint             # Run ESLint
```

### Deployment
```bash
docker build -t b2bcredit .
docker-compose up
```

See `COOLIFY_DEPLOYMENT.md` for Coolify-specific deployment instructions.

## Architecture

### Authentication & Authorization

**NextAuth Configuration:** `lib/auth.ts`
- Strategy: JWT sessions
- Provider: Credentials (email/password with bcrypt)
- Custom callbacks extend session with user ID, role, and serviceType
- Protected routes: `/dashboard/*`, `/application/*`, `/admin/*` (via `middleware.ts`)

**Role-Based Access Control (RBAC):** `lib/middleware/rbac.ts`
- **CLIENT**: Standard users, can manage their own applications
- **STAFF**: Can view/manage all leads and applications
- **ADMIN**: Full system access

Key RBAC functions:
- `requireAuth()` - Verify user is logged in
- `requireRoles(['ADMIN', 'STAFF'])` - Require specific roles
- `requireAdmin()` - Admin-only access
- `requireAdminOrStaff()` - Staff or admin access
- `requireOwnerOrAdmin(resourceUserId)` - User owns resource or is admin

### API Route Patterns

All API routes follow consistent patterns:

1. **Authentication Check**: Use RBAC middleware functions
2. **Validation**: Zod schemas in `lib/middleware/validation.ts`
3. **Response Format**: Use utilities from `lib/utils/response.ts`
4. **Error Handling**: Use utilities from `lib/utils/errors.ts`
5. **Audit Logging**: Critical operations logged via `lib/utils/audit.ts`
6. **Transactions**: Use wrappers from `lib/utils/transactions.ts` for multi-step operations

Example API route structure:
```typescript
import { requireAuth } from '@/lib/middleware/rbac'

export async function GET() {
  const { user, error } = await requireAuth()
  if (error) return error

  // ... business logic
}
```

### Database Architecture

**Prisma Schema:** `prisma/schema.prisma`

Core Models:
- **User**: Authentication + role management. Relations: applications, onboarding, blogPosts, emailDrips
- **Lead**: Potential customers before conversion. Can be assigned to staff members
- **Application**: Funding applications (one per user). Status workflow: DRAFT → SUBMITTED → REVIEWED → APPROVED/REJECTED
- **Document**: File attachments for applications (cascade delete)
- **OnboardingProfile**: Tracks multi-day onboarding progress per user
- **EmailDrip**: Scheduled/sent onboarding emails with tracking
- **BlogPost**: CMS content with SEO fields, categories, tags, scheduling
- **Category**: Blog categories with SEO metadata
- **NewsletterSubscriber**: Newsletter management with interests and unsubscribe tracking

**Important Relationships:**
- User → Application is 1:1 (one application per user via unique userId)
- Lead → Application is 1:1 (optional, via unique leadId)
- Application → Document is 1:many (cascade delete)
- User has optional OnboardingProfile (cascade delete)

### Testing Architecture

**Framework:** Vitest with happy-dom environment
**Config:** `vitest.config.ts`, setup in `vitest.setup.ts`

Test patterns:
- Mock Prisma client using `vi.mock('@/lib/prisma')`
- Mock bcryptjs for password hashing tests
- Use `vi.mocked()` for type-safe mocks
- Test file naming: `*.test.ts` or `*.spec.ts`
- Example: `app/api/auth/__tests__/register.test.ts`

Running specific tests:
```bash
npx vitest run path/to/test.test.ts
```

### Onboarding System

Multi-step onboarding flow tracked in `OnboardingProfile`:
- Progress tracked via `completionPercentage`, `currentStep`, `isCompleted`
- Email drip campaign with scheduled sends (Day 0, 1, 2, 3, 4, 5, 7, 10)
- Routes: `/onboarding/step-1`, `/onboarding/step-2`, `/onboarding/step-3`
- API: `/api/onboarding/progress` - GET/POST for progress tracking
- Email tracking: opened/clicked status in `EmailDrip` model

### Blog/CMS System

**Rich Text Editor:** TipTap with extensions (code blocks, tables, images, links, etc.)
**Components:** `BlogEditor.tsx`, `BlogTemplates.tsx`, `ImageManager.tsx`, `ImageUpload.tsx`

Key features:
- SEO metadata: metaTitle, metaDescription, jsonLd (structured data), canonicalUrl
- Status workflow: DRAFT → PUBLISHED (or SCHEDULED)
- Categories and tags for organization
- Related posts functionality
- Reading time calculation
- View count tracking
- Social sharing component

API Routes:
- Public: `/api/blog` (list), `/api/blog/[slug]` (single post), `/api/blog/[slug]/related`
- Admin: `/api/admin/blog` (CRUD with drafts), `/api/admin/blog/analytics`
- Categories: `/api/blog/categories`, `/api/blog/categories/[id]`

Admin pages:
- `/admin/blog` - List all posts (including drafts)
- `/admin/blog/create` - Create new post with TipTap editor

### Newsletter System

**Model:** `NewsletterSubscriber`
**Features:** Interests tracking, source attribution, active/inactive status, unsubscribe handling

API Routes:
- `/api/newsletter/subscribe` - POST to subscribe (public)
- `/api/newsletter/unsubscribe` - POST to unsubscribe (public)
- `/api/admin/newsletter` - Admin management with pagination/search

### Application Flow

1. **User Registration** (`/register`): Creates User + optional Application (if businessName provided)
2. **Dashboard** (`/dashboard`): View application status, next steps
3. **Application Form** (`/application`): Multi-section form for business details, financials, funding request
4. **Submit** (`/api/applications/submit`): Changes status from DRAFT to SUBMITTED
5. **Admin Review** (`/admin`): Staff/admin reviews and updates status

### Environment Variables

See `.env.example` for full reference. Critical variables:

**Database:**
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct connection for migrations (same as DATABASE_URL unless using pooling)

**Authentication:**
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Application URL (e.g., https://yourdomain.com)

**Application:**
- `NEXT_PUBLIC_APP_URL` - Public URL for client-side use
- `NODE_ENV` - development | production

**Optional:**
- `RESEND_API_KEY` - For transactional emails

### Docker Deployment

**Multi-stage build:** `Dockerfile`
1. Builder stage: Install deps, generate Prisma Client, build Next.js
2. Runner stage: Minimal production image with standalone output
3. Startup script: `scripts/start.sh` runs migrations then starts server

**Key configuration:**
- Output mode: `standalone` in `next.config.js`
- Prisma files copied manually for migrations in production
- Non-root user (nextjs:nodejs) for security
- Auto-migration on startup via `start.sh`

### Image Handling

**Next.js Image Configuration:** `next.config.js`
- Remote patterns allow images from `images.unsplash.com`
- Add additional domains as needed for blog images

**Blog Images:**
- Upload via `/api/upload/image` route
- Managed via `ImageManager` and `ImageUpload` components
- TipTap editor supports inline images

### SEO & Metadata

**Dynamic metadata generation:**
- `app/robots.ts` - Robots.txt configuration
- `app/sitemap.ts` - Dynamic sitemap generation
- Blog posts include JSON-LD structured data
- Category pages have dedicated SEO fields

### Common Workflows

**Creating a new admin user:**
```bash
npm run db:seed  # Creates admin@b2bcredit.com (password: admin123)
```

Or manually via Prisma Studio:
```bash
npx prisma studio  # Change user role to ADMIN
```

**Adding a new API endpoint:**
1. Create route file: `app/api/[resource]/route.ts`
2. Import RBAC middleware: `import { requireAuth } from '@/lib/middleware/rbac'`
3. Add authentication check using RBAC functions
4. Use response/error utilities for consistency
5. Add validation with Zod
6. Write tests in `app/api/[resource]/__tests__/`

**Database schema changes:**
```bash
# 1. Update prisma/schema.prisma
# 2. Create migration:
npx prisma migrate dev --name description_of_change
# 3. Migration file created in prisma/migrations/
```

**Adding a protected page:**
1. Create page in `app/[route]/page.tsx`
2. Add route to `middleware.ts` config matcher if authentication required
3. Use `getServerSession(authOptions)` in Server Components for auth checks
4. For role-based access, check `session.user.role` manually or use RBAC utilities

### Repository Conventions

- TypeScript strict mode enabled
- ESLint configured but disabled during builds (`ignoreDuringBuilds: true`)
- TypeScript checks enabled during builds (`ignoreBuildErrors: false`)
- Standalone output for optimized Docker deployments
- Tests use Vitest with happy-dom (not jsdom)
- API routes return consistent JSON error/success formats
- All database operations use Prisma Client (`lib/prisma.ts` with singleton pattern)

### Key Files Reference

- `lib/auth.ts` - NextAuth configuration
- `lib/prisma.ts` - Prisma Client singleton
- `lib/middleware/rbac.ts` - Role-based access control
- `lib/middleware/validation.ts` - Zod validation schemas
- `lib/middleware/rate-limit.ts` - Rate limiting middleware
- `lib/utils/errors.ts` - Error handling utilities
- `lib/utils/response.ts` - API response formatting
- `lib/utils/audit.ts` - Audit logging
- `lib/utils/transactions.ts` - Database transaction wrappers
- `middleware.ts` - Next.js middleware for route protection
- `API_DOCUMENTATION.md` - Complete API reference
- `COOLIFY_DEPLOYMENT.md` - Deployment guide
