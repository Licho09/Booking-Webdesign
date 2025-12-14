# Setup Owner Email Notifications

When someone books a meeting, you'll receive an email notification at `luischirinos1000@gmail.com`.

## Step 1: Deploy the New Function

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **Create a new function**
3. Name it: `send-owner-email`
4. Copy the code from: `project/supabase/functions/send-owner-email/index.ts`
5. Paste it in the editor
6. Click **Deploy**

## Step 2: Set Up Secrets

1. Go to **Supabase Dashboard** → **Edge Functions** → **Secrets**
2. Add/Update these secrets:

   | Secret Name | Value | Description |
   |------------|-------|-------------|
   | `RESEND_API_KEY` | `re_xxxxxxxxx` | Your Resend API key (should already be set) |
   | `OWNER_EMAIL` | `luischirinos1000@gmail.com` | Your email to receive notifications |
   | `FROM_EMAIL` | `info@designcxlabs.com` | Email address to send from (should already be set) |

## Step 3: Test It!

1. Fill out the booking form on your website
2. Submit it
3. Check `luischirinos1000@gmail.com` - you should receive a notification email!

## What the Notification Includes

The email will contain:
- ✅ Lead's name and contact info
- ✅ Business name
- ✅ Appointment date and time
- ✅ Quick action links (reply, call)
- ✅ Professional formatting

## How It Works

1. Customer submits booking form
2. Customer receives confirmation email (from `info@designcxlabs.com`)
3. **You receive notification email** (to `luischirinos1000@gmail.com`)
4. When you reply to the notification, it goes to the customer's email

## Troubleshooting

### Not receiving notifications?

1. **Check Supabase secrets are set:**
   - `RESEND_API_KEY` - Your Resend API key
   - `OWNER_EMAIL` - `luischirinos1000@gmail.com`
   - `FROM_EMAIL` - `info@designcxlabs.com`

2. **Check function is deployed:**
   - Go to Edge Functions
   - Make sure `send-owner-email` shows as "Active"

3. **Check Supabase logs:**
   - Go to Edge Functions → `send-owner-email` → Logs
   - Look for any errors

4. **Check spam folder:**
   - Sometimes notification emails go to spam initially
   - Mark as "Not Spam" if needed

### Function not found?

- Make sure the function name is exactly: `send-owner-email`
- Check it's deployed and active
- Try redeploying it

## Customizing the Notification

You can edit the email template in:
`project/supabase/functions/send-owner-email/index.ts`

Change the HTML content in the `emailHtml` variable to customize the design.













