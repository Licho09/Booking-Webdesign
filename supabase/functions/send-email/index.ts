import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'info@designcxlabs.com';
const REPLY_TO_EMAIL = Deno.env.get('REPLY_TO_EMAIL') || 'info@designcxlabs.com';
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') || 'luischirinos1000@gmail.com';
const SITE_URL = Deno.env.get('SITE_URL') || 'https://www.designcxlabs.com';

interface EmailRequest {
  email: string;
  name: string;
  date: string;
  time: string;
  businessName?: string;
  bookingId?: string;
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
    const requestBody = await req.json();
    console.log('📥 Raw request body:', JSON.stringify(requestBody, null, 2));
    const { email, name, date, time, businessName, bookingId }: EmailRequest = requestBody;
    console.log('Request data received:', { email, name, date, time, businessName, bookingId });
    console.log('📋 Booking ID in email function:', bookingId);
    console.log('📋 Booking ID type:', typeof bookingId);
    console.log('📋 Booking ID truthy?', !!bookingId);
    console.log('📋 SITE_URL:', SITE_URL);

    // Ensure SITE_URL doesn't have trailing slash and construct hash URLs
    const baseUrl = SITE_URL.replace(/\/$/, '');
    const rescheduleUrl = `${baseUrl}/#/reschedule?id=${bookingId}`;
    const cancelUrl = `${baseUrl}/#/cancel?id=${bookingId}`;
    console.log('📋 Reschedule URL:', rescheduleUrl);
    console.log('📋 Cancel URL:', cancelUrl);

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
    
    ${bookingId ? `
    <div style="margin: 30px 0; text-align: center;">
      <p style="margin-bottom: 15px; color: #666; font-size: 14px;">Need to make changes?</p>
      <div style="display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
        <a href="${rescheduleUrl}" 
           style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          🔄 Reschedule
        </a>
        <a href="${cancelUrl}" 
           style="display: inline-block; padding: 12px 24px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ❌ Cancel
        </a>
      </div>
      <p style="margin-top: 10px; color: #999; font-size: 12px;">Booking ID: ${bookingId}</p>
    </div>
    ` : '<p style="color: #999; font-size: 12px; text-align: center; margin: 20px 0;">⚠️ No booking ID provided</p>'}
    
    <p style="margin-top: 30px;">Looking forward to speaking with you!</p>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
      Best regards,<br>
      <strong>DesignCXLabs</strong><br>
      <a href="mailto:${REPLY_TO_EMAIL}" style="color: #667eea; text-decoration: none;">${REPLY_TO_EMAIL}</a>
    </p>
    <p style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0; color: #999; font-size: 12px; text-align: center;">
      This is an automated confirmation email. If you need to reschedule, please reply to this email.
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
    
    // Use proper "From" format with name to improve deliverability
    // Format: "Display Name <email@domain.com>"
    const fromEmail = FROM_EMAIL.includes('<') 
      ? FROM_EMAIL 
      : `DesignCXLabs <${FROM_EMAIL}>`;
    
    const emailPayload = {
      from: fromEmail,
      to: email,
      reply_to: REPLY_TO_EMAIL,
      subject: `Booking Confirmed: ${date} at ${time}`,
      html: emailHtml,
      text: emailText,
      // Add headers to improve deliverability and prevent spam
      headers: {
        'X-Entity-Ref-ID': `booking-${Date.now()}`,
        'List-Unsubscribe': `<mailto:${REPLY_TO_EMAIL}?subject=Unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Precedence': 'bulk',
        'X-Auto-Response-Suppress': 'All',
      },
      // Add tags for better tracking and deliverability
      tags: [
        { name: 'category', value: 'booking-confirmation' },
        { name: 'type', value: 'transactional' },
      ],
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
      
      // Check for Resend domain verification error
      if (response.status === 403 && errorData.message && errorData.message.includes('verify a domain')) {
        console.error('⚠️ Resend Domain Verification Required:');
        console.error('You can only send testing emails to your own verified email address.');
        console.error('To send emails to other recipients, verify a domain at https://resend.com/domains');
        console.error('Then update the FROM_EMAIL secret in Supabase to use your verified domain.');
      }
      
      throw new Error(`Failed to send email: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // Also send notification to owner (don't fail if this fails)
    try {
      const ownerNotificationHtml = `
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
      <p style="margin: 10px 0;"><strong>Business:</strong> ${businessName || 'Not provided'}</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <h2 style="margin-top: 0; color: #10b981; font-size: 20px;">📅 Appointment Details</h2>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${date}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${time}</p>
    </div>
    
    <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
      <p style="margin: 0; color: #0c4a6e;"><strong>💡 Quick Action:</strong></p>
      <p style="margin: 10px 0 0 0;">
        <a href="mailto:${email}?subject=Re: Booking Confirmation for ${date}" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">📧 Reply to ${name}</a>
      </p>
    </div>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
      This is an automated notification from your booking form.
    </p>
  </div>
</body>
</html>
      `;

      const ownerNotificationText = `
🎉 New Booking!

You have a new booking request!

📋 Lead Details
Name: ${name}
Email: ${email}
Business: ${businessName || 'Not provided'}

📅 Appointment Details
Date: ${date}
Time: ${time}

💡 Quick Action:
- Reply to ${name}: mailto:${email}?subject=Re: Booking Confirmation for ${date}

This is an automated notification from your booking form.
      `;

      const ownerEmailPayload = {
        from: fromEmail,
        to: OWNER_EMAIL,
        reply_to: email,
        subject: `🎉 New Booking: ${name} - ${date} at ${time}`,
        html: ownerNotificationHtml,
        text: ownerNotificationText,
        headers: {
          'X-Entity-Ref-ID': `booking-notification-${Date.now()}`,
        },
        tags: [
          { name: 'category', value: 'owner-notification' },
          { name: 'type', value: 'notification' },
        ],
      };

      const ownerResponse = await fetch(resendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerEmailPayload),
      });

      if (ownerResponse.ok) {
        console.log('✅ Owner notification sent successfully');
      } else {
        console.warn('⚠️ Owner notification failed (non-critical)');
      }
    } catch (ownerError) {
      console.warn('⚠️ Owner notification error (non-critical):', ownerError);
      // Don't fail the main email if owner notification fails
    }

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
