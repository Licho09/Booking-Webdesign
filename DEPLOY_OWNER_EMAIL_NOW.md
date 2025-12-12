# Deploy Owner Email Function - Step by Step

## The Problem:
The CORS error means `send-owner-email` function is **NOT deployed** or needs to be redeployed.

## Solution - Deploy It Now:

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select your project

### Step 2: Check if Function Exists
1. Click **Edge Functions** (left sidebar)
2. Look for `send-owner-email` in the list

**If you see it:**
- Click on it
- Click **Edit** or the pencil icon
- Go to Step 3

**If you DON'T see it:**
- Click **Create a new function**
- Name it: `send-owner-email` (exact name, no spaces)
- Go to Step 3

### Step 3: Copy the Code
1. Open this file in your code editor:
   `project/supabase/functions/send-owner-email/index.ts`
2. **Select ALL** the code (Ctrl+A)
3. **Copy** it (Ctrl+C)

### Step 4: Paste and Deploy
1. In Supabase Dashboard editor, **delete all existing code**
2. **Paste** your code (Ctrl+V)
3. Click **Deploy** button (top right)

### Step 5: Set the Secret
1. Go to **Edge Functions** → **Secrets**
2. Click **Add new secret**
3. Add:
   - **Name**: `OWNER_EMAIL`
   - **Value**: `luischirinos1000@gmail.com`
4. Click **Save**

### Step 6: Verify Secrets Are Set
Make sure these secrets exist:
- ✅ `RESEND_API_KEY` = your Resend API key
- ✅ `OWNER_EMAIL` = `luischirinos1000@gmail.com`
- ✅ `FROM_EMAIL` = `info@designcxlabs.com`

### Step 7: Test Again
1. Go back to your website: http://localhost:5173
2. Fill out and submit the booking form
3. Check `luischirinos1000@gmail.com` for notification

## If Still Not Working:

### Check Function Logs:
1. Go to **Edge Functions** → `send-owner-email`
2. Click **Logs** tab
3. Submit the form again
4. Check logs for errors

### Common Issues:
- **Function name wrong**: Must be exactly `send-owner-email`
- **Secrets not set**: Check all 3 secrets are there
- **Function not active**: Make sure it shows "Active" status

## Quick Checklist:
- [ ] Function `send-owner-email` exists in Supabase
- [ ] Function shows as "Active"
- [ ] Code is deployed (with CORS fix)
- [ ] `OWNER_EMAIL` secret is set
- [ ] `RESEND_API_KEY` secret is set
- [ ] `FROM_EMAIL` secret is set
- [ ] Tested the form again

The most important step is **deploying the function** - that's why you're getting the CORS error!








