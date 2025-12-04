``import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'info@designcxlabs.com';
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') || 'luischirinos1000@gmail.com';

interface NotificationRequest {
  name: string;
  email: string;
  phone?: string;
  businessName: string;
  date: string;
  time: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Verify environment variables
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is missing - owner notification skipped');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Owner notification skipped (not configured)',
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

    const { name, email, phone, businessName, date, time }: NotificationRequest = await req.json();

    if (!name || !email || !date || !time) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, date, time' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Create notification email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 New Booking!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 18px; margin-top: 0;">You have a new booking request!</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h2 style="margin-top: 0; color: #667eea; font-size: 20px;">📋 Lead Details</h2>
      <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
      <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
      ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a></p>` : ''}
      <p style="margin: 10px 0;"><strong>Business:</strong> ${businessName}</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <h2 style="margin-top: 0; color: #10b981; font-size: 20px;">📅 Appointment Details</h2>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${date}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${time}</p>
    </div>
    
    <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
      <p style="margin: 0; color: #0c4a6e;"><strong>💡 Quick Actions:</strong></p>
      <p style="margin: 10px 0 0 0;">
        <a href="mailto:${email}?subject=Re: Booking Confirmation for ${date}" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">📧 Reply to ${name}</a>
      </p>
      ${phone ? `<p style="margin: 10px 0 0 0;"><a href="tel:${phone}" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">📞 Call ${name}</a></p>` : ''}
    </div>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
      This is an automated notification from your booking form.
    </p>
  </div>
</body>
</html>
    `;

    // Plain text version
    const emailText = `
🎉 New Booking!

You have a new booking request!

📋 Lead Details
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Business: ${businessName}

📅 Appointment Details
Date: ${date}
Time: ${time}

💡 Quick Actions:
- Reply to ${name}: mailto:${email}?subject=Re: Booking Confirmation for ${date}
${phone ? `- Call ${name}: tel:${phone}` : ''}

This is an automated notification from your booking form.
    `;

    // Send email via Resend
    const resendUrl = 'https://api.resend.com/emails';
    
    const fromEmail = FROM_EMAIL.includes('<') 
      ? FROM_EMAIL 
      : `DesignCXLabs <${FROM_EMAIL}>`;
    
    const emailPayload = {
      from: fromEmail,
      to: OWNER_EMAIL,
      reply_to: email, // Reply goes to the person who booked
      subject: `🎉 New Booking: ${name} - ${date} at ${time}`,
      html: emailHtml,
      text: emailText,
      headers: {
        'X-Entity-Ref-ID': `booking-notification-${Date.now()}`,
      },
      tags: [
        { name: 'category', value: 'owner-notification' },
        { name: 'type', value: 'notification' },
      ],
    };
    
    const response = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send notification email: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: data.id,
        message: 'Owner notification sent successfully' 
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
    console.error('Error in send-owner-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to send notification',
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
