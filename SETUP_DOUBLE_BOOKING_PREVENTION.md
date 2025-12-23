# Setup Double Booking Prevention

Your booking form already has double booking prevention built in! You just need to run the database migration.

## What's Already Working

✅ **Form checks for booked slots** - When you select a date, it fetches all booked time slots  
✅ **Visual indicators** - Booked time slots are disabled and grayed out  
✅ **Double-check before submit** - The form checks the database one more time before submitting  
✅ **Error messages** - Shows clear error if someone tries to book an already-booked slot

## Step 1: Run the Database Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the contents of: `supabase/migrations/20251203000000_add_booking_fields.sql`
4. Paste and **Run** the SQL

This will:
- Add `booking_date` and `booking_time` columns to the `leads` table
- Create an index for faster lookups
- Update RLS policies to allow checking booking availability

## Step 2: Test It

1. Fill out the booking form and book a time slot
2. Try to book the same time slot again (in a different browser/incognito)
3. You should see: "This time slot is already booked. Please select another time."

## How It Works

1. **When date is selected**: Form fetches all booked time slots for that date
2. **Time slots display**: Booked slots are disabled and grayed out
3. **Before submit**: Form double-checks the database to ensure slot is still available
4. **On submit**: Saves booking with `booking_date` and `booking_time`
5. **After submit**: The slot is immediately marked as booked

## Database Schema

After running the migration, your `leads` table will have:
- `booking_date` (DATE) - The date of the appointment
- `booking_time` (TEXT) - The time slot (e.g., "10:00 AM")

## Security Note

The RLS policy allows anonymous users to read booking information. This is necessary so users can see which slots are booked. However, the form only queries `booking_date` and `booking_time` - not sensitive information like email or phone.

## Troubleshooting

### "Time slot is already booked" error when it shouldn't be
- Check if the migration was run successfully
- Verify `booking_date` and `booking_time` columns exist
- Check Supabase logs for any errors

### Booked slots not showing as disabled
- Make sure the migration was run
- Check browser console for errors
- Verify RLS policy allows SELECT for anonymous users

### Can't see any bookings
- Check if bookings are being saved with `booking_date` and `booking_time`
- Verify the date format matches (YYYY-MM-DD)
- Check Supabase table to see if data is being saved correctly



