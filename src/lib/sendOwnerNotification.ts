import { supabase } from './supabase';

export async function sendOwnerNotification(
  name: string,
  email: string,
  phone: string | undefined,
  businessName: string,
  date: string,
  time: string
): Promise<{ success: boolean; error?: string }> {
  // Owner notification is now handled automatically by send-email function
  // No need to call a separate function
  console.log('ℹ️ Owner notification is sent automatically with customer confirmation email');
  return { success: true };
}




