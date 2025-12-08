# Deploying Supabase Edge Functions

## Current Status

✅ **send-email** - Working! (Email confirmations are being sent)  
⚠️ **send-owner-notification** - Not deployed or not configured (SMS notifications)

## Deploy the Functions

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   cd project
   supabase link --project-ref agtrmlktcxwkksclhknn
   ```
   (Replace with your actual project ref if different)

4. **Deploy the email function**:
   ```bash
   supabase functions deploy send-email
   ```

5. **Deploy the owner notification function** (optional - only if you want SMS):
   ```bash
   supabase functions deploy send-owner-notification
   ```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it `send-email`
5. Copy the code from `supabase/functions/send-email/index.ts`
6. Deploy it
7. Repeat for `send-owner-notification` (optional)

## Set Secrets After Deployment

After deploying, set the secrets:

1. Go to **Edge Functions** → **Secrets**
2. Add:
   - `RESEND_API_KEY` = your Resend API key
   - `FROM_EMAIL` = `info@designcxlabs.com`
   - `REPLY_TO_EMAIL` = `info@designcxlabs.com`

For SMS notifications (optional):
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `OWNER_PHONE`

## Note About Owner Notification

The owner notification (SMS) is **optional**. The form will work fine without it. The CORS error you're seeing is because:
- The function isn't deployed, OR
- Twilio isn't configured

This won't affect form submissions - emails are still being sent successfully!





