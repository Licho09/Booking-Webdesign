import { supabase } from './supabase';

/**
 * Send email confirmation via Supabase Edge Function
 */
export async function sendEmailConfirmation(
  email: string,
  name: string,
  date: string,
  time: string,
  businessName?: string,
  bookingId?: string,
  phone?: string
): Promise<{ success: boolean; error?: string }> {
  console.log('📧 Attempting to send email confirmation...');
  
  if (!supabase) {
    console.error('❌ Supabase client not configured. Email will not be sent.');
    console.error('💡 Make sure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    console.log('📝 Email data:', { email, name, date, time, businessName, bookingId });
    console.log('📋 Booking ID value:', bookingId);
    console.log('📋 Booking ID type:', typeof bookingId);
    console.log('📋 Booking ID truthy?', !!bookingId);
    
    // Get the Supabase URL and anon key for direct fetch
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase credentials');
      return { success: false, error: 'Missing Supabase credentials' };
    }
    
    const functionUrl = `${supabaseUrl}/functions/v1/send-email`;
    console.log('📤 Calling function URL:', functionUrl);
    
    // Prepare request body - explicitly include bookingId even if undefined
    const requestBody: any = {
      email,
      name,
      date,
      time,
    };
    if (businessName) requestBody.businessName = businessName;
    if (bookingId) requestBody.bookingId = bookingId;
    if (phone) requestBody.phone = phone;
    
    console.log('📤 Request body being sent:', JSON.stringify(requestBody, null, 2));
    
    // Try using supabase.functions.invoke first
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: requestBody,
    });

    if (error) {
      console.error('❌ Email sending failed with supabase.functions.invoke:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Try direct fetch as fallback
      console.log('🔄 Trying direct fetch as fallback...');
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
        console.log('📥 Direct fetch response:', response.status, responseData);
        
        if (!response.ok) {
          return { success: false, error: responseData.error || `HTTP ${response.status}` };
        }
        
        console.log('✅ Email sent successfully via direct fetch!', responseData);
        return { success: true };
      } catch (fetchError) {
        console.error('❌ Direct fetch also failed:', fetchError);
        return { success: false, error: error.message || 'Failed to send email' };
      }
    }

    console.log('✅ Email sent successfully!', data);
    console.log('📧 Email sent to:', email);
    console.log('📧 Email sent from: info@designcxlabs.com');
    console.log('📧 Check your inbox and spam folder!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error calling email function:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

