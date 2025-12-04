# Deploy to Render - Step by Step Guide

## Prerequisites

1. **GitHub Account** (or GitLab/Bitbucket)
2. **Render Account** - Sign up at https://render.com
3. **Your code pushed to GitHub**

## Step 1: Push Code to GitHub

### If you don't have a GitHub repo yet:

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it (e.g., `designcxlabs-website`)
   - Make it **Public** or **Private** (your choice)
   - Don't initialize with README
   - Click **Create repository**

2. **Push your code:**
   ```bash
   cd "C:\Users\jlr\Downloads\My Website\project"
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repo name.

## Step 2: Create Render Account

1. Go to https://render.com
2. Sign up (you can use GitHub to sign in)
3. Connect your GitHub account

## Step 3: Create New Static Site on Render

1. **Go to Render Dashboard**
2. Click **New +** → **Static Site**
3. **Connect your repository:**
   - Select your GitHub account
   - Choose your repository (`designcxlabs-website` or whatever you named it)
   - Click **Connect**

4. **Configure the site:**
   - **Name**: `designcxlabs-website` (or your choice)
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `project` (if your repo root is "My Website", otherwise leave blank)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Add Environment Variables:**
   Click **Add Environment Variable** and add:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase URL (from `.env` file)
   
   Click **Add Environment Variable** again:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase Anon Key (from `.env` file)

6. **Click "Create Static Site"**

## Step 4: Wait for Deployment

- Render will automatically:
  1. Install dependencies
  2. Build your site
  3. Deploy it

- This takes about 2-5 minutes
- You'll see the build logs in real-time

## Step 5: Get Your Live URL

- Once deployed, you'll get a URL like:
  `https://designcxlabs-website.onrender.com`
- You can customize the domain later

## Step 6: Custom Domain (Optional)

1. Go to your site settings in Render
2. Click **Custom Domains**
3. Add your domain: `designcxlabs.com`
4. Follow Render's DNS instructions

## Important Notes

### Environment Variables
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Render
- These are needed for your site to work

### Auto-Deploy
- Render automatically deploys when you push to `main` branch
- Every push = new deployment

### Build Settings
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Node Version**: Render will auto-detect (should be 18+)

## Troubleshooting

### Build Fails?
- Check build logs in Render dashboard
- Make sure all dependencies are in `package.json`
- Check that `npm run build` works locally

### Site Not Working?
- Check environment variables are set correctly
- Check browser console for errors
- Verify Supabase credentials are correct

### Domain Not Working?
- Check DNS settings match Render's requirements
- Wait 24-48 hours for DNS propagation

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Static site created on Render
- [ ] Environment variables set (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Build successful
- [ ] Site is live!

## After Deployment

1. **Test your booking form** on the live site
2. **Check emails** are working
3. **Update any hardcoded URLs** if needed
4. **Set up custom domain** if you have one

Your site will be live at: `https://your-site-name.onrender.com`

