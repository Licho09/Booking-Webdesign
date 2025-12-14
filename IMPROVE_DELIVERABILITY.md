# How to Stop Emails Going to Spam

Even with a verified domain, new domains often go to spam initially. Here's how to fix it:

## Immediate Actions (Do These Now)

### 1. Mark as "Not Spam" in Gmail

**This is the most important step!**

1. Open the email in your spam folder
2. Click the **"Not spam"** button (or move it to Inbox)
3. **Do this for the next 5-10 emails** you receive
4. This trains Gmail that your emails are legitimate

### 2. Add to Contacts

1. Open the email
2. Click on the sender name: `DesignCXLabs <info@designcxlabs.com>`
3. Click **"Add to contacts"**
4. This tells Gmail to trust this sender

### 3. Check Email Authentication

1. Open the email in Gmail
2. Click the **three dots** (⋮) → **Show original**
3. Look for these lines:
   - `SPF: PASS` ✅
   - `DKIM: PASS` ✅
   - `DMARC: PASS` ✅

If any show **FAIL**, your DNS records aren't set up correctly.

## Verify DNS Records Are Correct

### Check in Resend:
1. Go to: https://resend.com/domains
2. Click on `designcxlabs.com`
3. Make sure all records show **"Verified"** ✅

### Test DNS Records Online:
1. Go to: https://mxtoolbox.com/spf.aspx
2. Enter: `designcxlabs.com`
3. Check that SPF record includes `_spf.resend.com`

## Why New Domains Go to Spam

Even with perfect setup, new domains have **low sender reputation**. This is normal! It takes time to build trust.

**Timeline:**
- **Week 1-2**: Emails may go to spam (normal)
- **Week 2-4**: Deliverability improves as you send more emails
- **After 1 month**: Should have good deliverability

## Build Domain Reputation

### 1. Send Consistently
- Send emails regularly (not just when someone books)
- Start with low volume, gradually increase

### 2. Monitor Engagement
- High open rates = better reputation
- Low spam complaints = better reputation
- Reply to emails = shows engagement

### 3. Check Resend Analytics
- Go to: https://resend.com/emails
- Check bounce rates (should be < 5%)
- Check spam complaints (should be < 0.1%)

## Additional Improvements Made

The email function has been updated with:
- ✅ Proper "From" format with display name
- ✅ List-Unsubscribe header (required by Gmail)
- ✅ Better email headers
- ✅ Professional email footer
- ✅ Email tags for categorization

## Quick Checklist

- [ ] Mark next 5-10 emails as "Not Spam"
- [ ] Add `info@designcxlabs.com` to contacts
- [ ] Verify SPF/DKIM/DMARC are PASS in email headers
- [ ] Check Resend dashboard - domain shows "Verified"
- [ ] Test DNS records online
- [ ] Monitor Resend analytics for bounce rates

## If Still Going to Spam After 2 Weeks

1. **Check Resend Deliverability Score**
   - Go to Resend dashboard
   - Check your domain's score
   - Should improve over time

2. **Contact Resend Support**
   - They can help diagnose issues
   - https://resend.com/support

3. **Consider Email Warm-up Service**
   - Services like Warmbox, Lemwarm can help
   - Gradually increases sending volume
   - Builds reputation faster

## Important Notes

- **This is normal for new domains** - don't panic!
- **Marking as "Not Spam" is crucial** - do this every time
- **Consistency matters** - send emails regularly
- **Patience** - reputation builds over 2-4 weeks

## Test Right Now

1. Send yourself another test email
2. When it arrives (even in spam):
   - Mark as "Not Spam"
   - Add to contacts
   - Check email headers for SPF/DKIM/DMARC
3. Repeat for next few emails

The more you mark as "Not Spam", the faster Gmail will learn to trust your domain!













