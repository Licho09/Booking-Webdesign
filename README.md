# Website Backend Setup Guide

This project uses **Supabase** as the backend database for storing form submissions.

## Prerequisites

- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- A Supabase account (free tier works) - [Sign up here](https://supabase.com)

## Setup Steps

### 1. Install Dependencies

```bash
cd project
npm install
```

### 2. Set Up Supabase

#### Option A: Use Supabase Cloud (Recommended for beginners)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **API** in your Supabase dashboard
4. Copy your **Project URL** and **anon/public key**

#### Option B: Use Local Supabase (Advanced)

If you want to run Supabase locally, install the Supabase CLI:
```bash
npm install -g supabase
supabase start
```

### 3. Run Database Migration

#### For Supabase Cloud:
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/migrations/20251112224459_create_leads_table.sql`
3. Paste and run it in the SQL Editor

#### For Local Supabase:
```bash
supabase db reset
```

### 4. Create Environment File

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

- `src/components/` - React components
- `src/lib/supabase.ts` - Supabase client configuration
- `supabase/migrations/` - Database migration files
- `.env` - Environment variables (not committed to git)

## Viewing Form Submissions

To view submitted leads:
1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. Select the `leads` table
4. All form submissions will appear here

## Troubleshooting

- **"Missing Supabase environment variables"**: Make sure `.env` file exists and has correct values
- **Form submission fails**: Check that the migration has been run and RLS policies are set correctly
- **Port already in use**: Change the port in `vite.config.ts` or kill the process using port 5173







