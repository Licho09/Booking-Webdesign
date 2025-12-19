# Alternative Cron Job Services (Free & Work with Supabase)

Since EasyCron free tier blocks Supabase domains, here are free alternatives:

## Option 1: UptimeRobot (Recommended - Free & Easy)

**Why it works:**
- Free tier allows any domain
- Supports POST requests with headers
- Very reliable

**Setup:**
1. Go to https://uptimerobot.com
2. Sign up (free)
3. Click "Add New Monitor"
4. Select "HTTP(s)" monitor type
5. Configure:
   - **Friendly Name**: `Check and send Reminders`
   - **URL**: `https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders`
   - **Monitoring Interval**: 15 minutes
   - **HTTP Method**: POST
   - **HTTP Headers**: 
     ```
     Authorization: Bearer YOUR_SERVICE_ROLE_KEY
     apikey: YOUR_SERVICE_ROLE_KEY
     Content-Type: application/json
     ```
   - **HTTP Body**: `{}`
6. Save

**Note**: UptimeRobot is primarily for uptime monitoring, but it can call your function regularly.

## Option 2: GitHub Actions (If Your Code is on GitHub)

If your code is in a GitHub repository:

1. Create `.github/workflows/reminder-checker.yml`:
```yaml
name: Check and Send Reminders

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:  # Allow manual trigger

jobs:
  check-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Call Reminder Function
        run: |
          curl -X POST https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "apikey: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{}'
```

2. Add secret in GitHub:
   - Go to your repo → Settings → Secrets → Actions
   - Add `SUPABASE_SERVICE_ROLE_KEY` with your key

**Pros**: Free, reliable, runs on GitHub's infrastructure
**Cons**: Requires GitHub repo

## Option 3: Use Supabase Database Functions (Advanced)

Use PostgreSQL's `pg_cron` extension (if available in your plan):

1. Go to Supabase Dashboard → SQL Editor
2. Run:
```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the function to run every 15 minutes
SELECT cron.schedule(
  'check-reminders',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY',
      'apikey', 'YOUR_SERVICE_ROLE_KEY',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

**Note**: This requires the `pg_cron` extension, which may not be available on free tier.

## Option 4: Simple Webhook Service

Use a service like:
- **webhook.site** (for testing)
- **Zapier** (free tier has limitations)
- **Make.com** (formerly Integromat) - free tier available

## Recommendation

**Use UptimeRobot** - it's the easiest free option that definitely works with Supabase domains.




