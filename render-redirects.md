# Render SPA Routing Configuration

## Problem
React Router routes (like `/reschedule`, `/cancel`) return 404 on Render because the server doesn't know about these client-side routes.

## Solution: Configure Redirects in Render Dashboard

1. **Go to your Render Dashboard**
   - Navigate to: https://dashboard.render.com
   - Select your `designcxlabs-website` service

2. **Go to Settings → Redirects/Rewrites**

3. **Add a Rewrite Rule:**
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite` (not Redirect)
   - **Status Code:** `200`

4. **Save the changes**

5. **Redeploy** (or wait for auto-deploy if enabled)

## Why This Works
This tells Render to serve `index.html` for all routes, allowing React Router to handle routing on the client side.

## Alternative: Use HashRouter (Not Recommended)
You could switch to HashRouter, but URLs would look like:
- `https://www.designcxlabs.com/#/reschedule?id=...`
- This is less clean and not SEO-friendly

