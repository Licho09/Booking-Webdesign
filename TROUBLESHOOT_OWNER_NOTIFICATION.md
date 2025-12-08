# Troubleshooting Owner Notification Not Working

## The CORS Error Means:

The function `send-owner-email` is either:
1. **Not deployed yet** - Most likely!
2. **Not responding to OPTIONS requests correctly**

## Quick Fix Steps:

### Step 1: Verify Function is Deployed

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Look for `send-owner-email` in the list
3. Check it shows as **"Active"**

**If it's NOT there:**
- You need to deploy it (see Step 2)

**If it IS there:**
- Check the logs (see Step 3)

### Step 2: Deploy the Function

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **Create a new function** (or edit if it exists)
3. Name: `send-owner-email` (exact name, no spaces)
4. Copy code from: `project/supabase/functions/send-owner-email/index.ts`
5. Paste and **Deploy**

### Step 3: Check Function Logs

1. Go to **Edge Functions** → `send-owner-email`
2. Click **Logs** tab
3. Look for errors when you submit the form

### Step 4: Verify Secrets Are Set

1. Go to **Edge Functions** → **Secrets**
2. Make sure these exist:
   - ✅ `RESEND_API_KEY` = your Resend API key
   - ✅ `OWNER_EMAIL` = `luischirinos1000@gmail.com`
   - ✅ `FROM_EMAIL` = `info@designcxlabs.com`

### Step 5: Test Again

1. Submit the booking form
2. Check browser console for errors
3. Check Supabase function logs
4. Check your email (`luischirinos1000@gmail.com`)

## Common Issues:

### "Function not found" error
- **Fix**: Make sure function name is exactly `send-owner-email`
- **Fix**: Deploy the function

### CORS error
- **Fix**: Make sure function is deployed and active
- **Fix**: The code has been updated to fix CORS - redeploy it

### "RESEND_API_KEY is missing"
- **Fix**: Add `RESEND_API_KEY` secret in Supabase

### "OWNER_EMAIL is missing"
- **Fix**: Add `OWNER_EMAIL` = `luischirinos1000@gmail.com` secret

## After Fixing:

1. **Redeploy the function** with the updated code (CORS fix)
2. **Set the secrets** if not already set
3. **Test the form** again
4. **Check logs** if it still doesn't work

The most common issue is the function not being deployed yet!





