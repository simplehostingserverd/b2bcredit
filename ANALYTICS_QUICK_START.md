# Rybbit Analytics - Quick Start

## ✅ Integration Complete

Rybbit Analytics has been successfully integrated into your B2B Credit application!

## 📊 Dashboard Access

**View your analytics:** https://app.rybbit.io

**Site ID:** `a56da861ea4f`

## 🎯 What's Being Tracked

### Automatic Tracking
- ✅ **Page views** - All page navigation
- ✅ **User sessions** - Visitor sessions and journeys
- ✅ **User identification** - Logged-in users (via user ID)

### Custom Events
- ✅ **User registration** - New signups with service type
- ✅ **Login/Logout** - Authentication events
- ✅ **Application saves** - Form submissions
- ✅ **Newsletter subscriptions** - Email signups
- ✅ **Error tracking** - Login and registration errors

## 🚀 Quick Test

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Open browser console and test:
   ```javascript
   window.rybbit.event('test_event', { test: true })
   ```

4. Check your Rybbit dashboard - event should appear within seconds!

## 📁 Key Files

**Analytics Configuration:**
- `.env.development` - Contains your site ID
- `components/RybbitProvider.tsx` - Loads the analytics script
- `lib/analytics/index.ts` - Helper utilities for tracking

**Tracking Implementation:**
- `app/login/page.tsx` - Login events
- `app/register/page.tsx` - Registration events
- `app/application/page.tsx` - Application events
- `components/NewsletterSignup.tsx` - Newsletter events
- `components/Navbar.tsx` - Logout events

## 🎨 Adding New Events

```typescript
// Option 1: Direct API
if (typeof window !== 'undefined' && window.rybbit) {
  window.rybbit.event('button_clicked', { 
    button: 'Get Started',
    location: 'homepage' 
  })
}

// Option 2: Using helper (recommended)
import { trackEvent } from '@/lib/analytics'

trackEvent.ctaClicked({ 
  location: 'homepage', 
  text: 'Get Started' 
})

// Option 3: HTML data attributes
<button 
  data-rybbit-event="cta_clicked"
  data-rybbit-prop-location="homepage"
>
  Click Me
</button>
```

## 🔒 Privacy & Compliance

- **Cookieless** - No cookies used
- **GDPR/CCPA compliant** - Privacy-first design
- **No PII tracking** - User emails/names not tracked in events
- **User IDs only** - Only track internal user IDs (when logged in)

## 📈 Key Metrics to Watch

**User Acquisition:**
- New registrations (by service type)
- Login success rate
- Registration completion rate

**Engagement:**
- Application completion rate
- Newsletter subscription rate
- Time on site
- Pages per session

**Errors:**
- Login failures
- Registration errors
- Application save errors

## 🛠️ Troubleshooting

**Script not loading?**
```bash
# Check environment variables
cat .env.development | grep RYBBIT
```

**Events not appearing?**
1. Check browser console for errors
2. Verify: `console.log(window.rybbit)`
3. Check ad blockers
4. Wait a few seconds and refresh dashboard

**Development vs Production:**
- Development: localhost events are tracked
- Production: Remember to update `NEXT_PUBLIC_RYBBIT_SITE_ID` in production env

## 📚 Full Documentation

- **Complete Guide:** `ANALYTICS.md`
- **Rybbit Docs:** https://rybbit.io/docs
- **API Reference:** https://rybbit.io/docs/api

## 💰 Pricing

Your current plan includes:
- **Free tier:** 10,000 events/month
- Upgrade available for more events and features

Monitor your usage in the Rybbit dashboard.

---

**Questions?** See `ANALYTICS.md` for detailed documentation.
