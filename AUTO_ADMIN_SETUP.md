# Automatic Admin User Setup

## 🎉 No SSH Required!

The admin user is **automatically created during every deployment**. You don't need to SSH into the container or run any manual commands.

---

## Default Admin Credentials

After deployment completes, you can immediately login with:

- **URL:** `https://yourdomain.com/login`
- **Email:** `admin@b2bcredit.com`
- **Password:** `Admin123!`

---

## Custom Admin Credentials

### Option 1: Set Before First Deployment

In Coolify, add these environment variables BEFORE deploying:

```bash
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=YourSecurePassword123
ADMIN_NAME=Your Full Name
```

### Option 2: Update After Deployment

1. Update the environment variables in Coolify
2. Redeploy the application
3. The admin user will be updated with new credentials

---

## How It Works

During container startup (`scripts/start.sh`):

1. ✅ Database migrations run
2. ✅ Admin user created/updated automatically
3. ✅ Application starts

The admin setup runs every time the container starts, ensuring:
- Admin user always exists
- Credentials stay updated if env vars change
- No manual intervention needed

---

## Startup Logs

You'll see this in Coolify deployment logs:

```
Starting application...
Running database migrations...
Setting up admin user...
Email: admin@b2bcredit.com

✓ Admin user created/updated successfully!

Login credentials:
  Email: admin@b2bcredit.com
  Password: Admin123!

Starting Next.js server...
```

---

## Multiple Admins

The auto-setup creates ONE admin user. To create additional admins:

### Method 1: Via Admin Panel (After Login)
1. Login as admin at `/login`
2. Go to `/admin/users`
3. Find user and change role to `ADMIN`

### Method 2: Via SSH (Manual)
```bash
# SSH into container
ADMIN_EMAIL="another@email.com" ADMIN_PASSWORD="Password123" npm run admin:setup
```

### Method 3: Via Database
```bash
# SSH into container
npx prisma studio

# In Prisma Studio:
# 1. Open "User" table
# 2. Find user by email
# 3. Change "role" to "ADMIN"
# 4. Save
```

---

## Security Notes

### Change Default Password!

If using default credentials, **change the password immediately** after first login:

1. Login as admin
2. Go to user settings (or use admin panel)
3. Update password to something secure

### Use Strong Passwords

When setting `ADMIN_PASSWORD` environment variable:
- Minimum 8 characters (32+ recommended)
- Mix of letters, numbers, symbols
- Don't use common passwords

### Password Requirements

The system enforces:
- Minimum length based on validation
- Account lockout after 5 failed attempts (30 min)
- Session expiration after 30 days

---

## Troubleshooting

### Can't Login After Deployment

**Check deployment logs** in Coolify for admin setup output:
- Look for "✓ Admin user created/updated successfully!"
- Check the email and password shown in logs

**Verify environment variables:**
- Go to Coolify → Application → Environment
- Check `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
- Redeploy if you made changes

### Admin User Not Created

**Check startup logs** for errors:
```
Warning: Admin setup failed, but continuing...
```

If you see this, the application still starts but admin wasn't created.

**Common causes:**
- Database not ready (rare, migrations run first)
- Environment variable issues

**Fix:**
```bash
# SSH into container
npm run admin:setup
```

### Multiple Admin Users

The auto-setup only manages ONE admin account (the one specified in env vars).

Other admin users must be created manually via admin panel or database.

---

## What Gets Created

The admin user has these properties:

```javascript
{
  email: 'admin@b2bcredit.com',  // or ADMIN_EMAIL
  password: '<hashed>',            // bcrypt hash of ADMIN_PASSWORD
  name: 'Admin User',              // or ADMIN_NAME
  role: 'ADMIN',
  isLocked: false,
  isDisabled: false,
  failedLoginAttempts: 0,
  lockUntil: null
}
```

If the user already exists, it **updates** their:
- Password
- Name
- Role (ensures ADMIN)
- Unlocks account (resets failed attempts)

---

## Development vs Production

### Development (Local)
```bash
npm run dev
# Admin user NOT auto-created
# Run manually: npm run admin:setup
```

### Production (Docker/Coolify)
```bash
# Admin user auto-created during startup ✅
```

---

## Quick Reference

| Scenario | Action |
|----------|--------|
| First deployment | Use default credentials: admin@b2bcredit.com / Admin123! |
| Custom credentials | Set ADMIN_EMAIL, ADMIN_PASSWORD env vars before deploy |
| Change password | Update ADMIN_PASSWORD env var and redeploy |
| Add more admins | Use admin panel /admin/users |
| Forgot password | Update ADMIN_PASSWORD env var and redeploy |
| Admin locked out | Redeploy (resets lockout) |

---

**Need help?** See `ADMIN_ACCESS_GUIDE.md` for complete admin panel documentation.
