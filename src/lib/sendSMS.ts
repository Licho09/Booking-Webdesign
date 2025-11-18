/**
 * Send SMS confirmation via Supabase Edge Function
 */
export async function sendSMSConfirmation(
  phone: string,
  name: string,
  date: string,
  time: string
): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  if (!supabaseUrl) {
    console.warn('Supabase URL not configured. SMS will not be sent.');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const functionUrl = `${supabaseUrl}/functions/v1/send-sms`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
      },
      body: JSON.stringify({
        phone,
        name,
        date,
        time,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('SMS sending failed:', data);
      return { success: false, error: data.error || 'Failed to send SMS' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error calling SMS function:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}



