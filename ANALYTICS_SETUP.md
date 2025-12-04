# Analytics Setup Guide

This guide will help you set up analytics tracking for your booking website to understand how users interact with your site.

## 📊 What's Being Tracked

The analytics system tracks the following user interactions:

### Form Interactions
- **Form View**: When users see the booking form
- **Form Start**: When users begin filling out the form
- **Field Interactions**: Each time a user interacts with a form field
- **Date Selection**: When users select a date
- **Time Selection**: When users select a time slot
- **Form Submit Attempt**: When users try to submit the form
- **Form Submit Success**: Successful form submissions
- **Form Submit Error**: Failed submissions with error types

### Page Tracking
- **Page Views**: Automatic tracking of all page views
- **Conversion Events**: When users complete a booking (reach thank you page)

### Additional Events (Available)
- Scroll depth tracking
- CTA button clicks
- Section views
- External link clicks

## 🚀 Setup Instructions

### Step 1: Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **Admin** (gear icon) in the bottom left
4. In the **Property** column, click **Create Property**
5. Fill in your property details:
   - Property name: "Your Booking Website"
   - Reporting time zone: Your timezone
   - Currency: Your currency
6. Click **Next** and fill in business information
7. Click **Create**

### Step 2: Get Your Measurement ID

1. In your new GA4 property, go to **Admin** → **Data Streams**
2. Click **Add stream** → **Web**
3. Enter your website URL and stream name
4. Click **Create stream**
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Add Measurement ID to Your Project

Create a `.env` file in the `project` directory (if it doesn't exist) and add:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID from Step 2.

**Important**: 
- The `.env` file should be in the `project` directory (same level as `package.json`)
- Never commit your `.env` file to version control (it should be in `.gitignore`)
- Restart your development server after adding the environment variable

### Step 4: Verify Analytics is Working

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your website in a browser
3. Open the browser's Developer Console (F12)
4. You should see analytics logs like:
   ```
   📊 Page View: /
   📊 Event: form_view
   ```

5. In Google Analytics:
   - Go to **Reports** → **Realtime**
   - You should see your visit appear within a few seconds

## 📈 Viewing Your Analytics Data

### In Google Analytics Dashboard

1. **Realtime Reports**: See live user activity
   - Go to **Reports** → **Realtime**
   - See active users, page views, and events in real-time

2. **Events Report**: See all tracked events
   - Go to **Reports** → **Engagement** → **Events**
   - View events like `form_view`, `form_start`, `form_submit_success`, etc.

3. **Custom Reports**: Create custom reports for booking-specific metrics
   - Go to **Explore** → **Blank**
   - Add dimensions: Event name, Page path
   - Add metrics: Event count, Users

### Key Metrics to Monitor

- **Form View Rate**: How many visitors see the form
- **Form Start Rate**: How many visitors start filling the form
- **Form Completion Rate**: How many visitors complete the form
- **Drop-off Points**: Where users abandon the form
- **Popular Time Slots**: Which times are selected most
- **Popular Dates**: Which dates are selected most
- **Error Rate**: How often form submissions fail

## 🔧 Advanced Configuration

### Custom Event Tracking

You can add custom event tracking anywhere in your code:

```typescript
import { trackEvent, trackCTAClick, trackSectionView } from './lib/analytics';

// Track a custom event
trackEvent('custom_event_name', {
  custom_param: 'value',
  another_param: 123,
});

// Track CTA clicks
trackCTAClick('Get Started Button', 'hero_section');

// Track section views
trackSectionView('services_section');
```

### Scroll Depth Tracking

To track how far users scroll:

```typescript
import { trackScrollDepth } from './lib/analytics';

// Track when user scrolls 25%, 50%, 75%, 100%
useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (scrollPercent >= 25 && scrollPercent < 50) {
      trackScrollDepth(25);
    } else if (scrollPercent >= 50 && scrollPercent < 75) {
      trackScrollDepth(50);
    } else if (scrollPercent >= 75 && scrollPercent < 100) {
      trackScrollDepth(75);
    } else if (scrollPercent >= 100) {
      trackScrollDepth(100);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

## 🎯 Recommended Reports to Create

### 1. Booking Funnel Report
Track the user journey from form view → form start → form completion:
- Form views
- Form starts
- Form submissions
- Conversion rate at each step

### 2. Time Slot Analysis
See which time slots are most popular:
- Event: `time_selection`
- Dimension: `selected_time`
- Metric: Event count

### 3. Date Selection Analysis
See which dates are most popular:
- Event: `date_selection`
- Dimension: `selected_date`
- Metric: Event count

### 4. Form Error Analysis
Identify common form errors:
- Event: `form_submit_error`
- Dimension: `error_type`
- Metric: Event count

## 🔒 Privacy & GDPR Compliance

If you're serving users in the EU, you may need to:

1. **Add Cookie Consent**: Implement a cookie consent banner
2. **Anonymize IP**: Already handled by GA4 by default
3. **Privacy Policy**: Update your privacy policy to mention analytics tracking

To disable analytics for users who opt out:

```typescript
// In your analytics.ts file, you can add:
if (userHasOptedOut) {
  // Don't initialize analytics
  return;
}
```

## 🐛 Troubleshooting

### Analytics not working?

1. **Check Measurement ID**: Make sure it's correct in `.env`
2. **Check Console**: Look for errors in browser console
3. **Check Network Tab**: Verify requests to `google-analytics.com`
4. **Check GA4**: Make sure your GA4 property is active
5. **Ad Blockers**: Some ad blockers block analytics - test in incognito mode

### Events not showing in GA4?

- GA4 can take 24-48 hours to show data in standard reports
- Use **Realtime** reports to see immediate data
- Check that events are being sent (browser console logs)

### Development vs Production

- Analytics works in both development and production
- In development, you'll see console logs (helpful for debugging)
- In production, logs are disabled automatically

## 📚 Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Tracking Guide](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 Custom Dimensions](https://support.google.com/analytics/answer/10075209)

## 💡 Tips

1. **Set up Goals**: In GA4, create conversion events for `form_submit_success`
2. **Create Audiences**: Segment users who viewed form but didn't submit
3. **Set up Alerts**: Get notified when form submission rate drops
4. **Regular Reviews**: Check analytics weekly to spot trends
5. **A/B Testing**: Use analytics data to test form improvements

---

**Need Help?** Check the console logs in development mode - they'll show you exactly what events are being tracked!


