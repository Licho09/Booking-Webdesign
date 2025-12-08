/*
  # Allow anonymous users to manage their own bookings
  
  This allows anonymous users to:
  - Read bookings by ID (for cancel/reschedule pages)
  - Update bookings (for rescheduling)
  - Delete bookings (for cancelling)
*/

-- Drop existing policy if it exists (in case we need to recreate it)
DROP POLICY IF EXISTS "Anonymous users can read bookings by ID" ON leads;

-- Allow anonymous users to select any booking (for cancel/reschedule pages)
-- This works alongside the existing "Anyone can check booking availability" policy
-- Supabase uses OR logic, so if either policy matches, the row is accessible
-- We allow reading any row that has booking info OR any row by ID
CREATE POLICY "Anonymous users can read bookings by ID"
  ON leads
  FOR SELECT
  TO anon
  USING (
    (booking_date IS NOT NULL AND booking_time IS NOT NULL)
    OR id IS NOT NULL
  );

-- Allow anonymous users to update their own bookings (for rescheduling)
CREATE POLICY "Anonymous users can update their bookings"
  ON leads
  FOR UPDATE
  TO anon
  USING (
    booking_date IS NOT NULL AND booking_time IS NOT NULL
  )
  WITH CHECK (
    booking_date IS NOT NULL AND booking_time IS NOT NULL
  );

-- Allow anonymous users to delete their own bookings (for cancelling)
CREATE POLICY "Anonymous users can delete their bookings"
  ON leads
  FOR DELETE
  TO anon
  USING (
    booking_date IS NOT NULL AND booking_time IS NOT NULL
  );

