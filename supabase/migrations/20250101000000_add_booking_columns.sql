/*
  # Add booking date/time columns and prevent duplicate bookings

  1. New Columns
    - `booking_date` (date) - The date of the booking
    - `booking_time` (text) - The time slot (e.g., "09:00 AM")
  
  2. Constraints
    - Unique constraint on (booking_date, booking_time) to prevent double bookings
    - Index for fast lookups
  
  3. Security
    - Allow anonymous users to SELECT bookings to check availability
*/

-- Add booking columns
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS booking_date date,
ADD COLUMN IF NOT EXISTS booking_time text;

-- Create unique constraint to prevent double bookings
-- Only enforce uniqueness when both date and time are not null
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_unique_booking 
ON leads(booking_date, booking_time) 
WHERE booking_date IS NOT NULL AND booking_time IS NOT NULL;

-- Create index for fast availability checks
CREATE INDEX IF NOT EXISTS idx_leads_booking_date_time 
ON leads(booking_date, booking_time) 
WHERE booking_date IS NOT NULL AND booking_time IS NOT NULL;

-- Allow anonymous users to read bookings (for availability checking)
CREATE POLICY "Anyone can check booking availability"
  ON leads
  FOR SELECT
  TO anon
  USING (booking_date IS NOT NULL AND booking_time IS NOT NULL);