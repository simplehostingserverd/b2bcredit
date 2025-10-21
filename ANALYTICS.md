# Rybbit Analytics Integration

This application uses **Rybbit Analytics** - an open-source, privacy-friendly alternative to Google Analytics that is cookieless and GDPR/CCPA compliant.

## Overview

Rybbit Analytics is integrated throughout the application to track:
- User interactions (login, registration, logout)
- Application submissions and saves
- Newsletter subscriptions
- Blog post views
- Error occurrences
- Custom events

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
NEXT_PUBLIC_RYBBIT_SITE_ID="your-site-id-here"
NEXT_PUBLIC_RYBBIT_HOST="https://app.rybbit.io"
```

**Current configuration:**
- Site ID: `a56da861ea4f`
- Host: `https://app.rybbit.io` (Rybbit hosted service)

### Dashboard Access

View your analytics at: https://app.rybbit.io

## Implementation Details

### Automatic Tracking

The Rybbit script is automatically loaded in all pages via the `RybbitProvider` component in `components/RybbitProvider.tsx`. It tracks:

- **Page views**: Automatically tracked on route changes (Next.js App Router)
- **User identification**: Users are automatically identified when logged in via their user ID
- **Session data**: User sessions are automatically tracked

### Manual Event Tracking

Events are tracked throughout the application using the `window.rybbit.event()` API.

#### Key Events Tracked

**Authentication Events:**
- `user_registered` - New user registration
  - Properties: `serviceType`, `hasBusinessName`
- `user_logged_in` - Successful login
  - Properties: `method` (e.g., "credentials")
- `user_logged_out` - User logout
- `login_failed` - Failed login attempt
  - Properties: `error`

**Application Events:**
- `application_saved` - Application form saved
  - Properties: `businessType`, `fundingAmount`
- `application_submitted` - Application submitted for review
  - Properties: `fundingAmount`, `businessType`
- `application_status_changed` - Admin updates application status
  - Properties: `status`, `previousStatus`

**Newsletter Events:**
- `newsletter_subscribed` - User subscribed to newsletter
  - Properties: `source` (e.g., "blog", "homepage")
- `newsletter_subscribe_failed` - Subscription failed
  - Properties: `error`

**Error Events:**
- `login_error` - Login system error
- `registration_error` - Registration system error
- `application_save_error` - Application save error

### Analytics Utility

A helper utility is available at `lib/analytics/index.ts` with pre-defined event tracking functions:

```typescript
import { trackEvent } from '@/lib/analytics'

// Track user registration
trackEvent.userRegistered({ serviceType: 'funding' })

// Track application submission
trackEvent.applicationSubmitted({ 
  fundingAmount: 50000, 
  businessType: 'LLC' 
})

// Track newsletter subscription
trackEvent.newsletterSubscribed({ source: 'blog' })

// Track custom CTA clicks
trackEvent.ctaClicked({ 
  location: 'homepage', 
  text: 'Get Started' 
})
```

## Files Modified

**New Files:**
- `lib/analytics/rybbit.d.ts` - TypeScript definitions for Rybbit
- `lib/analytics/index.ts` - Analytics helper utilities
- `components/RybbitProvider.tsx` - Script loader and auto-identification

**Modified Files:**
- `.env.development` - Added Rybbit configuration
- `.env.example` - Added Rybbit configuration template
- `components/Providers.tsx` - Integrated RybbitProvider
- `app/login/page.tsx` - Added login event tracking
- `app/register/page.tsx` - Added registration event tracking
- `app/application/page.tsx` - Added application save tracking
- `components/Navbar.tsx` - Added logout event tracking
- `components/NewsletterSignup.tsx` - Added newsletter subscription tracking

## Features

### Privacy-Friendly
- **No cookies required** - Fully cookieless tracking
- **GDPR/CCPA compliant** - Privacy-first by design
- **User identification** - Only when users are logged in (using user IDs)

