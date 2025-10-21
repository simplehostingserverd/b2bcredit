# Admin Panel Access Guide

## Quick Start

### Step 1: Create Admin User

After deploying to Coolify, create an admin user:

**Option A: Default Admin**
```bash
# SSH into your Coolify container or use Coolify's terminal
npm run admin:setup
```

This creates:
- Email: `admin@b2bcredit.com`
- Password: `Admin123!`

**Option B: Custom Admin**
```bash
ADMIN_EMAIL="your@email.com" ADMIN_PASSWORD="YourPassword123" npm run admin:setup
```

### Step 2: Login

1. Go to: `https://yourdomain.com/login`
2. Enter admin credentials
3. Click "Sign In"

### Step 3: Access Admin Panel

After login, you can access the admin panel in two ways:

1. **Via URL:** Navigate to `https://yourdomain.com/admin`
2. **Via Navbar:** Click the "Admin" link (appears when logged in as admin)

---

## Admin Panel Features

### Dashboard (`/admin`)
- Overview of applications and leads
- Quick stats and metrics

### Applications (`/admin` → Applications tab)
- View all funding applications
- Update application status (Review, Approve, Reject)
- View applicant details
- See uploaded documents

### Leads (`/admin` → Leads tab)
- View all leads
- Assign leads to staff members
- Track lead status
- Convert leads to applications

### Blog Management (`/admin/blog`)
- Create new blog posts
- Edit existing posts
- Publish/unpublish posts
- Manage categories and tags
- View analytics

### Newsletter (`/admin/newsletter`)
- View subscribers
- Manage subscriptions
- Export subscriber list

### User Management (`/admin/users`)
- View all users
- Change user roles (CLIENT, STAFF, ADMIN)
- Enable/disable accounts

---

## Troubleshooting

### "Access Denied" or 403 Error

**Problem:** User doesn't have admin privileges

**Solution:**
```bash
# SSH into container
npx prisma studio

# In Prisma Studio:
# 1. Open "User" table
# 2. Find your user by email
# 3. Change "role" field to "ADMIN"
# 4. Save
```

Or via database query:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### Can't Login

**Problem:** Forgot password

**Solution:**
```bash
# Reset password for existing admin
ADMIN_EMAIL="admin@b2bcredit.com" ADMIN_PASSWORD="NewPassword123" npm run admin:setup
```

### Admin Link Not Showing in Navbar

**Problem:** User is logged in but not as admin

**Solution:**
- The "Admin" link only appears for users with `ADMIN` or `STAFF` role
- Verify your role in the database (should be `ADMIN`)
- Log out and log back in after role change

---

## User Roles

### CLIENT
- Default role for new registrations
- Can create and manage their own application
- Access to: `/dashboard`, `/application`

### STAFF
- Can view all applications and leads
- Can update application status
- Access to: `/admin` (limited features)

### ADMIN
- Full system access
- User management
- All admin features
- Access to: `/admin` (all features)

---

## Security Notes

- **Change default password** immediately after first login
- Admin passwords must be at least 32 characters (enforced)
- Account locks after 5 failed login attempts (30-minute lockout)
- Sessions expire after 30 days of inactivity

---

## Creating Additional Admin Users

### Via Terminal
```bash
ADMIN_EMAIL="newadmin@company.com" ADMIN_PASSWORD="SecurePass123" npm run admin:setup
```

### Via Existing Admin Account
1. Login as admin
2. Go to `/admin/users`
3. Find the user
4. Change their role to `ADMIN`

### Via Database (Advanced)
```bash
# Open Prisma Studio
npx prisma studio

# Or via SQL
UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@email.com';
```

---

## Quick Reference

| Action | Command | Location |
|--------|---------|----------|
| Create admin | `npm run admin:setup` | SSH/Terminal |
| Login | Navigate to `/login` | Browser |
| Admin panel | Navigate to `/admin` | Browser |
| Reset password | `ADMIN_EMAIL=... npm run admin:setup` | SSH/Terminal |
| View users | Prisma Studio or `/admin/users` | Browser/Terminal |

---

**Need Help?**

Check the main documentation:
- `DEPLOYMENT_CHECKLIST.md` - Full deployment guide
- `QUICK_HANDOFF.md` - Quick start guide
- `ADMIN_SETUP.md` - Detailed admin setup
