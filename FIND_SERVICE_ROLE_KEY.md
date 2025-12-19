# How to Find Your Service Role Key

## Step-by-Step Instructions

### Step 1: Go to Supabase Dashboard
1. Open your browser
2. Go to: **https://supabase.com/dashboard**
3. Sign in if needed

### Step 2: Select Your Project
1. You should see a list of projects
2. Click on your project (the one with URL: `agtrmlktcxwkksclhknn.supabase.co`)

### Step 3: Go to Settings
1. Look at the left sidebar
2. Click on **"Settings"** (it has a gear icon ⚙️)
3. It's usually near the bottom of the sidebar

### Step 4: Go to API Section
1. In the Settings page, you'll see different sections
2. Click on **"API"** (it should be one of the first options)
3. You'll see API settings page

### Step 5: Find Service Role Key
On the API page, you'll see:

**Project API keys** section with two keys:

1. **anon** `public` key - This is NOT what you need (it's shorter)
2. **service_role** `secret` key - This IS what you need! ⚠️

The service_role key:
- Is labeled as **"service_role"** and **"secret"**
- Is much longer than the anon key
- Usually starts with `eyJ...`
- Has a warning icon or says "Keep this secret"
- Might have an "eye" icon to show/hide it

### Step 6: Copy the Key
1. Click the **"eye" icon** 👁️ to reveal the key (if it's hidden)
2. Click the **copy icon** 📋 next to the service_role key
3. Or select the entire key and copy it (Ctrl+C)

## Visual Guide

```
Supabase Dashboard
  ↓
[Your Project] ← Click here
  ↓
Left Sidebar:
  - Table Editor
  - SQL Editor
  - Edge Functions
  - ...
  - Settings ⚙️ ← Click here
  ↓
Settings Page:
  - General
  - API ← Click here
  - Database
  - ...
  ↓
API Page:
  Project API keys:
    [anon] public ← NOT THIS ONE
    [service_role] secret ← THIS ONE! Copy this
```

## What It Looks Like

The service_role key will look something like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndHJtbGt0Y3h3a2tzY2xoa25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODk2NzIwMCwiZXhwIjoyMDE0NTQzMjAwfQ.abc123def456...
```

It's a very long string of letters, numbers, and dots.

## Important Notes

⚠️ **Keep this key SECRET!**
- Never share it publicly
- Never commit it to GitHub
- Only use it in:
  - Supabase secrets (Edge Functions)
  - Cron job headers (private)
  - Server-side code only

## Alternative: Check Your Existing Secrets

If you've already set up secrets in Supabase:

1. Go to **Edge Functions** → **Settings** → **Secrets**
2. Look for `SUPABASE_SERVICE_ROLE_KEY`
3. The value there is your service role key!

## Still Can't Find It?

Try this:
1. Make sure you're logged into the correct Supabase account
2. Make sure you selected the correct project
3. The key might be hidden - look for an "eye" icon to reveal it
4. Check if you have the right permissions (you need to be the project owner or have admin access)




