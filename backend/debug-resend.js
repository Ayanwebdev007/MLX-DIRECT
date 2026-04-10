require('dotenv').config();
const { Resend } = require('resend');

async function test() {
  console.log('API KEY:', process.env.RESEND_API_KEY ? 'FOUND' : 'MISSING');
  console.log('SENDER:', process.env.ADMIN_EMAIL_SENDER);
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
      from: `MLX DIRECT <${process.env.ADMIN_EMAIL_SENDER}>`,
      to: ['kundurik987@gmail.com'], // Test with your original email or a valid one
      subject: 'System Debug Test',
      html: '<p>Testing connection to Resend infrastructure.</p>'
    });
    console.log('SUCCESS:', data);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

test();