### Real-Time Analytics
- Live visitor tracking
- Real-time event monitoring
- Session replay (configurable)
- Web vitals monitoring

### Advanced Features
- User journey tracking
- Funnel analysis
- Goal conversion tracking
- Custom event properties
- User profiles

## Accessing Analytics

### View Analytics Dashboard

1. Go to https://app.rybbit.io
2. Login with your Rybbit account
3. Select your site (ID: `a56da861ea4f`)
4. View real-time analytics, events, and user data

### Key Metrics to Monitor

**User Acquisition:**
- New user registrations
- Login attempts (success/failure)
- User retention

**Engagement:**
- Application starts vs completions
- Newsletter subscription rate
- Blog post views
- Time on site

**Conversion:**
- Application submission rate
- Lead conversion rate
- Goal completions

**Errors:**
- Login errors
- Registration errors
- Application save errors

## Adding New Events

To track a new custom event:

1. **Direct API call:**
   ```typescript
   if (typeof window !== 'undefined' && window.rybbit) {
     window.rybbit.event('custom_event_name', { 
       property1: 'value1',
       property2: 123 
     })
   }
   ```

2. **Using the helper utility** (recommended):
   
   Add to `lib/analytics/index.ts`:
   ```typescript
   export const trackEvent = {
     // ... existing events
     
     customEventName: (properties?: { 
       property1?: string 
       property2?: number 
     }) => {
       analytics.event('custom_event_name', properties)
     },
   }
   ```
   
   Then use it:
   ```typescript
   import { trackEvent } from '@/lib/analytics'
   
   trackEvent.customEventName({ 
     property1: 'value', 
     property2: 123 
   })
   ```

## Data Attributes Tracking

You can also track events without JavaScript using data attributes:

```html
<!-- Basic event tracking -->
<button data-rybbit-event="signup_clicked">Sign Up</button>

<!-- Event with properties -->
<button 
  data-rybbit-event="cta_clicked" 
  data-rybbit-prop-location="homepage" 
  data-rybbit-prop-text="Get Started"
>
  Get Started
</button>
```

## Best Practices

1. **Event Naming**: Use descriptive, lowercase names with underscores (e.g., `user_logged_in`, `application_submitted`)

2. **Event Properties**: Keep properties minimal and relevant. Only strings and numbers are supported.

3. **Error Handling**: Always wrap Rybbit calls in window checks:
   ```typescript
   if (typeof window !== 'undefined' && window.rybbit) {
     window.rybbit.event('event_name')
   }
   ```

4. **User Privacy**: Never track PII (personally identifiable information) like emails, phone numbers, or addresses in event properties.

5. **Performance**: Events are tracked asynchronously and don't block user interactions.

## Troubleshooting

### Script Not Loading

Check that environment variables are set:
```bash
echo $NEXT_PUBLIC_RYBBIT_SITE_ID
echo $NEXT_PUBLIC_RYBBIT_HOST
```

### Events Not Appearing

1. Check browser console for errors
2. Verify the script is loaded: `console.log(window.rybbit)`
3. Check ad blockers aren't blocking the script
4. Verify events in Rybbit dashboard (may take a few seconds)

### Development Testing

To test locally:
1. Start dev server: `npm run dev`
2. Open browser console
3. Test event manually: `window.rybbit.event('test_event', { test: true })`
4. Check Rybbit dashboard for the event

## Additional Resources

- **Rybbit Documentation**: https://rybbit.io/docs
- **Rybbit Dashboard**: https://app.rybbit.io
- **Next.js Integration Guide**: https://rybbit.io/docs/guides/react/next-js
- **API Reference**: https://rybbit.io/docs/api

## Pricing

Rybbit offers a generous free tier:
- **Free**: 10,000 events/month
- **Standard**: $19/month for up to 100,000 events
- **Pro**: $39/month for unlimited events and advanced features

Current plan: Check your Rybbit dashboard for details.
