import { supabase } from './supabase';

export async function sendOwnerNotification(
  name: string,
  email: string,
  phone: string | undefined,
  businessName: string,
  date: string,
  time: string
): Promise<{ success: boolean; error?: string }> {
  console.log('📱 Attempting to send owner notification...');

  if (!supabase) {
    console.error('❌ Supabase client not configured. Notification will not be sent.');
    return { success: false, error: 'Notification service not configured' };
  }

  try {
    console.log('📝 Notification data:', { name, email, phone, businessName, date, time });

    const { data, error } = await supabase.functions.invoke('send-owner-notification', {
      body: {
        name,
        email,
        phone,
        businessName,
        date,
        time,
      },
    });

    if (error) {
      console.error('❌ Owner notification failed:', error);
      return { success: false, error: error.message || 'Failed to send notification' };
    }

    console.log('✅ Owner notification sent successfully!', data);
    return { success: true };
  } catch (error) {
    console.error('❌ Error calling notification function:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

