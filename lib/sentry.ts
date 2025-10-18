/**
 * Sentry Error Tracking Integration
 *
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Add NEXT_PUBLIC_SENTRY_DSN to .env
 * 4. Uncomment the code below
 */

// import * as Sentry from '@sentry/nextjs'

// Initialize Sentry
export function initSentry() {
  // Uncomment when ready to use Sentry
  /*
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,

      // Adjust sample rate for production
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Session Replay for debugging
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      // Filter out sensitive data
      beforeSend(event, hint) {
        // Remove sensitive information from errors
        if (event.request) {
          delete event.request.cookies
          if (event.request.headers) {
            delete event.request.headers.authorization
            delete event.request.headers.cookie
          }
        }
        return event
      },

      // Ignore certain errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Random network errors
        'NetworkError',
        'Network request failed',
        // Cancelled requests
        'AbortError',
        'Request aborted',
      ],
    })
  }
  */
}

// Helper to capture exceptions
export function captureException(error: Error, context?: Record<string, any>) {
  console.error('Error:', error, context)

  // Uncomment when Sentry is installed
  /*
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    })
  }
  */
}

// Helper to capture messages
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[${level.toUpperCase()}]`, message)

  // Uncomment when Sentry is installed
  /*
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, level)
  }
  */
}

// Helper to set user context
export function setUserContext(user: { id: string; email?: string; role?: string }) {
  // Uncomment when Sentry is installed
  /*
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    })
  }
  */
}

// Helper to add breadcrumb
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  // Uncomment when Sentry is installed
  /*
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    })
  }
  */
}
