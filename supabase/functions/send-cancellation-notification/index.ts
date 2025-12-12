import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'info@designcxlabs.com';
const REPLY_TO_EMAIL = Deno.env.get('REPLY_TO_EMAIL') || 'info@designcxlabs.com';
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') || 'luischirinos1000@gmail.com';

interface CancellationRequest {
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
      console.warn('RESEND_API_KEY is missing - cancellation notification skipped');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Cancellation notification skipped (not configured)',
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

    const { email, name, date, time, businessName }: CancellationRequest = await req.json();

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

    const fromEmail = FROM_EMAIL.includes('<') 
      ? FROM_EMAIL 
      : `DesignCXLabs <${FROM_EMAIL}>`;

    // Email to client
    const clientEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancelled</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Booking Cancelled</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 18px; margin-top: 0;">Hi ${name}!</p>
    
    <p>Your booking has been successfully cancelled.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <h2 style="margin-top: 0; color: #ef4444; font-size: 20px;">📅 Cancelled Appointment</h2>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${date}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${time}</p>
      ${businessName ? `<p style="margin: 10px 0;"><strong>Business:</strong> ${businessName}</p>` : ''}
    </div>
    
    <p>If you'd like to book a new appointment, please visit our website or reply to this email.</p>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
      Best regards,<br>
      <strong>DesignCXLabs</strong><br>
      <a href="mailto:${REPLY_TO_EMAIL}" style="color: #667eea; text-decoration: none;">${REPLY_TO_EMAIL}</a>
    </p>
  </div>
</body>
</html>
    `;

    const clientEmailText = `
Hi ${name}!

Your booking has been successfully cancelled.

📅 Cancelled Appointment
Date: ${date}
Time: ${time}
${businessName ? `Business: ${businessName}` : ''}

If you'd like to book a new appointment, please visit our website or reply to this email.

Best regards,
DesignCXLabs
    `;

    // Email to owner
    const ownerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancelled - Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ Booking Cancelled</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 18px; margin-top: 0;">A booking has been cancelled.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <h2 style="margin-top: 0; color: #ef4444; font-size: 20px;">📋 Client Details</h2>
      <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
      <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
      ${businessName ? `<p style="margin: 10px 0;"><strong>Business:</strong> ${businessName}</p>` : ''}
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <h2 style="margin-top: 0; color: #ef4444; font-size: 20px;">📅 Cancelled Appointment</h2>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${date}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${time}</p>
    </div>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
      This is an automated notification from your booking system.
    </p>
  </div>
</body>
</html>
    `;

    const ownerEmailText = `
⚠️ Booking Cancelled

A booking has been cancelled.

📋 Client Details
Name: ${name}
Email: ${email}
${businessName ? `Business: ${businessName}` : ''}

📅 Cancelled Appointment
Date: ${date}
Time: ${time}

This is an automated notification from your booking system.
    `;

    const resendUrl = 'https://api.resend.com/emails';
    
    // Send email to client
    const clientResponse = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        reply_to: REPLY_TO_EMAIL,
        subject: `Booking Cancelled: ${date} at ${time}`,
        html: clientEmailHtml,
        text: clientEmailText,
      }),
    });

    // Send email to owner
    const ownerResponse = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: OWNER_EMAIL,
        reply_to: email,
        subject: `⚠️ Booking Cancelled: ${name} - ${date} at ${time}`,
        html: ownerEmailHtml,
        text: ownerEmailText,
      }),
    });

    if (!clientResponse.ok || !ownerResponse.ok) {
      const clientError = await clientResponse.json().catch(() => ({}));
      const ownerError = await ownerResponse.json().catch(() => ({}));
      console.error('Error sending cancellation emails:', { clientError, ownerError });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cancellation notifications sent successfully' 
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
    console.error('Error in send-cancellation-notification function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to send notifications',
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

