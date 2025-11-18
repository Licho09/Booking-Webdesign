/*
  # Create leads table for web design landing page

  1. New Tables
    - `leads`
      - `id` (uuid, primary key) - Unique identifier for each lead
      - `name` (text) - Full name of the prospect
      - `business` (text) - Business name
      - `email` (text) - Email address for follow-up
      - `phone` (text, nullable) - Phone or WhatsApp number
      - `industry` (text, nullable) - Business industry/category
      - `notes` (text, nullable) - Additional notes from prospect
      - `created_at` (timestamptz) - Timestamp of form submission
      - `status` (text) - Lead status (new, contacted, converted, etc.)

  2. Security
    - Enable RLS on `leads` table
    - Add policy for public inserts (form submissions)
    - Add policy for authenticated admins to view all leads

  3. Notes
    - Default status is 'new' for all incoming leads
    - Public can only insert (submit form), not read or update
    - Table is locked down by default with RLS enabled
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business text NOT NULL,
  email text NOT NULL,
  phone text,
  industry text,
  notes text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'new'
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);