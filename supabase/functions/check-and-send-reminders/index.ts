import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
// Use SUPABASE_URL for function calls (functions are at the same base URL)
const FUNCTION_BASE_URL = SUPABASE_URL || '';

// Helper function to parse time string (e.g., "09:00 AM") to 24-hour format
function parseTimeTo24Hour(timeStr: string): { hours: number; minutes: number } {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let hour24 = hours;
  
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }
  
  return { hours: hour24, minutes };
}

// Helper function to calculate time difference in hours
function getHoursUntilBooking(bookingDate: string, bookingTime: string): number {
  const now = new Date();
  const [year, month, day] = bookingDate.split('-').map(Number);
  const { hours, minutes } = parseTimeTo24Hour(bookingTime);
  
  const bookingDateTime = new Date(year, month - 1, day, hours, minutes);
  const diffMs = bookingDateTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours;
}

// Helper function to format date for display
function formatDateForDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  // Allow both GET and POST for compatibility with free tier cron services
  // GET requests don't need authentication for this internal function
  // (The function uses service role key from environment, not from request)

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'Supabase credentials not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get current date in YYYY-MM-DD format
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Query all upcoming bookings (today and future dates)
    // We'll check bookings from today up to 7 days in the future
    // Include reminder tracking fields to prevent duplicates
    const { data: bookings, error } = await supabase
      .from('leads')
      .select('id, email, name, business, booking_date, booking_time, created_at, reminder_1day_sent_at, reminder_starting_soon_sent_at')
      .not('booking_date', 'is', null)
      .not('booking_time', 'is', null)
      .gte('booking_date', today)
      .lte('booking_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true });

    if (error) {
      console.error('❌ Error fetching bookings:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch bookings', details: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    if (!bookings || bookings.length === 0) {
      console.log('✅ No upcoming bookings found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No upcoming bookings',
          remindersSent: 0
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    console.log(`📋 Found ${bookings.length} upcoming bookings`);

    const results = {
      reminders1Day: [] as string[],
      remindersStartingSoon: [] as string[],
      errors: [] as string[],
    };

    // Process each booking
    for (const booking of bookings) {
      if (!booking.booking_date || !booking.booking_time) continue;

      const hoursUntil = getHoursUntilBooking(booking.booking_date, booking.booking_time);
      const formattedDate = formatDateForDisplay(booking.booking_date);

      try {
        // Check if we need to send 1-day reminder (23-25 hours before)
        // Only send if we haven't already sent one
        if (hoursUntil >= 23 && hoursUntil <= 25 && !booking.reminder_1day_sent_at) {
          console.log(`📧 Sending 1-day reminder for booking ${booking.id} (${hoursUntil.toFixed(1)} hours until)`);
          
          // Call the 1-day reminder function
          const reminderUrl = `${FUNCTION_BASE_URL}/functions/v1/send-reminder-1day`;
          const reminderResponse = await fetch(reminderUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
            },
            body: JSON.stringify({
              bookingId: booking.id,
              email: booking.email,
              name: booking.name,
              date: formattedDate,
              time: booking.booking_time,
              businessName: booking.business || undefined,
            }),
          });

          if (reminderResponse.ok) {
            // Mark reminder as sent in database
            const { error: updateError } = await supabase
              .from('leads')
              .update({ reminder_1day_sent_at: new Date().toISOString() })
              .eq('id', booking.id);
            
            if (updateError) {
              console.error(`⚠️ Failed to update reminder_1day_sent_at for booking ${booking.id}:`, updateError);
            }
            
            results.reminders1Day.push(booking.id);
            console.log(`✅ 1-day reminder sent for booking ${booking.id}`);
          } else {
            const errorData = await reminderResponse.json().catch(() => ({}));
            results.errors.push(`Failed to send 1-day reminder for ${booking.id}: ${JSON.stringify(errorData)}`);
            console.error(`❌ Failed to send 1-day reminder for ${booking.id}:`, errorData);
          }
        } else if (hoursUntil >= 23 && hoursUntil <= 25 && booking.reminder_1day_sent_at) {
          console.log(`⏭️ Skipping 1-day reminder for booking ${booking.id} - already sent at ${booking.reminder_1day_sent_at}`);
        }

        // Check if we need to send starting soon reminder (5-15 minutes before, or 0.08-0.25 hours)
        // Only send if we haven't already sent one
        if (hoursUntil >= 0.08 && hoursUntil <= 0.25 && !booking.reminder_starting_soon_sent_at) {
          console.log(`📧 Sending starting soon reminder for booking ${booking.id} (${hoursUntil.toFixed(2)} hours = ${(hoursUntil * 60).toFixed(0)} minutes until)`);
          
          // Call the starting soon reminder function
          const startingSoonUrl = `${FUNCTION_BASE_URL}/functions/v1/send-reminder-starting-soon`;
          const startingSoonResponse = await fetch(startingSoonUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
            },
            body: JSON.stringify({
              bookingId: booking.id,
              email: booking.email,
              name: booking.name,
              date: formattedDate,
              time: booking.booking_time,
            }),
          });

          if (startingSoonResponse.ok) {
            // Mark reminder as sent in database
            const { error: updateError } = await supabase
              .from('leads')
              .update({ reminder_starting_soon_sent_at: new Date().toISOString() })
              .eq('id', booking.id);
            
            if (updateError) {
              console.error(`⚠️ Failed to update reminder_starting_soon_sent_at for booking ${booking.id}:`, updateError);
            }
            
            results.remindersStartingSoon.push(booking.id);
            console.log(`✅ Starting soon reminder sent for booking ${booking.id}`);
          } else {
            const errorData = await startingSoonResponse.json().catch(() => ({}));
            results.errors.push(`Failed to send starting soon reminder for ${booking.id}: ${JSON.stringify(errorData)}`);
            console.error(`❌ Failed to send starting soon reminder for ${booking.id}:`, errorData);
          }
        } else if (hoursUntil >= 0.08 && hoursUntil <= 0.25 && booking.reminder_starting_soon_sent_at) {
          console.log(`⏭️ Skipping starting soon reminder for booking ${booking.id} - already sent at ${booking.reminder_starting_soon_sent_at}`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.errors.push(`Error processing booking ${booking.id}: ${errorMsg}`);
        console.error(`❌ Error processing booking ${booking.id}:`, error);
      }
    }

    const totalSent = results.reminders1Day.length + results.remindersStartingSoon.length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${bookings.length} bookings`,
        remindersSent: totalSent,
        reminders1Day: results.reminders1Day.length,
        remindersStartingSoon: results.remindersStartingSoon.length,
        errors: results.errors.length,
        details: results,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error in check-and-send-reminders function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to check and send reminders',
        details: error instanceof Error ? error.stack : error.toString()
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

