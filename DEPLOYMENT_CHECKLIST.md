# B2B Credit SaaS - Customer Deployment Checklist

## Overview

This checklist will guide you through deploying the B2B Credit SaaS platform to production. The application is ready to deploy and all build issues have been resolved.

---

## ✅ Prerequisites

Before you begin, ensure you have:

- [ ] A server or hosting platform (Coolify, AWS, Vercel, or similar)
- [ ] A PostgreSQL database (version 12 or higher)
- [ ] A domain name (optional but recommended)
- [ ] Node.js 18.x or higher (if self-hosting)
- [ ] Docker installed (if using Docker deployment)

---

## 🔧 Step 1: Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root with these **REQUIRED** variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database_name"
DIRECT_URL="postgresql://username:password@host:5432/database_name"

# NextAuth Configuration (CRITICAL - Generate a new secret!)
NEXTAUTH_SECRET="<YOUR_GENERATED_SECRET_HERE>"
NEXTAUTH_URL="https://yourdomain.com"

# Application URLs
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Environment
NODE_ENV="production"
```

### Generate Security Secrets

**IMPORTANT**: Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET` value.

### Optional Environment Variables

```bash
# Email (if using Resend for transactional emails)
RESEND_API_KEY="re_xxxxxxxxxxxx"

# Analytics (Rybbit - already configured)
NEXT_PUBLIC_RYBBIT_SITE_ID="a56da861ea4f"
NEXT_PUBLIC_RYBBIT_HOST="https://app.rybbit.io"

# Error Tracking (if using Sentry)
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
```

---

## 🗄️ Step 2: Database Setup

### Create PostgreSQL Database

1. Create a new PostgreSQL database
2. Note the connection details (host, port, username, password, database name)
3. Update `DATABASE_URL` and `DIRECT_URL` in your `.env` file

### Initialize Database Schema

Run Prisma migrations to create all tables:

```bash
npx prisma migrate deploy
```

This will create all necessary tables:
- Users
- Applications
- Leads
- Documents
- Blog posts
- Categories
- Newsletter subscribers
- Onboarding profiles
- Email drips

---

## 🚀 Step 3: Choose Your Deployment Method

### Option A: Coolify (Recommended for Simplicity)

See `COOLIFY_DEPLOYMENT.md` for detailed instructions.

**Quick Steps:**
1. Create new application in Coolify
2. Connect your Git repository
3. Set Build Pack to "Docker"
4. Add environment variables from Step 1
5. Create PostgreSQL database in Coolify
6. Deploy!

### Option B: AWS (Recommended for Scale)

See `AWS_DEPLOYMENT_STRATEGY.md` for complete instructions.

**Quick Steps:**
1. Push Docker image to ECR: `./scripts/aws/deploy-to-ecr.sh production`
2. Set up secrets: `./scripts/aws/setup-secrets.sh`
3. Deploy to ECS: `./scripts/aws/quick-deploy.sh production`

### Option C: Docker Compose (Self-Hosted)

**Quick Steps:**

1. Update `.env.docker` with your production values
2. Build and start containers:
   ```bash
   docker-compose up -d
   ```
3. Check logs:
   ```bash
   docker-compose logs -f
   ```

### Option D: Vercel/Netlify

1. Connect your Git repository
2. Add environment variables in platform dashboard
3. Set up PostgreSQL database (e.g., Supabase, Neon, Railway)
4. Deploy from main branch

---

## 👤 Step 4: Create Admin User

After deployment, you need an admin user to access the admin panel.

### Method 1: Using Admin Setup Script (Recommended)

```bash
npm run admin:setup
```

This creates an admin user:
- Email: `admin@b2bcredit.com`
- Password: `Admin123!`

**Custom admin credentials:**
```bash
ADMIN_EMAIL="your@email.com" ADMIN_PASSWORD="YourSecurePassword" npm run admin:setup
```

### Method 2: Using Prisma Studio (Manual)

```bash
npx prisma studio
```

1. Navigate to the Users table
2. Find your user
3. Change `role` from `CLIENT` to `ADMIN`
4. Save changes

### Method 3: Via Database Query

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## ✔️ Step 5: Verify Deployment

### Health Checks

Test these endpoints to verify the application is running:

- [ ] Homepage: `https://yourdomain.com`
- [ ] API Health: `https://yourdomain.com/api/health`
- [ ] API Docs: `https://yourdomain.com/api-docs`
- [ ] Login Page: `https://yourdomain.com/login`
- [ ] Register Page: `https://yourdomain.com/register`

### Test User Flow

- [ ] Register a new user at `/register`
- [ ] Login with the new user at `/login`
- [ ] Access dashboard at `/dashboard`
- [ ] Fill out application form at `/application`
- [ ] Submit application

### Test Admin Flow

- [ ] Login as admin at `/login`
- [ ] Access admin panel at `/admin`
- [ ] View applications in admin panel
- [ ] View leads in admin panel
- [ ] Create a blog post at `/admin/blog/create`

### Check Database Migrations

```bash
npx prisma migrate status
```

All migrations should show as applied.

---

## 🔒 Step 6: Security Configuration

### SSL/TLS Certificate

