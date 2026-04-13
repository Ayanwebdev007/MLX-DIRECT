const axios = require('axios');

/**
 * MSG91 SMS Service Layer
 * Template approved: "Message, {#var#} is {#var#} on Rs {#var#} GS3 SOLUTION"
 * DLT IDs provided: 1207166115689631150 and 1307167670207221187
 */

const MSG91_URL = 'http://api.msg91.com/api/sendhttp.php';
const AUTH_KEY = process.env.MSG91_AUTH_KEY || '290953A5hyqLE9RlyU5d60e78a';
const SENDER_ID = process.env.MSG91_SENDER_ID || 'MEECSL';
const ROUTE = '4';

exports.sendSMS = async (to, variables, templateId) => {
  try {
    if (!to) {
      console.log('[SMS SKIP] No phone number provided for user');
      return false;
    }

    // Ensure phone number starts with country code for MSG91 (91 for India)
    let phoneNumber = to.toString().trim();
    if (phoneNumber.length === 10) {
      phoneNumber = '91' + phoneNumber;
    }

    // Ensure variables stay within the 30-character limit provided in the template
    const v1 = (variables.v1 || '').toString().substring(0, 30);
    const v2 = (variables.v2 || '').toString().substring(0, 30);
    const v3 = (variables.v3 || '').toString().substring(0, 30);
    const v4 = (variables.v4 || '').toString().substring(0, 30);
    const v5 = (variables.v5 || '').toString().substring(0, 30);

    // Format the template variables into the message string
    // Template: "Message, {#var#} is {#var#} on {#var#} {#var#} Rs{#var#} GS3 SOLUTION"
    const message = `Message, ${v1} is ${v2} on ${v3} ${v4} Rs${v5} GS3 SOLUTION`;
    
    const params = new URLSearchParams({
      authkey: AUTH_KEY,
      mobiles: phoneNumber,
      message: message,
      sender: SENDER_ID,
      route: ROUTE,
      DLT_TE_ID: templateId || '1207166115689631150'
    });

    console.log(`[SMS SENDING] To: ${phoneNumber} | Message: ${message}`);
    
    const response = await axios.get(`${MSG91_URL}?${params.toString()}`);
    
    console.log('[SMS RESPONSE]', response.data);
    return true;
  } catch (error) {
    console.error('[SMS ERROR]', error.message);
    return false;
  }
};
