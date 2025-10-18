# Coolify Deployment Guide

This guide will help you deploy the B2B Credit SaaS application on Coolify.

## Prerequisites

- A Coolify instance (self-hosted or cloud)
- A domain name (optional, but recommended)
- Git repository access

## Deployment Steps

### 1. Create a New Application in Coolify

1. Log in to your Coolify dashboard
2. Click "New Resource" → "Application"
3. Select your Git source (GitHub, GitLab, etc.)
4. Choose this repository
5. Select the branch to deploy (usually `main`)

### 2. Configure Build Settings

In the application settings:

- **Build Pack**: Docker
- **Dockerfile Location**: `./Dockerfile`
- **Port**: `3000`
- **Base Directory**: `/` (root)

### 3. Add PostgreSQL Database

1. In your Coolify dashboard, go to "Databases"
2. Click "New Database" → "PostgreSQL"
3. Create a new PostgreSQL database
4. Note the connection details provided

### 4. Configure Environment Variables

Add the following environment variables in Coolify's "Environment Variables" section:

#### Required Variables

```bash
# Database (use the connection string from Coolify's PostgreSQL service)
DATABASE_URL=postgresql://username:password@postgres-host:5432/database_name
DIRECT_URL=postgresql://username:password@postgres-host:5432/database_name

# NextAuth (CRITICAL: Generate a new secret!)
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://yourdomain.com

# Application URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Node Environment
NODE_ENV=production
```

#### Optional Variables

```bash
# Email (if using Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### 5. Generate Secrets

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET` value.

### 6. Database Setup

The application will automatically run Prisma migrations on startup via the `scripts/start.sh` script.

If you need to manually run migrations or seed data:

1. Access the Coolify terminal for your application
2. Run: `npx prisma migrate deploy`
3. (Optional) Seed data: `npx prisma db seed`

### 7. Domain Configuration

1. In Coolify, go to your application's "Domains" section
2. Add your domain name
3. Enable SSL/TLS (Coolify will automatically provision Let's Encrypt certificates)
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` with your actual domain

### 8. Deploy

1. Click "Deploy" in Coolify
2. Monitor the build logs
3. Once deployed, verify the application is running

## Post-Deployment

### Health Check

Visit your domain to verify the application is running correctly:
- `https://yourdomain.com` - Homepage
- `https://yourdomain.com/api/health` - API health check (if configured)

### Database Migrations

Migrations run automatically on each deployment via the startup script. To check migration status:

```bash
npx prisma migrate status
```

### Monitoring

- Monitor application logs in Coolify's "Logs" section
- Check database connection in PostgreSQL service logs
- Monitor resource usage (CPU, memory) in Coolify dashboard

## Troubleshooting

### Build Failures

- Check that all environment variables are set correctly
- Verify Dockerfile syntax
- Review build logs in Coolify

### Database Connection Issues

- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Ensure PostgreSQL service is running
- Check network connectivity between services

### Migration Failures

- Check Prisma schema for errors
- Verify database user has necessary permissions
- Review migration logs in application logs

### Runtime Errors

- Check application logs in Coolify
- Verify all required environment variables are set
- Ensure `NEXTAUTH_SECRET` is properly configured

## Architecture

This deployment uses:
- **Multi-stage Docker build** for optimized image size
- **Next.js standalone output** for minimal runtime footprint
- **Automatic database migrations** via startup script
- **PostgreSQL** for data persistence
- **NextAuth** for authentication

## Environment Variables Reference

See `.env.example` for a complete list of environment variables and their descriptions.

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
