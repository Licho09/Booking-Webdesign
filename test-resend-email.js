// Test script to verify Resend email sending
// Run with: node test-resend-email.js

// IMPORTANT: Replace 're_xxxxxxxxx' with your actual Resend API key
const RESEND_API_KEY = 're_xxxxxxxxx'; // Replace with your actual API key

// Your verified email domain
const FROM_EMAIL = 'info@designcxlabs.com';
const TO_EMAIL = 'luischirinos1000@gmail.com'; // Your email to receive the test

async function testEmail() {
  console.log('🧪 Testing Resend email sending...\n');
  console.log('From:', FROM_EMAIL);
  console.log('To:', TO_EMAIL);
  console.log('API Key:', RESEND_API_KEY.substring(0, 10) + '...\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject: 'Test Email from DesignCXLabs',
        html: `
          <h1>Hello from designcxlabs.com!</h1>
          <p>This is a test email to verify that Resend is working correctly.</p>
          <p>If you received this, your email setup is working! 🎉</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sent from: ${FROM_EMAIL}</p>
        `,
        text: 'Hello from designcxlabs.com! This is a test email to verify that Resend is working correctly. If you received this, your email setup is working!',
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error sending email:');
      console.error('Status:', response.status);
      console.error('Error:', JSON.stringify(errorData, null, 2));
      
      if (response.status === 403) {
        console.error('\n⚠️  Domain Verification Issue:');
        console.error('Make sure you have verified your domain (designcxlabs.com) in Resend.');
        console.error('Go to: https://resend.com/domains');
      }
      
      return;
    }

    const data = await response.json();
    console.log('\n✅ Email sent successfully!');
    console.log('Email ID:', data.id);
    console.log('\n📧 Check your inbox at:', TO_EMAIL);
    console.log('   (Also check spam folder if you don\'t see it)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Check if API key is set
if (RESEND_API_KEY === 're_xxxxxxxxx') {
  console.error('❌ Please update RESEND_API_KEY in this file with your actual Resend API key!');
  console.error('   Get your API key from: https://resend.com/api-keys');
  process.exit(1);
}

testEmail();












