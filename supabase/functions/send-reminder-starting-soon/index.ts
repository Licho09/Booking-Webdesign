import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'info@designcxlabs.com';
const REPLY_TO_EMAIL = Deno.env.get('REPLY_TO_EMAIL') || 'info@designcxlabs.com';
const SITE_URL = Deno.env.get('SITE_URL') || 'https://www.designcxlabs.com';
const MEETING_LINK = Deno.env.get('MEETING_LINK') || '';

interface StartingSoonRequest {
  bookingId: string;
  email: string;
  name: string;
  date: string;
  time: string;
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
    const { bookingId, email, name, date, time }: StartingSoonRequest = requestBody;

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

    const fromEmail = FROM_EMAIL.includes('<') 
      ? FROM_EMAIL 
      : `DesignCXLabs <${FROM_EMAIL}>`;

    // Final Reminder Email (Starting Soon - 5-15 minutes before)
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Starting shortly</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Starting shortly</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 18px; margin-top: 0; font-weight: 500;">We're starting in a few minutes.</p>
    
    ${MEETING_LINK ? `
    <div style="margin: 30px 0; text-align: center;">
      <a href="${MEETING_LINK}" 
         style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        Join here
      </a>
    </div>
    ` : '<p style="text-align: center; color: #666; font-size: 16px; margin: 30px 0;">See you at ${time}!</p>'}
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
      Best regards,<br>
      <strong>DesignCXLabs</strong>
    </p>
  </div>
</body>
</html>
    `;

    const emailText = `
Starting shortly

We're starting in a few minutes.

${MEETING_LINK ? `Join here: ${MEETING_LINK}` : `See you at ${time}!`}

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
        subject: `Starting shortly`,
        html: emailHtml,
        text: emailText,
        tags: [
          { name: 'category', value: 'reminder-starting-soon' },
          { name: 'type', value: 'transactional' },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error sending starting soon reminder:', errorData);
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
    console.log('✅ Starting soon reminder sent successfully');

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
    console.error('Error in send-reminder-starting-soon function:', error);
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

