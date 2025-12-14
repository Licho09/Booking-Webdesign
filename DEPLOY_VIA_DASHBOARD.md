# Deploy Functions via Supabase Dashboard (No CLI Needed)

This is the easiest method - no command line tools required!

## Step 1: Go to Your Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your project (the one with your booking website)

## Step 2: Set Environment Variables (Secrets)

Before deploying functions, set up your secrets:

1. In your Supabase Dashboard, go to **Edge Functions** → **Settings** → **Secrets**
2. Add the following secrets (click "Add new secret" for each):

   - **Name**: `RESEND_API_KEY`
     **Value**: Your Resend API key

   - **Name**: `FROM_EMAIL`
     **Value**: `info@designcxlabs.com` (or your sender email)

   - **Name**: `REPLY_TO_EMAIL`
     **Value**: `info@designcxlabs.com` (or your reply-to email)

   - **Name**: `OWNER_EMAIL`
     **Value**: `luischirinos1000@gmail.com` (or your email)

   - **Name**: `SITE_URL`
     **Value**: `https://www.designcxlabs.com`

   - **Name**: `SUPABASE_URL`
     **Value**: Your Supabase project URL (e.g., `https://agtrmlktcxwkksclhknn.supabase.co`)
     - Find this in **Settings** → **API** → **Project URL**

   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
     **Value**: Your service role key
     - Find this in **Settings** → **API** → **service_role** key (⚠️ Keep this secret!)

   - **Name**: `MEETING_LINK` (Optional)
     **Value**: Your meeting link (Zoom, Google Meet, etc.) or leave empty

3. Click **Save** after adding each secret

## Step 3: Deploy Functions

### Function 1: Update `send-email` (Confirmation Email)

1. Go to **Edge Functions** in your dashboard
2. Find `send-email` in the list (if it exists) or click **Create a new function**
3. If updating existing:
   - Click on `send-email`
   - Click **Edit**
   - Replace all code with the contents from `project/supabase/functions/send-email/index.ts`
4. If creating new:
   - Name: `send-email`
   - Copy the entire contents from `project/supabase/functions/send-email/index.ts`
   - Paste into the editor
5. Click **Deploy** (or **Save** then **Deploy**)

### Function 2: Deploy `send-reminder-1day`

1. Click **Create a new function**
2. **Function name**: `send-reminder-1day`
3. Copy the entire contents from `project/supabase/functions/send-reminder-1day/index.ts`
4. Paste into the code editor
5. Click **Deploy**

### Function 3: Deploy `send-reminder-starting-soon`

1. Click **Create a new function**
2. **Function name**: `send-reminder-starting-soon`
3. Copy the entire contents from `project/supabase/functions/send-reminder-starting-soon/index.ts`
4. Paste into the code editor
5. Click **Deploy**

### Function 4: Deploy `check-and-send-reminders`

1. Click **Create a new function**
2. **Function name**: `check-and-send-reminders`
3. Copy the entire contents from `project/supabase/functions/check-and-send-reminders/index.ts`
4. Paste into the code editor
5. Click **Deploy**

## Step 4: Verify Functions Are Deployed

1. Go to **Edge Functions** in your dashboard
2. You should see all 4 functions listed:
   - `send-email`
   - `send-reminder-1day`
   - `send-reminder-starting-soon`
   - `check-and-send-reminders`

## Step 5: Test a Function (Optional)

You can test a function by clicking on it and using the "Invoke" button, or use curl:

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-1day \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "test-id",
    "email": "your-email@example.com",
    "name": "Test User",
    "date": "Monday, January 15, 2025",
    "time": "10:00 AM"
  }'
```

## Step 6: Set Up Cron Job (For Automatic Reminders)

The `check-and-send-reminders` function needs to run automatically. Set up a cron job:

1. Go to https://cron-job.org (free account)
2. Create a new cron job:
   - **Title**: Supabase Reminder Checker
   - **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/check-and-send-reminders`
   - **Schedule**: Every 15 minutes (`*/15 * * * *`)
   - **Request method**: POST
   - **Request headers**:
     - `Authorization`: `Bearer YOUR_SERVICE_ROLE_KEY`
     - `apikey`: `YOUR_SERVICE_ROLE_KEY`
     - `Content-Type`: `application/json`
   - **Request body**: Leave empty `{}`
3. Save the cron job

## Troubleshooting

- **Function not deploying**: Check that all code was copied correctly
- **Secrets not working**: Make sure secrets are saved and function is redeployed after adding secrets
- **CORS errors**: Functions should already have CORS headers, but verify they're in the code
- **Function errors**: Check the **Logs** tab in the function editor to see error messages

## Next Steps

After deploying:
1. Test the confirmation email by making a booking
2. Wait for the cron job to run and check if reminders are sent
3. Monitor the function logs to ensure everything works

That's it! Your reminder system should now be working. 🎉
