# Troubleshooting 404 Error

You got a **404 Not Found** error. This means the function isn't accessible at that URL.

## Possible Causes

### 1. Function Not Deployed Yet ⚠️ (Most Likely)

Have you deployed the `check-and-send-reminders` function to Supabase yet?

**Check:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Edge Functions**
4. Do you see `check-and-send-reminders` in the list?

**If NO** - You need to deploy it first! See `DEPLOY_VIA_DASHBOARD.md`

**If YES** - Continue to next step

### 2. Wrong HTTP Method

cron-job.org might be sending a GET request, but Supabase functions need POST with authentication.

**Solution:** Use EasyCron instead (supports POST and headers)

### 3. Function Name Mismatch

Make sure the function name in Supabase exactly matches: `check-and-send-reminders`

## Quick Fix Steps

### Step 1: Verify Function is Deployed

1. Go to Supabase Dashboard → Edge Functions
2. Look for `check-and-send-reminders`
3. If it's not there, you need to deploy it first

### Step 2: Test Function Directly

Try calling it manually with proper headers:

**Using curl (if you have it):**
```bash
curl -X POST https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Or use Postman/Browser Extension:**
- Method: POST
- URL: `https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders`
- Headers:
  - `Authorization: Bearer YOUR_SERVICE_ROLE_KEY`
  - `apikey: YOUR_SERVICE_ROLE_KEY`
  - `Content-Type: application/json`

### Step 3: Use EasyCron (Recommended)

Since cron-job.org free tier might not support POST properly, switch to EasyCron:

1. Go to https://www.easycron.com
2. Create account (free)
3. Create cron job with:
   - Method: **POST**
   - Headers: Add all 3 headers
   - URL: Same as before

## Most Likely Issue

**You probably haven't deployed the function yet!**

Go to Supabase Dashboard → Edge Functions and check if `check-and-send-reminders` exists. If not, you need to deploy it first using the Dashboard method.











