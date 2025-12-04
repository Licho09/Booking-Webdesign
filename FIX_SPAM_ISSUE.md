# Fix Emails Going to Spam

## Why Emails Go to Spam

Emails go to spam for several reasons:
1. **Domain not fully authenticated** (SPF, DKIM, DMARC records missing)
2. **Poor sender reputation** (new domain, low email volume)
3. **Email content triggers spam filters**
4. **Missing proper email headers**

## Step 1: Verify Domain Authentication in Resend

This is the **most important step**:

1. **Go to Resend Domains**: https://resend.com/domains
2. **Check your domain status** (`designcxlabs.com`)
3. **Verify all DNS records are added**:
   - **SPF Record** - Authorizes Resend to send emails
   - **DKIM Record** - Signs emails cryptographically
   - **DMARC Record** - Policy for handling failed authentication

### How to Add DNS Records

1. Go to your domain registrar (where you bought `designcxlabs.com`)
2. Find DNS settings / DNS management
3. Add the records Resend provides:
   - **Type**: TXT (for SPF, DKIM, DMARC)
   - **Name**: The subdomain Resend specifies (usually `@` or `_resend`)
   - **Value**: The record value Resend provides
   - **TTL**: 3600 (or default)

4. **Wait for DNS propagation** (can take up to 48 hours, usually 1-2 hours)
5. **Check Resend dashboard** - it should show "Verified" ✅

## Step 2: Use Proper "From" Format

✅ **Good**: `DesignCXLabs <info@designcxlabs.com>`  
❌ **Bad**: `info@designcxlabs.com` (no display name)

The code has been updated to use the proper format automatically.

## Step 3: Warm Up Your Domain (New Domains)

If `designcxlabs.com` is a new domain:

1. **Start with low volume** - Send a few emails per day initially
2. **Gradually increase** - Over 2-4 weeks, increase email volume
3. **Monitor deliverability** - Check Resend logs for bounce rates

## Step 4: Improve Email Content

The email template has been updated to:
- ✅ Use proper "From" name format
- ✅ Include proper email headers
- ✅ Add email tags for better tracking
- ✅ Avoid spam trigger words

## Step 5: Check Email Authentication Status

After adding DNS records, verify they're working:

1. **Send a test email** to yourself
2. **Check email headers** (in Gmail: Click "Show original")
3. **Look for**:
   - `SPF: PASS`
   - `DKIM: PASS`
   - `DMARC: PASS`

## Step 6: Monitor Deliverability

1. **Check Resend logs**: https://resend.com/emails
2. **Look for**:
   - Bounce rates (should be < 5%)
   - Spam complaints (should be < 0.1%)
   - Delivery rates (should be > 95%)

## Quick Checklist

- [ ] Domain verified in Resend (all DNS records added)
- [ ] DNS records propagated (check with `nslookup` or online DNS checker)
- [ ] Using proper "From" format with display name
- [ ] Email headers are set correctly
- [ ] Domain is not brand new (or warming it up gradually)
- [ ] Email content doesn't trigger spam filters

## Testing Domain Authentication

After adding DNS records, test them:

### Using Online Tools:
- **MXToolbox**: https://mxtoolbox.com/spf.aspx
- **DMARC Analyzer**: https://dmarcian.com/dmarc-inspector/
- **Google Admin Toolbox**: https://toolbox.googleapps.com/apps/checkmx/

Enter `designcxlabs.com` and check:
- SPF record exists and is valid
- DKIM record exists and is valid
- DMARC record exists and is valid

## If Still Going to Spam After Fixing DNS

1. **Mark as "Not Spam"** in Gmail/Outlook
   - This trains the email provider that your emails are legitimate
   - Do this for the first few emails

2. **Add to Contacts**
   - Add `info@designcxlabs.com` to your contacts
   - This helps email providers trust your domain

3. **Wait for Reputation to Build**
   - New domains need time to build reputation
   - After 1-2 weeks of consistent sending, deliverability improves

4. **Check Resend Deliverability Score**
   - Go to Resend dashboard
   - Check your domain's deliverability score
   - Should improve over time

## Common Issues

### "Domain not verified" in Resend
- **Solution**: Add all DNS records Resend provides
- **Wait**: DNS can take up to 48 hours to propagate

### "SPF: FAIL" in email headers
- **Solution**: Make sure SPF record includes Resend's servers
- **Check**: SPF record should have `include:_spf.resend.com`

### "DKIM: FAIL" in email headers
- **Solution**: Add DKIM record exactly as Resend provides
- **Check**: DKIM record name and value must match exactly

### Emails still going to spam after DNS is correct
- **Solution**: This is normal for new domains - wait 1-2 weeks
- **Action**: Mark emails as "Not Spam" to train the filter

## Need Help?

- **Resend Support**: https://resend.com/support
- **Resend Docs**: https://resend.com/docs
- **DNS Help**: Contact your domain registrar support



