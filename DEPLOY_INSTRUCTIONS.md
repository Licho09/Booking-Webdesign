# How to Deploy the Email Function

## Step 1: Open Terminal/Command Prompt

- Press `Windows Key + R`
- Type `cmd` and press Enter
- OR open PowerShell

## Step 2: Navigate to Project Folder

```bash
cd "C:\Users\jlr\Downloads\My Website\project"
```

## Step 3: Install Supabase CLI (if not installed)

```bash
npm install -g supabase
```

Wait for it to finish installing.

## Step 4: Login to Supabase

```bash
supabase login
```

This will open your browser to login. After logging in, come back to the terminal.

## Step 5: Link Your Project

```bash
supabase link --project-ref agtrmlktcxwkksclhknn
```

(Replace `agtrmlktcxwkksclhknn` with your actual project ref if different - you can find it in your Supabase dashboard URL)

## Step 6: Deploy the Function

```bash
supabase functions deploy send-email
```

This will upload the updated email function with the improved "From" format.

## Step 7: Verify Deployment

After deployment, you should see:
```
Deployed Function send-email
```

## Alternative: Deploy via Supabase Dashboard

If the CLI doesn't work, you can deploy via the dashboard:

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions**
3. Find `send-email` function
4. Click **Edit** or **Deploy**
5. Copy the code from `supabase/functions/send-email/index.ts`
6. Paste it in the editor
7. Click **Deploy**

## After Deployment

1. Test the form again
2. Send yourself another email
3. Check if it still goes to spam (it should be better now!)

---

**Note**: If you get errors, make sure:
- You're logged into Supabase (`supabase login`)
- Your project is linked (`supabase link`)
- You have the correct project ref








