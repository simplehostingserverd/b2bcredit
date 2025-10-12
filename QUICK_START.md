# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Test Accounts

### Admin Account
- Email: `admin@b2bcredit.com`
- Password: `admin123`
- Access: Admin Dashboard at `/admin`

### Client Account
- Email: `client@example.com`
- Password: `client123`
- Access: Client Dashboard at `/dashboard`

## Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Marketing homepage |
| Login | `/login` | User authentication |
| Register | `/register` | New user signup |
| Dashboard | `/dashboard` | Client dashboard |
| Application | `/application` | Funding application form |
| Admin | `/admin` | Admin dashboard |

## Quick Tasks

### Create New Application (as Client)
1. Login as client
2. Go to Dashboard
3. Click "Start Application"
4. Fill out the form
5. Submit for review

### Review Applications (as Admin)
1. Login as admin
2. Go to Admin Dashboard
3. View all submitted applications
4. Process and approve/reject

## Development Tips

### View Database
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma db push --force-reset
npm run db:seed
```

### Check Logs
- Check browser console for frontend errors
- Check terminal for API/server errors

## Common Issues

### Database Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Next Steps

1. **Customize Branding**
   - Update colors in `tailwind.config.ts`
   - Modify logo and company name

2. **Add Email Notifications**
   - Install email service (SendGrid, Postmark)
   - Add email templates
   - Configure SMTP

3. **Deploy to Production**
   - Push to GitHub
   - Deploy on Vercel
   - Switch to PostgreSQL database

4. **Add Payment Integration**
   - Integrate Stripe/PayPal
   - Add subscription plans
   - Implement billing

## Support

For issues, check:
- README.md for detailed documentation
- GitHub issues for known problems
- Contact support team

---

Happy Building! 🚀
