# UptimeRobot Setup Guide (Free & Works with Supabase)

UptimeRobot is free and works with Supabase domains. Here's how to set it up:

## Step 1: Sign Up

1. Go to https://uptimerobot.com
2. Click "Sign Up" (top right)
3. Create a free account
4. Verify your email if needed

## Step 2: Create Monitor

1. After logging in, click **"Add New Monitor"** (big button)
2. You'll see monitor types - select **"HTTP(s)"**

## Step 3: Configure Monitor

Fill in the form:

### Basic Settings

**Monitor Type**: HTTP(s) (should already be selected)

**Friendly Name**: 
```
Check and send Reminders
```

**URL**: 
```
https://agtrmlktcxwkksclhknn.supabase.co/functions/v1/check-and-send-reminders
```

**Monitoring Interval**: 
- Select **"Every 15 minutes"** (or the closest option like 15 min)

### HTTP Settings (Important!)

Look for **"HTTP Method"** or **"Advanced Settings"**:

**HTTP Method**: 
- Change from GET to **POST**

**HTTP Headers**: 
Click "Add Header" or find the headers section, add these 3:

```
Authorization: Bearer YOUR_SERVICE_ROLE_KEY_HERE
```

```
apikey: YOUR_SERVICE_ROLE_KEY_HERE
```

**⚠️ IMPORTANT**: Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual Supabase Service Role Key. You can find it in your Supabase Dashboard under Settings → API → Service Role Key.

```
Content-Type: application/json
```

**HTTP Body** (if there's a field for it):
```
{}
```

### Alert Settings (Optional)

- You can disable alerts since this is just calling a function
- Or keep them on to know if the function fails

## Step 4: Save

Click **"Create Monitor"** or **"Save"**

## Step 5: Test It

1. After creating, you should see your monitor in the dashboard
2. Click on it to see details
3. You can manually trigger it or wait for the next scheduled run
4. Check the logs to see if it's working

## Important Notes

- **UptimeRobot free tier**: Allows 50 monitors, which is plenty
- **Monitoring interval**: 15 minutes is good, but you can adjust
- **This will call your function**: Every 15 minutes automatically
- **No domain restrictions**: Works with Supabase!

## Troubleshooting

**Can't find HTTP Method/Headers:**
- Look for "Advanced Settings" or "HTTP Options"
- Some versions have it in a dropdown or expandable section
- Try clicking "Show Advanced" or similar

**Function not being called:**
- Check the monitor logs in UptimeRobot
- Verify the URL is correct
- Make sure HTTP Method is POST
- Check that headers are added correctly

**Getting errors:**
- Verify your service role key is correct
- Check Supabase function logs
- Make sure the function is deployed

## What Happens Next

Once set up:
- UptimeRobot calls your function every 15 minutes
- Function checks for bookings that need reminders
- Sends 1-day reminders (23-25 hours before)
- Sends "starting soon" reminders (5-15 minutes before)
- Everything is automated! 🎉

## Alternative: If UptimeRobot Interface is Different

If you see a different interface:
1. Look for "HTTP(s)" monitor type
2. Find "POST" method option
3. Look for headers section (might be under "Advanced" or "Custom")
4. The key is: POST method + your 3 headers

Good luck! This should work much better than EasyCron for your needs.


