import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Make Supabase optional - only create client if credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Lead {
  id?: string;
  name: string;
  business: string;
  email: string;
  phone?: string;
  industry?: string;
  notes?: string;
  created_at?: string;
  status?: string;
  booking_date?: string;
  booking_time?: string;
}
