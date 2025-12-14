import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'info@designcxlabs.com';
const REPLY_TO_EMAIL = Deno.env.get('REPLY_TO_EMAIL') || 'info@designcxlabs.com';
const SITE_URL = Deno.env.get('SITE_URL') || 'https://www.designcxlabs.com';
const MEETING_LINK = Deno.env.get('MEETING_LINK') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface ReminderRequest {
  bookingId: string;
  email: string;
  name: string;
  date: string;
  time: string;
  businessName?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is missing - reminder skipped');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Reminder skipped (not configured)',
          skipped: true
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

    const requestBody = await req.json();
    const { bookingId, email, name, date, time, businessName }: ReminderRequest = requestBody;

    if (!email || !name || !date || !time || !bookingId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: bookingId, email, name, date, time' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const baseUrl = SITE_URL.replace(/\/$/, '');
    const rescheduleUrl = `${baseUrl}/#/reschedule?id=${bookingId}`;

    const fromEmail = FROM_EMAIL.includes('<') 
      ? FROM_EMAIL 
      : `DesignCXLabs <${FROM_EMAIL}>`;

    // Main Reminder Email (1 Day Before)
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reminder — call tomorrow</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Reminder — call tomorrow</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 18px; margin-top: 0;">Just a quick reminder about our call tomorrow at <strong>${time}</strong>.</p>
    
    <p style="font-size: 16px; margin: 20px 0;">We'll walk through how your website can bring in more qualified leads and where AI can save you time.</p>
    
    ${MEETING_LINK ? `
    <div style="margin: 30px 0; text-align: center;">
      <a href="${MEETING_LINK}" 
         style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        Join here: ${MEETING_LINK.includes('zoom') ? 'Zoom Meeting' : MEETING_LINK.includes('meet.google') ? 'Google Meet' : 'Join Call'}
      </a>
    </div>
    ` : ''}
    
    <div style="margin: 30px 0; text-align: center;">
      <p style="margin-bottom: 10px; color: #666; font-size: 14px;">Need to reschedule?</p>
      <a href="${rescheduleUrl}" 
         style="display: inline-block; padding: 10px 20px; color: #667eea; text-decoration: underline; font-size: 14px;">
        You can do that here
      </a>
    </div>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
      Best regards,<br>
      <strong>DesignCXLabs</strong><br>
      <a href="mailto:${REPLY_TO_EMAIL}" style="color: #667eea; text-decoration: none;">${REPLY_TO_EMAIL}</a>
    </p>
  </div>
</body>
</html>
    `;

    const emailText = `
Reminder — call tomorrow

Just a quick reminder about our call tomorrow at ${time}.

We'll walk through how your website can bring in more qualified leads and where AI can save you time.

${MEETING_LINK ? `Join link: ${MEETING_LINK}` : ''}

Need to reschedule? You can do that here: ${rescheduleUrl}

Best regards,
DesignCXLabs
    `;

    const resendUrl = 'https://api.resend.com/emails';
    
    const response = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        reply_to: REPLY_TO_EMAIL,
        subject: `Reminder — call tomorrow`,
        html: emailHtml,
        text: emailText,
        tags: [
          { name: 'category', value: 'reminder-1day' },
          { name: 'type', value: 'transactional' },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error sending reminder:', errorData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send reminder',
          details: errorData
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

    const data = await response.json();
    console.log('✅ 1-day reminder sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reminder sent successfully',
        emailId: data.id
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
    console.error('Error in send-reminder-1day function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to send reminder',
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

