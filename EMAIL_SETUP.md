# Email Confirmation Setup Guide

This guide will help you set up email confirmations using Resend when someone submits the booking form.

## Prerequisites

1. A Resend account (sign up at https://resend.com - free tier available)
2. A Supabase project with Edge Functions enabled
3. A domain (optional but recommended for better deliverability)

## Step 1: Get Resend API Key

1. Sign up for a Resend account at https://resend.com
2. Once logged in, go to [API Keys](https://resend.com/api-keys)
3. Click **Create API Key**
4. Give it a name (e.g., "Website Booking Confirmations")
5. Copy the API key (you'll only see it once!)

## Step 2: Verify Your Domain (Recommended)

For better email deliverability, verify your domain:

1. Go to [Domains](https://resend.com/domains) in Resend
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually takes a few minutes)

**Note:** If you don't have a domain yet, you can use Resend's test domain, but emails may go to spam.

## Step 3: Deploy Supabase Edge Function

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI (if not already installed):
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
   supabase functions deploy send-email
   ```

5. Set environment variables:
   ```bash
   supabase secrets set RESEND_API_KEY=re_your_api_key_here
   supabase secrets set FROM_EMAIL=noreply@yourdomain.com
   supabase secrets set REPLY_TO_EMAIL=hello@yourdomain.com
   ```

### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it `send-email`
5. Copy the code from `supabase/functions/send-email/index.ts`
6. Deploy the function
7. Go to **Settings > Edge Functions > Secrets**
8. Add these secrets:
   - `RESEND_API_KEY`: Your Resend API key (starts with `re_`)
   - `FROM_EMAIL`: The email address to send from (e.g., `noreply@yourdomain.com`)
   - `REPLY_TO_EMAIL`: The email address for replies (e.g., `hello@yourdomain.com`)

## Step 4: Configure Email Addresses

Update the email addresses in your Supabase secrets:

- **FROM_EMAIL**: This is the "from" address in emails. Use a verified domain or Resend's test domain.
- **REPLY_TO_EMAIL**: This is where replies will go. Use your actual business email.

**Example:**
- FROM_EMAIL: `noreply@yourdomain.com` or `onboarding@resend.dev` (for testing)
- REPLY_TO_EMAIL: `hello@yourdomain.com` or `yourname@gmail.com`

## Step 5: Test the Setup

1. Submit the form with an email address
2. Check the email inbox (and spam folder)
3. Check the browser console for any errors
4. Check Supabase Edge Function logs for debugging

## Troubleshooting

### Email not sending?

1. **Check Resend API key**: Make sure it's set correctly in Supabase secrets
2. **Check email addresses**: Verify FROM_EMAIL and REPLY_TO_EMAIL are set
3. **Check Resend dashboard**: Go to [Resend > Logs](https://resend.com/emails) to see if emails are being sent
4. **Check Supabase logs**: Go to your Supabase dashboard > Edge Functions > send-email > Logs
5. **Check spam folder**: Test emails might go to spam if using unverified domain

### Function not found?

- Make sure the Edge Function is deployed
- Check that the function name matches exactly: `send-email`
- Verify your Supabase URL is correct in `.env`

### CORS errors?

- The function includes CORS headers, but if you see CORS errors, check that your Supabase project allows requests from your domain

### Emails going to spam?

- Verify your domain in Resend
- Use a proper FROM_EMAIL from your verified domain
- Avoid spam trigger words in the email content
- Set up SPF and DKIM records (Resend provides these)

## Cost Considerations

- Resend free tier: 3,000 emails/month, 100 emails/day
- After free tier: $20/month for 50,000 emails
- Supabase Edge Functions: Free tier includes 500K invocations/month

## Alternative: Use a Different Email Service

If you prefer a different email service (like SendGrid, Mailgun, AWS SES, etc.), you can modify the `send-email` function to use their API instead of Resend. The function structure remains the same, just update the API call section.

### Example: Using SendGrid

Replace the Resend API call with:
```typescript
const sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
const response = await fetch(sendgridUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email }] }],
    from: { email: FROM_EMAIL },
    subject: `Booking Confirmed: ${date} at ${time}`,
    content: [
      { type: 'text/plain', value: emailText },
      { type: 'text/html', value: emailHtml },
    ],
  }),
});
```

## Customizing the Email Template

You can customize the email HTML in `supabase/functions/send-email/index.ts`. The template includes:
- Professional gradient header
- Appointment details section
- Business name (if provided)
- Friendly closing message

Modify the `emailHtml` variable to match your brand colors and style!






