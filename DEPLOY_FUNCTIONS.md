# How to Deploy Supabase Edge Functions

This guide will walk you through deploying the reminder email functions to Supabase.

## Prerequisites

1. **Supabase Account**: You need a Supabase account (free tier works)
2. **Supabase CLI**: Install the Supabase CLI tool
3. **Your Supabase Project**: Have your project URL and access token ready

## Step 1: Install Supabase CLI

⚠️ **Important**: Supabase CLI cannot be installed via `npm install -g`. You must use one of the methods below.

### Option A: Using Scoop (Recommended for Windows)

First, install Scoop if you don't have it:
```powershell
# Run in PowerShell (as Administrator)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

Then install Supabase CLI:
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Option B: Using Chocolatey (Windows)

If you have Chocolatey installed:
```bash
choco install supabase
```

### Option C: Download Standalone Binary

1. Go to https://github.com/supabase/cli/releases
2. Download the Windows binary (`supabase_windows_amd64.exe`)
3. Rename it to `supabase.exe`
4. Add it to your PATH or place it in a folder that's already in your PATH

### Verify Installation
```bash
supabase --version
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate. After logging in, you'll be authenticated in the CLI.

## Step 3: Link Your Project

Navigate to your project directory:
```bash
cd "C:\Users\jlr\Downloads\My Website\project"
```

Link your Supabase project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**How to find your Project Ref:**
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **General**
4. Copy the **Reference ID** (it looks like: `agtrmlktcxwkksclhknn`)

**Alternative**: If you don't know your project ref, you can also link by project ID:
```bash
supabase link --project-id YOUR_PROJECT_ID
```

## Step 4: Set Environment Variables (Secrets)

Before deploying, you need to set the environment variables (secrets) for your functions.

### Option A: Using Supabase Dashboard (Easier)

1. Go to your Supabase dashboard
2. Navigate to **Edge Functions** → **Settings** → **Secrets**
3. Add the following secrets (if not already set):
   - `RESEND_API_KEY` - Your Resend API key
   - `FROM_EMAIL` - Sender email (e.g., `info@designcxlabs.com`)
   - `REPLY_TO_EMAIL` - Reply-to email
   - `OWNER_EMAIL` - Owner notification email (e.g., `luischirinos1000@gmail.com`)
   - `SITE_URL` - Your website URL (e.g., `https://www.designcxlabs.com`)
   - `MEETING_LINK` - (Optional) Your meeting link (Zoom, Google Meet, etc.)
   - `SUPABASE_URL` - Your Supabase project URL (e.g., `https://agtrmlktcxwkksclhknn.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

**How to find Service Role Key:**
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **service_role** key (⚠️ Keep this secret! Never expose it in client-side code)

### Option B: Using CLI

```bash
# Set secrets one by one
supabase secrets set RESEND_API_KEY=your_resend_key_here
supabase secrets set FROM_EMAIL=info@designcxlabs.com
supabase secrets set REPLY_TO_EMAIL=info@designcxlabs.com
supabase secrets set OWNER_EMAIL=luischirinos1000@gmail.com
supabase secrets set SITE_URL=https://www.designcxlabs.com
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: Set meeting link
supabase secrets set MEETING_LINK=https://zoom.us/j/your-meeting-id
```

## Step 5: Deploy the Functions

Deploy each function one by one:

```bash
# Deploy 1-day reminder function
supabase functions deploy send-reminder-1day

# Deploy starting soon reminder function
supabase functions deploy send-reminder-starting-soon

# Deploy scheduler function
supabase functions deploy check-and-send-reminders
```

**Note**: You may also need to redeploy the updated `send-email` function:
```bash
supabase functions deploy send-email
```

## Step 6: Verify Deployment

After deployment, you should see output like:
```
Deploying function send-reminder-1day...
Function send-reminder-1day deployed successfully
```

You can verify in your Supabase dashboard:
1. Go to **Edge Functions** in your dashboard
2. You should see all your deployed functions listed

## Step 7: Test the Functions

You can test the functions using the Supabase dashboard or curl:

### Test 1-Day Reminder
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

## Troubleshooting

### "Command not found: supabase"
- Make sure you installed the CLI globally: `npm install -g supabase`
- Try restarting your terminal/command prompt
- Verify installation: `supabase --version`

### "Project not linked"
- Run `supabase link --project-ref YOUR_PROJECT_REF` again
- Make sure you're in the correct directory (the `project` folder)

### "Authentication failed"
- Run `supabase login` again
- Make sure you're logged into the correct Supabase account

### "Function deployment failed"
- Check that all required secrets are set
- Verify your Supabase project is active
- Check the error message for specific issues

### "CORS errors"
- Make sure CORS headers are set in your functions (they should be already)
- Check that you're using the correct authorization headers

## Alternative: Deploy via Supabase Dashboard

If the CLI doesn't work for you, you can also deploy functions via the dashboard:

1. Go to **Edge Functions** in your Supabase dashboard
2. Click **Create a new function**
3. Copy and paste the function code from the files
4. Name it the same as the folder (e.g., `send-reminder-1day`)
5. Deploy

However, using the CLI is recommended as it's faster and easier for updates.

## Next Steps

After deploying, set up the cron job to automatically check for reminders. See `supabase/functions/REMINDERS_SETUP.md` for details.
