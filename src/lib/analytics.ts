/**
 * Analytics utility for tracking user behavior on the booking website
 * 
 * Supports:
 * - Google Analytics 4 (GA4) events
 * - Custom event tracking
 * - Page view tracking
 * - Form interaction tracking
 */

// Google Analytics 4 Measurement ID
// Replace with your actual GA4 Measurement ID from Google Analytics
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

// Check if GA4 is enabled
const isGA4Enabled = () => {
  return typeof window !== 'undefined' && 
         typeof window.gtag !== 'undefined' && 
         GA4_MEASUREMENT_ID !== '';
};

/**
 * Initialize Google Analytics 4
 * Call this once when the app loads
 */
export const initAnalytics = () => {
  if (typeof window === 'undefined' || GA4_MEASUREMENT_ID === '') {
    console.warn('GA4 Measurement ID not configured. Analytics disabled.');
    return;
  }

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });

  console.log('Analytics initialized');
};

/**
 * Track a page view
 */
export const trackPageView = (path: string, title?: string) => {
  if (isGA4Enabled()) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
  
  // Also log to console in development
  if (import.meta.env.DEV) {
    console.log('📊 Page View:', path);
  }
};

/**
 * Track a custom event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: {
    [key: string]: string | number | boolean | undefined;
  }
) => {
  if (isGA4Enabled()) {
    window.gtag('event', eventName, eventParams);
  }
  
  // Also log to console in development
  if (import.meta.env.DEV) {
    console.log('📊 Event:', eventName, eventParams);
  }
};

/**
 * Track form view (when user sees the booking form)
 */
export const trackFormView = () => {
  trackEvent('form_view', {
    form_name: 'booking_form',
    form_location: 'homepage',
  });
};

/**
 * Track form start (when user starts filling out the form)
 */
export const trackFormStart = () => {
  trackEvent('form_start', {
    form_name: 'booking_form',
  });
};

/**
 * Track form field interaction
 */
export const trackFormFieldInteraction = (fieldName: string) => {
  trackEvent('form_field_interaction', {
    form_name: 'booking_form',
    field_name: fieldName,
  });
};

/**
 * Track form submission attempt
 */
export const trackFormSubmitAttempt = () => {
  trackEvent('form_submit_attempt', {
    form_name: 'booking_form',
  });
};

/**
 * Track successful form submission
 */
export const trackFormSubmitSuccess = (data?: {
  hasDate?: boolean;
  hasTime?: boolean;
  hasBusinessName?: boolean;
}) => {
  trackEvent('form_submit_success', {
    form_name: 'booking_form',
    has_date: data?.hasDate || false,
    has_time: data?.hasTime || false,
    has_business_name: data?.hasBusinessName || false,
  });
};

/**
 * Track form submission error
 */
export const trackFormSubmitError = (errorType: string) => {
  trackEvent('form_submit_error', {
    form_name: 'booking_form',
    error_type: errorType,
  });
};

/**
 * Track date selection
 */
export const trackDateSelection = (date: string) => {
  trackEvent('date_selection', {
    form_name: 'booking_form',
    selected_date: date,
  });
};

/**
 * Track time slot selection
 */
export const trackTimeSelection = (time: string) => {
  trackEvent('time_selection', {
    form_name: 'booking_form',
    selected_time: time,
  });
};

/**
 * Track scroll depth (when user scrolls past certain points)
 */
export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', {
    depth_percentage: depth,
  });
};

/**
 * Track CTA click (Call-to-Action button clicks)
 */
export const trackCTAClick = (ctaName: string, location?: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: location || 'unknown',
  });
};

/**
 * Track section view (when a section comes into view)
 */
export const trackSectionView = (sectionName: string) => {
  trackEvent('section_view', {
    section_name: sectionName,
  });
};

/**
 * Track external link click
 */
export const trackExternalLink = (url: string, linkText?: string) => {
  trackEvent('external_link_click', {
    link_url: url,
    link_text: linkText || '',
  });
};

// TypeScript declarations for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}


