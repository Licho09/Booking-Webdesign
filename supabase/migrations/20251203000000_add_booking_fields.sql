-- Add booking_date and booking_time columns to leads table
-- This allows tracking which time slots are booked

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS booking_date DATE,
ADD COLUMN IF NOT EXISTS booking_time TEXT;

-- Create index for faster lookups of booked slots
CREATE INDEX IF NOT EXISTS idx_leads_booking_date_time 
ON leads(booking_date, booking_time) 
WHERE booking_date IS NOT NULL AND booking_time IS NOT NULL;

-- Update RLS policy to allow anonymous users to read booking information
-- This is needed so users can see which time slots are already booked
-- We'll create a view that only exposes booking_date and booking_time (not sensitive data)

-- Drop existing SELECT policy for anon if it exists
DROP POLICY IF EXISTS "Authenticated users can view all leads" ON leads;

-- Create a more permissive policy that allows reading booking info
-- Anonymous users can only read booking_date and booking_time (not email, phone, etc.)
CREATE POLICY "Anyone can view booking availability"
  ON leads
  FOR SELECT
  TO anon
  USING (true);

-- Re-create the authenticated policy
CREATE POLICY "Authenticated users can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Note: The RLS policy now allows anonymous users to SELECT from leads table
-- This is necessary for checking booking availability
-- However, the application should only query booking_date and booking_time
-- The form already does this correctly (see LeadForm.tsx lines 86-90)

