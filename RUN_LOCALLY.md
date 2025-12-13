# Running the Project Locally

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd project
npm install
```

### Step 2: Set Up Environment Variables
1. Create a `.env` file in the `project` folder
2. Copy the template from `.env.example`:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Replace with your actual Supabase credentials:
   - Get them from: Supabase Dashboard → Settings → API

### Step 3: Start the Development Server
```bash
npm run dev
```

The app will open at: **http://localhost:5173**

---

## Alternative: Use the Batch File (Windows)

Just double-click `start-server.bat` - it will install dependencies and start the server automatically!

---

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Supabase Account** (free tier works) - [Sign up here](https://supabase.com)

---

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

## Troubleshooting

### "npm: command not found"
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### "Port 5173 already in use"
- Kill the process using port 5173, or
- Change the port in `vite.config.ts`

### "Missing Supabase environment variables"
- Make sure `.env` file exists in the `project` folder
- Check that variable names start with `VITE_`
- Restart the dev server after creating/editing `.env`

### Dependencies won't install
- Try deleting `node_modules` and `package-lock.json`
- Run `npm install` again

---

## Testing Email Functionality

Once the server is running:
1. Fill out the booking form on your website
2. Submit it
3. Check your email inbox (and spam folder)

Make sure your Supabase Edge Function secrets are set:
- `RESEND_API_KEY`
- `FROM_EMAIL` (info@designcxlabs.com)
- `REPLY_TO_EMAIL` (info@designcxlabs.com)

See `TEST_EMAIL.md` for more details.












