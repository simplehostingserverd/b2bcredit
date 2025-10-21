# Admin Panel Setup Guide

## Quick Start

### 1. Create Admin User

Run the setup script to create an admin user:

```bash
npm run admin:setup
```

**Default credentials:**
- Email: `admin@b2bcredit.com`
- Password: `Admin123!`

**Custom credentials:**
```bash
ADMIN_EMAIL="your@email.com" ADMIN_PASSWORD="YourPassword" ADMIN_NAME="Your Name" npm run admin:setup
```

### 2. Login

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/login

3. Login with your admin credentials

4. You'll be redirected to `/dashboard`, but as an admin you can also access:
   - `/admin` - Main admin dashboard
   - `/admin/blog` - Blog management
   - Click the "Admin" button in the navbar

## Troubleshooting

### Cannot Login

**Problem:** Invalid email or password error

**Solutions:**

1. **Reset the admin password:**
   ```bash
   npm run admin:setup
   ```
   This will reset the password to `Admin123!`

2. **Check if account is locked:**
   After 5 failed login attempts, accounts are locked for 30 minutes. Reset with:
   ```bash
   npm run admin:setup
   ```

3. **Verify database connection:**
   ```bash
   npx prisma studio
   ```
   Check that the user exists with role `ADMIN` and `isLocked: false`, `isDisabled: false`

### Database Issues

**Problem:** Database connection errors

**Solutions:**

1. **Verify DATABASE_URL in .env:**
   ```bash
   cat .env.development | grep DATABASE_URL
   ```

2. **Push schema to database:**
   ```bash
   npx prisma db push
   ```

3. **Check database is running:**
   - For local PostgreSQL: `pg_isready`
   - For Docker: `docker ps | grep postgres`

### Session/Auth Issues

**Problem:** Logged in but immediately redirected to login

**Solutions:**

1. **Clear browser cookies and cache**

2. **Verify NEXTAUTH_SECRET is set:**
   ```bash
   cat .env.development | grep NEXTAUTH_SECRET
   ```

3. **Check NEXTAUTH_URL matches your development URL:**
   ```bash
   cat .env.development | grep NEXTAUTH_URL
   ```
   Should be `http://localhost:3000` for development

4. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## Admin Panel Features

### Main Dashboard (`/admin`)

- View all applications with status breakdown
- View all leads with current status
- See statistics at a glance:
  - Total applications
  - Pending reviews
  - Approved applications
  - Total leads
  - New leads
  - Qualified leads

### Blog Management (`/admin/blog`)

- Create new blog posts
- Edit existing posts
- Manage drafts
- Schedule posts
- View analytics
- Manage categories

### API Access

Admins have access to additional API endpoints:

- `GET /api/admin/applications` - List all applications
- `PATCH /api/admin/applications/:id` - Update application status
- `DELETE /api/admin/applications/:id` - Delete application

- `GET /api/admin/leads` - List all leads
- `POST /api/admin/leads` - Create lead
- `PATCH /api/admin/leads/:id` - Update lead
- `DELETE /api/admin/leads/:id` - Delete lead

- `GET /api/admin/blog` - List all blog posts (including drafts)
- `POST /api/admin/blog` - Create blog post
- `PATCH /api/admin/blog/:id` - Update blog post
- `DELETE /api/admin/blog/:id` - Delete blog post

- `GET /api/admin/newsletter` - Manage newsletter subscribers

## User Roles

### CLIENT (Default)
- Can create and manage their own application
- Access to dashboard and onboarding
- Cannot access admin routes

### STAFF
- Can view and manage all applications
- Can view and manage all leads
- Cannot access certain admin-only features
- Access to `/admin` dashboard

### ADMIN
- Full system access
- Can manage all users, applications, and leads
- Can manage blog content
- Can manage newsletter subscribers
- Access to all admin routes

## Changing User Roles

### Via Prisma Studio
```bash
npx prisma studio
```
1. Navigate to the `users` table
2. Find the user
3. Change the `role` field to `ADMIN`, `STAFF`, or `CLIENT`
4. Save changes

### Via Script
Create a file `scripts/set-role.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setRole(email: string, role: 'CLIENT' | 'STAFF' | 'ADMIN') {
  const user = await prisma.user.update({
    where: { email },
    data: { role },
  })
  console.log(`Updated ${email} to role: ${role}`)
}

const email = process.argv[2]
const role = process.argv[3] as 'CLIENT' | 'STAFF' | 'ADMIN'

if (!email || !role) {
  console.error('Usage: tsx scripts/set-role.ts <email> <role>')
  process.exit(1)
}

setRole(email, role).then(() => prisma.$disconnect())
```

Run with:
```bash
npx tsx scripts/set-role.ts user@example.com ADMIN
```

## Security Notes

1. **Change default password immediately in production**
2. **Use strong passwords** (minimum 12 characters, mix of letters, numbers, symbols)
3. **Enable 2FA** (future enhancement)
4. **Regular security audits** of admin accounts
5. **Monitor failed login attempts** via audit logs
6. **Account lockout** after 5 failed attempts (30 minute lockout)

## Development vs Production

### Development
- Default admin credentials are acceptable
- NEXTAUTH_URL: `http://localhost:3000`
- Database can be local PostgreSQL or Docker

### Production
- **MUST** change all default passwords
- **MUST** use strong NEXTAUTH_SECRET (generate with `openssl rand -base64 32`)
- NEXTAUTH_URL: Your production domain (e.g., `https://yourdomain.com`)
- Use managed database (e.g., AWS RDS, Supabase)
- Enable HTTPS only
- Set up proper environment variables

## Next Steps

1. ✓ Create admin user
2. ✓ Login to admin panel
3. Create additional staff users if needed
4. Customize admin dashboard for your needs
5. Set up production environment with secure credentials
