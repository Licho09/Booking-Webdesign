# How to Find Your Function URL

The function URL is what you'll use in the cron job to call your `check-and-send-reminders` function.

## Step 1: Find Your Supabase Project URL

1. Go to **https://supabase.com/dashboard**
2. Sign in and select your project
3. Go to **Settings** → **API**
4. Look for **Project URL** - it will look like:
   ```
   https://agtrmlktcxwkksclhknn.supabase.co
   ```
   (Your project will have a different ID)

## Step 2: Construct Your Function URL

Your function URL follows this pattern:
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/FUNCTION_NAME
```

### For the reminder scheduler function:
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/check-and-send-reminders
```

### Example:
If your Project URL is: `https://agtrmlktcxwkksclhknn.supabase.co`

Then your function URL is:
```
https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders
```

## Step 3: Where to Use This URL

**Use this URL in cron-job.org** when creating your cron job:

1. Go to https://cron-job.org
2. Create a new cron job
3. In the **"Address (URL)"** field, paste your function URL:
   ```
   https://YOUR_PROJECT_ID.supabase.co/functions/v1/check-and-send-reminders
   ```

## Quick Reference

| What You Need | Where to Find It | Example |
|---------------|------------------|---------|
| **Project URL** | Supabase Dashboard → Settings → API → Project URL | `https://agtrmlktcxwkksclhknn.supabase.co` |
| **Function URL** | Add `/functions/v1/check-and-send-reminders` to Project URL | `https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders` |
| **Where to Use** | cron-job.org → Create cron job → URL field | Paste the function URL here |

## Visual Guide

```
Supabase Dashboard
  ↓
Settings → API
  ↓
Project URL: https://agtrmlktcxwkksclhknn.supabase.co
  ↓
Add: /functions/v1/check-and-send-reminders
  ↓
Full Function URL: https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders
  ↓
Use in cron-job.org
```

## Other Function URLs

Once you deploy all functions, they'll all follow the same pattern:

- Confirmation email: `https://YOUR_PROJECT.supabase.co/functions/v1/send-email`
- 1-day reminder: `https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-1day`
- Starting soon: `https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-starting-soon`
- Scheduler: `https://YOUR_PROJECT.supabase.co/functions/v1/check-and-send-reminders`

But for the cron job, you only need the **check-and-send-reminders** URL!











