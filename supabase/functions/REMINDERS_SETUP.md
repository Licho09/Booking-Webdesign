# Email Reminder System Setup Guide

This system automatically sends reminder emails for bookings at the right times.

## Reminder Schedule

### Day 0 - Booking Confirmation
- **When**: Immediately upon booking
- **Email**: "Your call is booked"
- **Function**: `send-email` (already exists, updated with new format)

### 1 Day Before - Main Reminder
- **When**: 23-25 hours before the meeting
- **Email**: "Reminder — call tomorrow"
- **Function**: `send-reminder-1day`

### 5-15 Minutes Before - Starting Soon
- **When**: 5-15 minutes before the meeting
- **Email**: "Starting shortly"
- **Function**: `send-reminder-starting-soon`

## Setup Instructions

### 1. Deploy the Functions

Deploy all three new functions to Supabase:

```bash
# Deploy 1-day reminder function
supabase functions deploy send-reminder-1day

# Deploy starting soon reminder function
supabase functions deploy send-reminder-starting-soon

# Deploy scheduler function
supabase functions deploy check-and-send-reminders
```

### 2. Set Environment Variables

In your Supabase dashboard, go to **Edge Functions** → **Settings** → **Secrets** and ensure these are set:

- `RESEND_API_KEY` - Your Resend API key
- `FROM_EMAIL` - Sender email (e.g., `info@designcxlabs.com`)
- `REPLY_TO_EMAIL` - Reply-to email
- `OWNER_EMAIL` - Owner notification email
- `SITE_URL` - Your website URL (e.g., `https://www.designcxlabs.com`)
- `MEETING_LINK` - (Optional) Your meeting link (Zoom, Google Meet, etc.)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for `check-and-send-reminders`)

### 3. Set Up Cron Job

The `check-and-send-reminders` function needs to be called periodically to check for upcoming appointments.

**Option A: Using cron-job.org (Recommended)**

1. Go to [cron-job.org](https://cron-job.org) and create a free account
2. Create a new cron job:
   - **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/check-and-send-reminders`
   - **Schedule**: Every 15 minutes (`*/15 * * * *`)
   - **Method**: POST
   - **Headers**: 
     - `Authorization: Bearer YOUR_SERVICE_ROLE_KEY`
     - `apikey: YOUR_SERVICE_ROLE_KEY`
     - `Content-Type: application/json`

**Option B: Using Supabase Database Functions (Advanced)**

You can set up a PostgreSQL cron job using `pg_cron` extension if available in your Supabase plan.

### 4. Test the System

1. Create a test booking for tomorrow
2. Wait for the scheduler to run (or manually trigger `check-and-send-reminders`)
3. Verify that the 1-day reminder is sent
4. For starting soon reminders, create a booking 10 minutes in the future and wait

## Manual Testing

You can manually trigger reminders for testing:

```bash
# Test 1-day reminder
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-1day \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "your-booking-id",
    "email": "test@example.com",
    "name": "Test User",
    "date": "Monday, January 15, 2025",
    "time": "10:00 AM"
  }'

# Test starting soon reminder
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-starting-soon \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "your-booking-id",
    "email": "test@example.com",
    "name": "Test User",
    "date": "Monday, January 15, 2025",
    "time": "10:00 AM"
  }'
```

## Notes

- The scheduler checks bookings up to 7 days in the future
- Reminders are sent based on time calculations, so timezone matters
- The system doesn't currently track if reminders were already sent (to prevent duplicates). You may want to add a `reminder_sent_1day` and `reminder_sent_starting_soon` boolean field to the `leads` table in the future.
- The `MEETING_LINK` environment variable is optional. If not set, meeting links won't appear in emails.

## Troubleshooting

- **No reminders being sent**: Check that the cron job is running and the function URL is correct
- **Wrong timing**: Verify timezone settings and time format in the database
- **CORS errors**: Ensure CORS headers are set correctly in all functions
- **Missing emails**: Check Resend API key and email configuration





