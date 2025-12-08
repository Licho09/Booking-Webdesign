# Deploy Email Function via Supabase Dashboard (Easiest Method)

Since Supabase CLI installation is having issues, use the Dashboard method instead - it's actually easier!

## Step 1: Go to Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project (the one with ref: `agtrmlktcxwkksclhknn`)

## Step 2: Navigate to Edge Functions

1. In the left sidebar, click **Edge Functions**
2. You should see a list of functions

## Step 3: Find or Create the `send-email` Function

**If the function already exists:**
- Click on `send-email` function
- Click **Edit** or the pencil icon

**If the function doesn't exist:**
- Click **Create a new function**
- Name it: `send-email`
- Click **Create**

## Step 4: Copy the Updated Code

1. Open the file: `project/supabase/functions/send-email/index.ts` in your code editor
2. **Select ALL** the code (Ctrl+A)
3. **Copy** it (Ctrl+C)

## Step 5: Paste and Deploy

1. In the Supabase Dashboard editor, **delete all existing code**
2. **Paste** the code you just copied (Ctrl+V)
3. Click **Deploy** button (usually at the top right)

## Step 6: Verify Deployment

After deploying, you should see:
- ✅ Function deployed successfully
- The function status should show as "Active"

## Step 7: Test It!

1. Go back to your website (http://localhost:5173)
2. Fill out the booking form
3. Submit it
4. Check your email - it should now come from `DesignCXLabs <info@designcxlabs.com>`

---

## What Changed?

The updated code now includes:
- ✅ Proper "From" format: `DesignCXLabs <info@designcxlabs.com>`
- ✅ Better email headers for deliverability
- ✅ Email tags for tracking

This should help prevent emails from going to spam!





