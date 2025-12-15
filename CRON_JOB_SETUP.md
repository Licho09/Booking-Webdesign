# How to Set Up the Cron Job for Automatic Reminders

After deploying your functions, you need to set up a cron job to automatically call `check-and-send-reminders` every 15 minutes.

## Step 1: Get Your Function URL

Your function URL will be:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-and-send-reminders
```

**How to find YOUR_PROJECT_REF:**
1. Go to your Supabase Dashboard
2. Go to **Settings** → **API**
3. Look at the **Project URL** - it will be like: `https://agtrmlktcxwkksclhknn.supabase.co`
4. The part before `.supabase.co` is your project ref (e.g., `agtrmlktcxwkksclhknn`)

So your full URL would be:
```
https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders
```

## Step 2: Get Your Service Role Key

1. In Supabase Dashboard, go to **Settings** → **API**
2. Find the **service_role** key (⚠️ Keep this secret! Never expose it publicly)
3. Copy it - you'll need it for the cron job headers

## Step 3: Set Up Cron Job on cron-job.org

1. Go to https://cron-job.org and create a free account (or sign in)

2. Click **"Create cronjob"** or **"Add cronjob"**

3. Fill in the form:

   **Title**: `Supabase Reminder Checker` (or any name you like)

   **Address (URL)**: 
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-and-send-reminders
   ```
   (Replace `YOUR_PROJECT_REF` with your actual project ref)

   **Schedule**: 
   - Select **"Every X minutes"**
   - Enter `15` (runs every 15 minutes)

   **Request method**: Select **POST**

   **Request headers**: Click **"Add header"** and add these 3 headers:

   Header 1:
   - **Name**: `Authorization`
   - **Value**: `Bearer YOUR_SERVICE_ROLE_KEY`
   (Replace `YOUR_SERVICE_ROLE_KEY` with your actual service role key)

   Header 2:
   - **Name**: `apikey`
   - **Value**: `YOUR_SERVICE_ROLE_KEY`
   (Same service role key as above)

   Header 3:
   - **Name**: `Content-Type`
   - **Value**: `application/json`

   **Request body**: Leave empty or use `{}`

4. Click **"Create cronjob"** or **"Save"**

## Step 4: Test the Cron Job

1. After creating the cron job, click **"Run now"** or **"Execute"** to test it
2. Check the logs to see if it ran successfully
3. You can also check your Supabase function logs:
   - Go to Supabase Dashboard → **Edge Functions** → **check-and-send-reminders** → **Logs**

## Example Configuration

Here's what your cron job should look like:

```
Title: Supabase Reminder Checker
URL: https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders
Schedule: Every 15 minutes
Method: POST
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
Body: {}
```

## Alternative: Other Cron Services

If you prefer other services:

### EasyCron
- https://www.easycron.com
- Similar setup process

### GitHub Actions (if your code is on GitHub)
- Can set up a workflow that runs on a schedule
- More advanced but free for public repos

### Supabase Database Functions (Advanced)
- Can use `pg_cron` extension if available
- Requires database-level setup

## Troubleshooting

**Cron job not running:**
- Check that the URL is correct
- Verify the service role key is correct
- Check cron-job.org logs for errors

**Function not being called:**
- Test the function manually using curl or Postman
- Check Supabase function logs for errors
- Verify CORS headers are set correctly

**Reminders not being sent:**
- Check that `check-and-send-reminders` is running successfully
- Verify that bookings exist in your database
- Check the timing - reminders only send at specific times (23-25 hours before, or 5-15 minutes before)

## Important Notes

- ⚠️ **Never share your service role key publicly** - it has full database access
- The cron job runs every 15 minutes, but reminders only send when bookings are at the right time
- You can adjust the schedule (e.g., every 10 minutes for more frequent checks, or every 30 minutes to save resources)
- Free tier of cron-job.org allows limited executions per month, but should be enough for this use case



