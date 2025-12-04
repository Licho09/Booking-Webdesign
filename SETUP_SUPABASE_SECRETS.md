# Setting Up Supabase Secrets for Email

## Quick Setup Steps

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Edge Functions Secrets**
   - Go to: **Settings** → **Edge Functions** → **Secrets**
   - Or directly: **Edge Functions** → **Secrets** (in the left sidebar)

3. **Add These Secrets:**

   Click **Add new secret** for each:

   | Secret Name | Value | Description |
   |------------|-------|-------------|
   | `RESEND_API_KEY` | `re_xxxxxxxxx` | Your Resend API key (get from https://resend.com/api-keys) |
   | `FROM_EMAIL` | `info@designcxlabs.com` | The email address to send from (your verified domain) |
   | `REPLY_TO_EMAIL` | `info@designcxlabs.com` | Where replies should go |

4. **Verify Your Domain in Resend**
   - Go to: https://resend.com/domains
   - Make sure `designcxlabs.com` shows as **Verified**
   - If not verified, add the DNS records Resend provides

5. **Redeploy the Edge Function** (if needed)
   ```bash
   cd project
   supabase functions deploy send-email
   ```

## Testing

After setting secrets:
1. Submit the booking form on your website
2. Check your email inbox (luischirinos1000@gmail.com)
3. The email should come from `info@designcxlabs.com`

## Troubleshooting

### Email still not working?
- Check Supabase Edge Function logs: Dashboard → Edge Functions → send-email → Logs
- Check Resend logs: https://resend.com/emails
- Verify domain is verified in Resend

### "Domain not verified" error?
- Go to https://resend.com/domains
- Verify `designcxlabs.com` is verified
- Add required DNS records if needed



