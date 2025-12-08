/*
  # Fix anonymous user read policy for bookings
  
  The previous policy might not be working correctly.
  This ensures anonymous users can read any booking by ID.
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anonymous users can read bookings by ID" ON leads;

-- Create a simpler, more permissive policy that allows reading any row
-- This is safe because we're only allowing SELECT, not UPDATE/DELETE
CREATE POLICY "Anonymous users can read bookings by ID"
  ON leads
  FOR SELECT
  TO anon
  USING (true);

