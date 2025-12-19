# Verify Function Name and URL

The function works in dashboard but not via public URL. Let's verify:

## Check Function Name

1. Go to Supabase Dashboard → Edge Functions
2. Look at the exact function name shown
3. Is it exactly: `check-and-send-reminders`?

## Try Different URL Formats

Try these URLs in your browser (with your anon key):

1. With query parameter:
```
https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders?apikey=YOUR_ANON_KEY
```

2. With Authorization header (test with curl or Postman):
```bash
curl -X GET "https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY"
```

3. Check if there's a region in the URL:
- Sometimes Supabase functions have regions like: `functions/v1/[region]/function-name`
- Check your Supabase project settings for region

## Alternative: Check Function Logs

1. Go to the function in Supabase
2. Check the "Logs" tab
3. See if there are any errors when accessing via public URL

## Possible Issues

1. Function name mismatch
2. Region-specific URL needed
3. Function needs to be made public
4. CORS or authentication issue