- [ ] Ensure SSL/TLS is enabled (Let's Encrypt via Coolify/AWS ALB)
- [ ] Verify HTTPS is working
- [ ] Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to use `https://`

### Environment Variables Security

- [ ] Verify `NEXTAUTH_SECRET` is unique and secure (minimum 32 characters)
- [ ] Ensure `.env` is NOT committed to Git
- [ ] Use platform secrets manager (AWS Secrets Manager, Coolify secrets, etc.)

### Database Security

- [ ] Database is not publicly accessible
- [ ] Strong database password is set
- [ ] Database backups are configured

---

## 📧 Step 7: Email Configuration (Optional)

If you want to send emails (password reset, onboarding, notifications):

1. Sign up for Resend: https://resend.com
2. Get API key
3. Add to environment variables:
   ```bash
   RESEND_API_KEY="re_xxxxxxxxxxxx"
   ```
4. Verify email sending at `/api/onboarding/drip`

---

## 📊 Step 8: Analytics Setup (Optional)

### Rybbit Analytics (Already Configured)

The application already has Rybbit analytics integration:
- Site ID: `a56da861ea4f`
- Dashboard: https://app.rybbit.io

To use your own Rybbit account:
1. Sign up at https://rybbit.io
2. Create a new site
3. Update environment variable:
   ```bash
   NEXT_PUBLIC_RYBBIT_SITE_ID="your_site_id"
   ```

### Error Tracking with Sentry (Optional)

1. Sign up for Sentry: https://sentry.io
2. Create a new project
3. Get your DSN
4. Add to environment variables:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
   ```

---

## 📱 Step 9: Domain Configuration

### DNS Setup

Point your domain to your deployment:

**For Coolify:**
1. In Coolify, go to your application → Domains
2. Add your domain
3. Update DNS A record to point to your Coolify server IP
4. Enable SSL/TLS in Coolify

**For AWS:**
1. Create Route 53 hosted zone
2. Point domain to ALB
3. ACM certificate will auto-provision

**For Vercel:**
1. Add domain in Vercel dashboard
2. Update DNS records as instructed
3. SSL is automatic

### Update Environment Variables

After domain is configured:
```bash
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

Redeploy after changing these values.

---

## 🔄 Step 10: Ongoing Maintenance

### Database Backups

- [ ] Set up automated daily backups
- [ ] Test backup restoration process
- [ ] Store backups securely offsite

### Monitoring

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Monitor application logs
- [ ] Monitor database performance
- [ ] Set up alerts for errors

### Updates

When updating the application:

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Rebuild and deploy
npm run build
```

---

## 🆘 Troubleshooting

### Build Fails

**Error: TypeScript compilation errors**
- Solution: The build now works! If you encounter new errors, check `tsconfig.json` excludes `FullstackAgent` directory.

**Error: Prisma Client not generated**
- Solution: Run `npx prisma generate` before building.

### Database Connection Issues

**Error: "Database connection failed"**
- Check `DATABASE_URL` is correct
- Verify database is running and accessible
- Check network/firewall rules
- Ensure database user has necessary permissions

**Error: "Migration failed"**
- Check database permissions
- Verify Prisma schema is valid
- Review migration logs

### Authentication Issues

**Error: "Invalid session" or login doesn't work**
- Verify `NEXTAUTH_SECRET` is set correctly
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again
- Ensure database has User table

### Application Runtime Errors

**Error: "Environment variables missing"**
- Verify all required environment variables are set
- Check `.env` file exists and is loaded
- Restart the application after changing environment variables

**Error: "500 Internal Server Error"**
- Check application logs
- Verify database connection
- Check for missing environment variables
- Review Sentry error reports (if configured)

---

## 📚 Additional Resources

### Documentation Files

- `README.md` - General project overview
- `CLAUDE.md` - Development guide and commands
- `API_DOCUMENTATION.md` - Complete API reference
- `COOLIFY_DEPLOYMENT.md` - Coolify deployment guide
- `AWS_DEPLOYMENT_STRATEGY.md` - AWS deployment guide
- `DEPLOYMENT_SUMMARY.md` - Docker and deployment overview
- `ADMIN_SETUP.md` - Admin user setup guide
- `ANALYTICS.md` - Analytics integration guide
- `FEATURES.md` - Complete feature list

### Key Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:full         # Start with PostgreSQL

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration
npx prisma migrate deploy # Apply migrations
npm run db:seed          # Seed sample data

# Admin
npm run admin:setup      # Create admin user

# Building
npm run build            # Build for production
npm start                # Start production server

# Docker
docker-compose up -d     # Start containers
docker-compose logs -f   # View logs
docker-compose down      # Stop containers

# Testing
npm test                 # Run tests
npm run test:coverage    # Coverage report
```

### Support Contacts

- Platform Documentation: See docs folder
- Database Issues: Check Prisma docs at https://www.prisma.io/docs
- NextAuth Issues: See https://next-auth.js.org/
- Next.js Issues: See https://nextjs.org/docs

---

## ✅ Final Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] Database is set up and migrations are applied
- [ ] Admin user is created and tested
- [ ] SSL/TLS certificate is working
- [ ] Domain is configured and DNS is propagated
- [ ] All health check endpoints return 200 OK
- [ ] User registration and login work
- [ ] Admin panel is accessible
- [ ] Email sending works (if configured)
- [ ] Analytics tracking works
- [ ] Database backups are configured
- [ ] Monitoring and alerts are set up
- [ ] Application logs are accessible

---

## 🎉 Deployment Complete!

Your B2B Credit SaaS platform is now live and ready for customers!

**Next Steps:**
1. Test all critical user flows
2. Monitor logs for the first 24 hours
3. Set up ongoing maintenance schedule
4. Configure additional integrations as needed
5. Customize content, branding, and settings

**Need Help?**
- Review documentation in project root
- Check application logs for error details
- Review this checklist for common issues
- Consult platform-specific documentation

---

**Last Updated:** October 20, 2025
**Build Status:** ✅ Verified Working
**Deployment Ready:** Yes
