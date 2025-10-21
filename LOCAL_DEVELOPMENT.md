# Local Development Guide

## Quick Start

### Option 1: Full Stack (Recommended)

Run both database and Next.js app together:

```bash
npm run dev:full
```

This starts:
- **PostgreSQL database** in Docker (port 5432)
- **Next.js dev server** (port 3000)

### Option 2: Separate Commands

Start database and app separately:

```bash
# Terminal 1: Start database
npm run docker:db

# Terminal 2: Start Next.js app
npm run dev
```

### Option 3: Development Only

If you already have PostgreSQL running locally:

```bash
npm run dev
```

## Available Scripts

### Development

```bash
npm run dev              # Start Next.js dev server only
npm run dev:full         # Start database + Next.js (concurrently)
npm run dev:https        # Start with HTTPS support
```

### Database Management

```bash
npm run docker:db        # Start PostgreSQL in Docker
npm run docker:db:down   # Stop PostgreSQL Docker container
npx prisma studio        # Open Prisma Studio GUI
npx prisma db push       # Push schema to database
npm run db:seed          # Seed database with sample data
npm run admin:setup      # Create/reset admin user
```

### Docker (Production)

```bash
npm run docker:up        # Start full stack in Docker (production mode)
npm run docker:down      # Stop all Docker containers
npm run docker:build     # Rebuild Docker images
npm run docker:logs      # View Docker logs
```

### Testing

```bash
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
```

## First Time Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example env file:

```bash
cp .env.example .env.development
```

The default values should work for local development.

### 3. Start Database

```bash
npm run docker:db
```

### 4. Push Database Schema

```bash
npx prisma db push
```

### 5. Create Admin User

```bash
npm run admin:setup
```

Default credentials:
- Email: `admin@b2bcredit.com`
- Password: `Admin123!`

### 6. Start Development Server

```bash
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Prisma Studio**: http://localhost:5555 (run `npx prisma studio`)
- **API Docs**: http://localhost:3000/api-docs

## Database

### PostgreSQL via Docker

The development database runs in Docker with these defaults:
- **Host**: localhost
- **Port**: 5432
- **Database**: b2b_credit_db
- **User**: postgres
- **Password**: postgres

### Connection String

```
postgresql://postgres:postgres@localhost:5432/b2b_credit_db
```

### Managing Data

**Reset database:**
```bash
npm run docker:db:down
npm run docker:db
npx prisma db push
npm run admin:setup
```

**View data:**
```bash
npx prisma studio
```

**Seed sample data:**
```bash
npm run db:seed
npm run db:seed:blog
```

## Analytics (Rybbit)

Rybbit Analytics is configured and ready to use:

- **Site ID**: `a56da861ea4f`
- **Dashboard**: https://app.rybbit.io/2935/main

### Testing Analytics

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in browser

3. Open browser console and test:
   ```javascript
   window.rybbit.event('test_event', { test: true })
   ```

4. Check Rybbit dashboard for the event

### CSP Configuration

The Content Security Policy has been configured to allow Rybbit:
- Script source: `https://app.rybbit.io`
- Connect source: `https://app.rybbit.io`

## Troubleshooting

### Database Connection Issues

**Error**: "Can't reach database server"

**Solution**:
```bash
# Check if Docker is running
docker ps

# Restart database
npm run docker:db:down
npm run docker:db

# Push schema again
npx prisma db push
```

### Port Already in Use

**Error**: "Port 3000 is already in use"

**Solution**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### CSP Blocking Scripts

**Error**: "Refused to load ... because it does not appear in the script-src directive"

**Solution**: The CSP has been configured in `middleware.ts` and `next.config.js` to allow:
- Rybbit Analytics (`https://app.rybbit.io`)
- Inline scripts (for Next.js)
- Unsafe eval (for development)

If you need to add more domains, update both files.

### Prisma Client Not Generated

**Error**: "Cannot find module '@prisma/client'"

**Solution**:
```bash
npx prisma generate
```

### Migration Issues

**Error**: Migration conflicts

**Solution** (development only):
```bash
# Reset database
npm run docker:db:down
npm run docker:db
npx prisma db push
```

## Environment Variables

### Required

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/b2b_credit_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Optional

```bash
# Analytics
NEXT_PUBLIC_RYBBIT_SITE_ID="a56da861ea4f"
NEXT_PUBLIC_RYBBIT_HOST="https://app.rybbit.io"

# Email (optional)
RESEND_API_KEY="your-resend-api-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Hot Reload

Next.js supports hot module replacement (HMR):
- Frontend changes reload automatically
- API route changes reload automatically
- Environment variable changes require server restart

**To restart**:
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Development Workflow

### Making Database Changes

1. Update `prisma/schema.prisma`
2. Push changes: `npx prisma db push`
3. Regenerate client: `npx prisma generate` (auto-runs)

### Adding New Features

1. Create feature branch
2. Make changes
3. Run tests: `npm test`
4. Check types: `npm run build`
5. Lint: `npm run lint`

### Testing

```bash
# Watch mode (recommended)
npm test

# Run once
npm run test:run

# With UI
npm run test:ui

# Coverage
npm run test:coverage
```

## IDE Setup

### VS Code

Recommended extensions:
- Prisma
- ESLint
- Tailwind CSS IntelliSense
- PostgreSQL

### WebStorm/IntelliJ

Enable:
- Node.js integration
- Prisma support
- ESLint
- TypeScript

## Performance Tips

1. **Use `dev:full` for one-command startup**
   ```bash
   npm run dev:full
   ```

2. **Keep Prisma Studio open for database inspection**
   ```bash
   npx prisma studio
   ```

3. **Use test watch mode for TDD**
   ```bash
   npm test
   ```

4. **Monitor Docker resource usage**
   ```bash
   docker stats
   ```

## Next Steps

- **Admin Panel**: http://localhost:3000/admin
- **API Documentation**: See `API_DOCUMENTATION.md`
- **Analytics**: See `ANALYTICS.md`
- **Deployment**: See `COOLIFY_DEPLOYMENT.md`

---

**Need help?** Check the main `README.md` or `CLAUDE.md` for complete documentation.
