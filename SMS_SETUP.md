# SMS Confirmation Setup Guide

This guide will help you set up SMS confirmations using Twilio when someone submits the booking form.

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com - free trial available)
2. A Supabase project with Edge Functions enabled

## Step 1: Get Twilio Credentials

1. Sign up for a Twilio account at https://www.twilio.com
2. Once logged in, go to the [Console Dashboard](https://console.twilio.com/)
3. You'll find your **Account SID** and **Auth Token** on the dashboard
4. Get a phone number:
   - Go to [Phone Numbers > Manage > Buy a number](https://console.twilio.com/us1/develop/phone-numbers/manage/search)
   - Buy a phone number (free trial includes $15.50 credit)
   - Copy the phone number (format: +1234567890)

## Step 2: Deploy Supabase Edge Function

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in your Supabase project settings)

4. Deploy the function:
   ```bash
   supabase functions deploy send-sms
   ```

5. Set environment variables:
   ```bash
   supabase secrets set TWILIO_ACCOUNT_SID=your_account_sid
   supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
   supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
   ```

### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it `send-sms`
5. Copy the code from `supabase/functions/send-sms/index.ts`
6. Deploy the function
7. Go to **Settings > Edge Functions > Secrets**
8. Add these secrets:
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `TWILIO_PHONE_NUMBER`: Your Twilio phone number (format: +1234567890)

## Step 3: Test the Setup

1. Submit the form with a phone number
2. Check your phone for the confirmation SMS
3. Check the browser console for any errors

## Troubleshooting

### SMS not sending?

1. **Check Twilio credentials**: Make sure all three secrets are set correctly
2. **Check phone number format**: Ensure the Twilio phone number includes country code (e.g., +1 for US)
3. **Check Twilio console**: Go to [Twilio Console > Monitor > Logs](https://console.twilio.com/us1/monitor/logs) to see if messages are being sent
4. **Check Supabase logs**: Go to your Supabase dashboard > Edge Functions > send-sms > Logs

### Function not found?

- Make sure the Edge Function is deployed
- Check that the function name matches exactly: `send-sms`
- Verify your Supabase URL is correct in `.env`

### CORS errors?

- The function includes CORS headers, but if you see CORS errors, check that your Supabase project allows requests from your domain

## Cost Considerations

- Twilio free trial: $15.50 credit (enough for ~1000 SMS messages)
- After trial: ~$0.0075 per SMS in the US
- Supabase Edge Functions: Free tier includes 500K invocations/month

## Alternative: Use a Different SMS Service

If you prefer a different SMS service (like AWS SNS, Vonage, etc.), you can modify the `send-sms` function to use their API instead of Twilio. The function structure remains the same, just update the API call section.






