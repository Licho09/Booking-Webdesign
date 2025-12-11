/*
  # Completely fix RLS policies for booking management
  
  This ensures anonymous users can read, update, and delete bookings.
  We'll drop all conflicting policies and recreate them properly.
*/

-- Drop all existing SELECT policies for anon users
DROP POLICY IF EXISTS "Anyone can check booking availability" ON leads;
DROP POLICY IF EXISTS "Anonymous users can read bookings by ID" ON leads;

-- Create a single, comprehensive SELECT policy
-- This allows anonymous users to read any booking
CREATE POLICY "Anonymous users can read all bookings"
  ON leads
  FOR SELECT
  TO anon
  USING (true);

-- Ensure UPDATE policy exists and is correct
DROP POLICY IF EXISTS "Anonymous users can update their bookings" ON leads;
CREATE POLICY "Anonymous users can update their bookings"
  ON leads
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Ensure DELETE policy exists and is correct
DROP POLICY IF EXISTS "Anonymous users can delete their bookings" ON leads;
CREATE POLICY "Anonymous users can delete their bookings"
  ON leads
  FOR DELETE
  TO anon
  USING (true);


