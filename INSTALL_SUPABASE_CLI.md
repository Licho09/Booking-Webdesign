# Install Supabase CLI on Windows

Since `npm install -g supabase` doesn't work, here are the working methods:

## Method 1: Install Scoop, then Supabase (Recommended)

### Step 1: Install Scoop

Open **PowerShell as Administrator** and run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### Step 2: Install Supabase CLI

```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 3: Verify

```bash
supabase --version
```

## Method 2: Download Binary Directly (No Package Manager Needed)

1. Go to: https://github.com/supabase/cli/releases/latest
2. Download: `supabase_windows_amd64.exe` (or `supabase_windows_arm64.exe` if you have ARM)
3. Rename it to `supabase.exe`
4. Create a folder like `C:\tools\supabase\` and move the file there
5. Add `C:\tools\supabase\` to your Windows PATH:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to **Advanced** tab → **Environment Variables**
   - Under **System Variables**, find **Path** and click **Edit**
   - Click **New** and add `C:\tools\supabase\`
   - Click **OK** on all dialogs
6. Open a new terminal and verify:
   ```bash
   supabase --version
   ```

## Method 3: Use Supabase Dashboard (No CLI Needed)

You can deploy functions directly through the Supabase Dashboard:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Edge Functions**
4. Click **Create a new function**
5. Copy and paste the code from each function file
6. Name it and deploy

This method works but is more manual.

## After Installation

Once Supabase CLI is installed, continue with the deployment steps in `DEPLOY_FUNCTIONS.md`.



