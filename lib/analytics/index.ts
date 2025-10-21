export const analytics = {
  pageview: () => {
    if (typeof window !== 'undefined' && window.rybbit) {
      window.rybbit.pageview()
    }
  },

  event: (name: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.rybbit) {
      window.rybbit.event(name, properties)
    }
  },

  identify: (userId: string) => {
    if (typeof window !== 'undefined' && window.rybbit) {
      window.rybbit.identify(userId)
    }
  },

  clearUserId: () => {
    if (typeof window !== 'undefined' && window.rybbit) {
      window.rybbit.clearUserId()
    }
  },

  getUserId: () => {
    if (typeof window !== 'undefined' && window.rybbit) {
      return window.rybbit.getUserId()
    }
    return null
  },
}

export const trackEvent = {
  userRegistered: (properties?: { serviceType?: string }) => {
    analytics.event('user_registered', properties)
  },

  userLoggedIn: (properties?: { method?: string }) => {
    analytics.event('user_logged_in', properties)
  },

  userLoggedOut: () => {
    analytics.event('user_logged_out')
  },

  applicationStarted: (properties?: { serviceType?: string }) => {
    analytics.event('application_started', properties)
  },

  applicationSubmitted: (properties?: { 
    fundingAmount?: number
    businessType?: string 
  }) => {
    analytics.event('application_submitted', properties)
  },

  applicationStatusChanged: (properties?: { 
    status?: string 
    previousStatus?: string 
  }) => {
    analytics.event('application_status_changed', properties)
  },

  onboardingStepCompleted: (properties?: { 
    step?: number 
    completionPercentage?: number 
  }) => {
    analytics.event('onboarding_step_completed', properties)
  },

  onboardingCompleted: (properties?: { 
    totalSteps?: number 
    completionTime?: number 
  }) => {
    analytics.event('onboarding_completed', properties)
  },

  leadCreated: (properties?: { source?: string }) => {
    analytics.event('lead_created', properties)
  },

  leadConverted: (properties?: { timeToConversion?: number }) => {
    analytics.event('lead_converted', properties)
  },

  blogPostViewed: (properties?: { 
    slug?: string 
    title?: string 
    category?: string 
  }) => {
    analytics.event('blog_post_viewed', properties)
  },

  blogPostShared: (properties?: { 
    slug?: string 
    platform?: string 
  }) => {
    analytics.event('blog_post_shared', properties)
  },

  newsletterSubscribed: (properties?: { source?: string }) => {
    analytics.event('newsletter_subscribed', properties)
  },

  newsletterUnsubscribed: () => {
    analytics.event('newsletter_unsubscribed')
  },

  contactFormSubmitted: (properties?: { subject?: string }) => {
    analytics.event('contact_form_submitted', properties)
  },

  documentUploaded: (properties?: { 
    documentType?: string 
    fileSize?: number 
  }) => {
    analytics.event('document_uploaded', properties)
  },

  ctaClicked: (properties: { 
    location: string 
    text: string 
  }) => {
    analytics.event('cta_clicked', properties)
  },

  errorOccurred: (properties: { 
    errorType: string 
    errorMessage: string 
    page?: string 
  }) => {
    analytics.event('error_occurred', properties)
  },
}
