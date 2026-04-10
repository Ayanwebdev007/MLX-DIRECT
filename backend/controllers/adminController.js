const { Resend } = require('resend');
const SentEmail = require('../models/SentEmail');

/**
 * Handle sending administrative email and saving to history
 */
exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to || !subject || !message) {
      return res.status(400).json({ message: 'Missing required fields: to, subject, or message' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (req.file) {
      console.log(`[DEBUG] Attachment size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);
    }

    const emailOptions = {
      from: `MLX DIRECT <${process.env.ADMIN_EMAIL_SENDER || 'info@mlxdirect.com'}>`,
      to: [to],
      replyTo: 'info@mlxdirect.com',
      subject: subject,
      text: `${subject}\n\n${message}\n\nRegards,\nMLX DIRECT Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 10px auto; padding: 30px; border: 1px solid #eeeeee; border-radius: 12px; background-color: #ffffff; color: #333333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://mlxdirect.com/logo.png" alt="MLX DIRECT" style="height: 60px; width: auto; display: block; margin: 0 auto;">
          </div>
          <div style="line-height: 1.6; font-size: 16px; margin-bottom: 40px;">
            <div style="font-size: 20px; font-weight: bold; color: #003B91; margin-bottom: 20px; border-bottom: 2px solid #003B91; padding-bottom: 10px; display: inline-block;">
              Official Communication
            </div>
            <div style="color: #444444; margin-top: 10px;">
              ${message.replace(/\n/g, '<br/>')}
            </div>
          </div>
          <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #eeeeee; font-size: 11px; color: #888888; text-align: center; line-height: 1.6;">
            <p style="font-weight: bold; color: #555555; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">MLX DIRECT OPERATIONS</p>
            <p style="margin: 0;">Industrial Estate, Phase II, New Delhi, India</p>
            <p style="margin: 5px 0;">This email was sent from a verified domain. To ensure future delivery, please add us to your contacts.</p>
            <p style="margin-top: 15px;"><a href="https://mlxdirect.com" style="color: #003B91; text-decoration: none; font-weight: bold;">Visit our Official Portal</a></p>
          </div>
        </div>
      `
    };

    if (req.file) {
      emailOptions.attachments = [
        {
          filename: req.file.originalname,
          content: req.file.buffer.toString('base64'),
        }
      ];
    }

    const data = await resend.emails.send(emailOptions);

    if (data.error) {
      console.error('[RESEND ERROR]', data.error);
      return res.status(500).json({ message: 'Resend API error', error: data.error });
    }

    // Save to history reliably
    try {
      const historyEntry = await SentEmail.create({
        to: to.toLowerCase(),
        from: process.env.ADMIN_EMAIL_SENDER || 'info@mlxdirect.com',
        subject,
        message,
        direction: 'sent',
        attachmentName: req.file ? req.file.originalname : null
      });
      console.log(`[HISTORY] Saved outbound message to ${to} | ID: ${historyEntry._id}`);
    } catch (dbError) {
      console.error('[DATABASE ERROR] Failed to save sent email history:', dbError);
    }

    res.json({ message: 'Email sent successfully', id: data.data?.id });
  } catch (error) {
    console.error('[SEND EMAIL ERROR]', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};

exports.handleInboundWebhook = async (req, res) => {
  try {
    const payload = req.body;
    console.log('[WEBHOOK] Received event type:', payload.type);
    
    // ONLY process actual incoming emails
    if (payload.type !== 'email.received') {
      return res.status(200).json({ message: `Ignored event: ${payload.type}` });
    }

    // Resend Inbound Webhook structure (metadata only)
    const { email_id, from, to, subject } = payload.data;
    
    if (!email_id) {
      return res.status(200).json({ message: 'Ignore: No email_id found' });
    }

    // Fetch the full email content using the ID
    console.log(`[INBOUND] Fetching content for email_id: ${email_id}`);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fullEmail = await resend.emails.get(email_id);
    
    if (!fullEmail || fullEmail.error) {
      console.error('[INBOUND ERROR] Failed to fetch email content:', fullEmail.error);
      return res.status(200).json({ message: 'Fetch failed' });
    }

    const { text, html } = fullEmail.data || fullEmail; // Resend SDK returns data nested in some versions

    // Helper to extract email and name from "Name <email@address.com>"
    const parseAddress = (addr) => {
      if (typeof addr === 'object' && addr.email) return { email: addr.email, name: addr.name };
      const match = String(addr).match(/(.*)<(.+@.+)>/);
      if (match) return { name: match[1].trim(), email: match[2].trim() };
      return { name: null, email: String(addr).trim() };
    };

    const fromParsed = parseAddress(from);
    const toRaw = Array.isArray(to) ? to[0] : to;
    const toParsed = parseAddress(toRaw);

    const newInbound = await SentEmail.create({
      from: fromParsed.email,
      senderName: fromParsed.name,
      to: toParsed.email,
      subject: subject || fullEmail.subject || '(No Subject)',
      message: text || '(No Text Content)',
      html: html || null,
      direction: 'received'
    });

    console.log(`[INBOUND SUCCESS] Content retrieved and saved | ID: ${newInbound._id}`);
    res.status(200).json({ success: true, id: newInbound._id });
  } catch (error) {
    console.error('[WEBHOOK CRITICAL ERROR]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Fetch sent email history
 */
exports.getSentEmails = async (req, res) => {
  try {
    const sent = await SentEmail.find().sort({ createdAt: -1 });
    res.status(200).json(sent);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

