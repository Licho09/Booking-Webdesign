import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@yourdomain.com';
const REPLY_TO_EMAIL = Deno.env.get('REPLY_TO_EMAIL') || 'hello@yourdomain.com';

interface EmailRequest {
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
    // Verify environment variables
    console.log('Checking environment variables...');
    console.log('RESEND_API_KEY exists:', !!RESEND_API_KEY);
    console.log('FROM_EMAIL:', FROM_EMAIL);
    console.log('REPLY_TO_EMAIL:', REPLY_TO_EMAIL);
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing!');
      throw new Error('Resend API key not configured');
    }

    // Supabase platform already validated the JWT token
    // If we reach here, the request is authenticated
    // No need to check auth - just process the request

    console.log('Parsing request body...');
    const { email, name, date, time, businessName }: EmailRequest = await req.json();
    console.log('Request data received:', { email, name, date, time, businessName });

    if (!email || !name || !date || !time) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, name, date, time' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Create email HTML content
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 18px; margin-top: 0;">Hi ${name}!</p>
    
    <p>Your website consultation has been confirmed. We're excited to help bring your vision to life!</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h2 style="margin-top: 0; color: #667eea; font-size: 20px;">📅 Appointment Details</h2>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${date}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${time}</p>
      ${businessName ? `<p style="margin: 10px 0;"><strong>Business:</strong> ${businessName}</p>` : ''}
    </div>
    
    <p>We'll send you a reminder the day before your appointment. If you need to reschedule or have any questions, just reply to this email.</p>
    
    <p style="margin-top: 30px;">Looking forward to speaking with you!</p>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
      Best regards,<br>
      <strong>Your Web Design Team</strong>
    </p>
  </div>
</body>
</html>
    `;

    // Plain text version
    const emailText = `
Hi ${name}!

Your website consultation has been confirmed. We're excited to help bring your vision to life!

📅 Appointment Details
Date: ${date}
Time: ${time}
${businessName ? `Business: ${businessName}` : ''}

We'll send you a reminder the day before your appointment. If you need to reschedule or have any questions, just reply to this email.

Looking forward to speaking with you!

Best regards,
Your Web Design Team
    `;

    // Send email via Resend
    console.log('Sending email via Resend...');
    const resendUrl = 'https://api.resend.com/emails';
    
    const emailPayload = {
      from: FROM_EMAIL,
      to: email,
      reply_to: REPLY_TO_EMAIL,
      subject: `Booking Confirmed: ${date} at ${time}`,
      html: emailHtml,
      text: emailText,
    };
    
    console.log('Email payload:', { ...emailPayload, html: '[HTML content]', text: '[Text content]' });
    
    const response = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    console.log('Resend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send email: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: data.id,
        message: 'Email sent successfully' 
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
    console.error('Error in send-email function:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to send email',
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

