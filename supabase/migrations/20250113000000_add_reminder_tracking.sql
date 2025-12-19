`/*
  # Add reminder tracking columns to prevent duplicate emails

  1. New Columns
    - `reminder_1day_sent_at` (timestamptz) - Timestamp when 1-day reminder was sent
    - `reminder_starting_soon_sent_at` (timestamptz) - Timestamp when starting soon reminder was sent
  
  2. Purpose
    - Prevents duplicate reminder emails when cron job runs multiple times
    - Tracks when each type of reminder was sent for auditing
*/

-- Add reminder tracking columns
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS reminder_1day_sent_at timestamptz,
ADD COLUMN IF NOT EXISTS reminder_starting_soon_sent_at timestamptz;

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_leads_reminder_1day_sent 
ON leads(reminder_1day_sent_at) 
WHERE reminder_1day_sent_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_reminder_starting_soon_sent 
ON leads(reminder_starting_soon_sent_at) 
WHERE reminder_starting_soon_sent_at IS NOT NULL;

`