# Admin Panel - Quick Start

## 🚀 Get Started in 3 Steps

### Step 1: Create Admin User
```bash
npm run admin:setup
```

### Step 2: Start Server (if not running)
```bash
npm run dev
```

### Step 3: Login
1. Go to: http://localhost:3000/login
2. Login with:
   - **Email:** `admin@b2bcredit.com`
   - **Password:** `Admin123!`

## 📍 Admin Routes

After logging in, you can access:

- **Main Dashboard:** http://localhost:3000/admin
  - View all applications and leads
  - See key statistics

- **Blog Management:** http://localhost:3000/admin/blog
  - Create and edit blog posts
  - Manage categories and tags
  - View analytics

- **Navbar:** Click the "Admin" button (purple text)

## 🔐 Default Credentials

**Email:** admin@b2bcredit.com  
**Password:** Admin123!

**⚠️ IMPORTANT:** Change the password in production!

## 🛠️ Troubleshooting

### Can't login?
```bash
# Reset admin password
npm run admin:setup
```

### Database errors?
```bash
# Push schema to database
npx prisma db push --accept-data-loss

# Then recreate admin
npm run admin:setup
```

### Session issues?
1. Clear browser cookies
2. Restart dev server: `npm run dev`

## 📚 Full Documentation

- **ADMIN_SETUP.md** - Complete setup guide with troubleshooting
- **CLAUDE.md** - Full development documentation
- **API_DOCUMENTATION.md** - API reference

## 🎯 Quick Tips

1. **Admin button appears in navbar** only when logged in as ADMIN or STAFF
2. **Role hierarchy:** CLIENT < STAFF < ADMIN
3. **Account lockout:** 5 failed login attempts = 30 minute lockout
4. **Session duration:** 30 days (auto-refresh every 24 hours)

---

**Need help?** See ADMIN_SETUP.md for detailed troubleshooting
