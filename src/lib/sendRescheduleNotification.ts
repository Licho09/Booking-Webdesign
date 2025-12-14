import { supabase } from './supabase';

/**
 * Send reschedule notification emails to both client and owner
 */
export async function sendRescheduleNotification(
  email: string,
  name: string,
  oldDate: string,
  oldTime: string,
  newDate: string,
  newTime: string,
  businessName?: string
): Promise<{ success: boolean; error?: string }> {
  console.log('📧 Attempting to send reschedule notifications...');
  
  if (!supabase) {
    console.error('❌ Supabase client not configured.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase credentials');
      return { success: false, error: 'Missing Supabase credentials' };
    }
    
    const functionUrl = `${supabaseUrl}/functions/v1/send-reschedule-notification`;
    
    const requestBody = {
      email,
      name,
      oldDate,
      oldTime,
      newDate,
      newTime,
      businessName,
    };
    
    console.log('📤 Calling reschedule notification function...');
    
    const { data, error } = await supabase.functions.invoke('send-reschedule-notification', {
      body: requestBody,
    });

    if (error) {
      console.error('❌ Reschedule notification failed:', error);
      // Try direct fetch as fallback
      try {
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey,
          },
          body: JSON.stringify(requestBody),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          return { success: false, error: responseData.error || `HTTP ${response.status}` };
        }
        
        console.log('✅ Reschedule notifications sent successfully!');
        return { success: true };
      } catch (fetchError) {
        console.error('❌ Direct fetch also failed:', fetchError);
        return { success: false, error: error.message || 'Failed to send notifications' };
      }
    }

    console.log('✅ Reschedule notifications sent successfully!', data);
    return { success: true };
  } catch (error) {
    console.error('❌ Error calling reschedule notification function:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}






