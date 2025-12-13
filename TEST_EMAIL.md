# Testing Your Resend Email Setup

This guide will help you test your Resend email integration with your domain `designcxlabs.com`.

## Quick Test Options

### Option 1: Direct Resend Test (Fastest - No Supabase needed)

1. Open `test-resend-email.js` in a text editor
2. Replace `re_xxxxxxxxx` with your actual Resend API key
3. Run the test:
   ```bash
   cd project
   node test-resend-email.js
   ```

This will send a test email directly from `info@designcxlabs.com` to `luischirinos1000@gmail.com`.

### Option 2: Test Through Supabase Edge Function (Full Integration Test)

1. **Set up Supabase Secrets** (if not already done):
   - Go to your Supabase Dashboard
   - Navigate to **Settings** → **Edge Functions** → **Secrets**
   - Add these secrets:
     - `RESEND_API_KEY`: Your Resend API key (starts with `re_`)
     - `FROM_EMAIL`: `info@designcxlabs.com`
     - `REPLY_TO_EMAIL`: `info@designcxlabs.com`

2. **Deploy the Edge Function** (if not already deployed):
   ```bash
   cd project
   supabase functions deploy send-email
   ```

3. **Test using the HTML file**:
   - Open `test-email-simple.html` in your browser
   - Enter your Supabase URL and Anon Key
   - Enter your email: `luischirinos1000@gmail.com`
   - Click "Send Test Email"

### Option 3: Test Through the Booking Form (Real-world test)

1. Make sure your Supabase secrets are set (see Option 2, Step 1)
2. Start your dev server:
   ```bash
   cd project
   npm run dev
   ```
3. Fill out the booking form on your website
4. Submit the form
5. Check your email inbox (and spam folder)

## Important: Domain Verification

Before emails will work, make sure:

1. ✅ Your domain `designcxlabs.com` is verified in Resend
   - Go to: https://resend.com/domains
   - Check that `designcxlabs.com` shows as "Verified"
   - If not verified, add the DNS records Resend provides

2. ✅ Your Resend API key is correct
   - Get it from: https://resend.com/api-keys
   - Make sure it starts with `re_`

3. ✅ Your Supabase secrets are set correctly
   - `RESEND_API_KEY`: Your Resend API key
   - `FROM_EMAIL`: `info@designcxlabs.com`
   - `REPLY_TO_EMAIL`: `info@designcxlabs.com`

## Troubleshooting

### "Domain not verified" error
- Go to https://resend.com/domains
- Make sure `designcxlabs.com` is verified
- Add the required DNS records if needed

### "API key invalid" error
- Check that your API key starts with `re_`
- Make sure there are no extra spaces
- Get a new API key from https://resend.com/api-keys if needed

### Email not received
- Check spam folder
- Check Resend logs: https://resend.com/emails
- Check Supabase Edge Function logs in your dashboard

### Function not found
- Make sure the Edge Function is deployed: `supabase functions deploy send-email`
- Check the function name matches exactly: `send-email`

## Next Steps

Once the test email works:
1. ✅ Your email setup is working!
2. Test the full booking flow by submitting the form
3. Check that both confirmation emails work:
   - Email to the customer (booking confirmation)
   - Email to you (new booking notification)












