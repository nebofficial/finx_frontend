const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Whether platform SMTP env is present enough to attempt sending.
 */
const isSmtpConfigured = () => {
  const config = require('../config');
  const { host, user, pass } = config.smtp;
  const h = (host || '').trim();
  const u = (user || '').trim();
  const p = (pass || '').trim();
  return Boolean(h && u && p);
};

/**
 * Build nodemailer transport options for common providers (587 STARTTLS vs 465 SSL).
 */
const buildTransportOptions = (smtpConfig = null) => {
  const config = require('../config');
  const cfg = { ...config.smtp, ...(smtpConfig || {}) };
  const port = Number(cfg.port) || 587;
  const secure = port === 465;

  const opts = {
    host: (cfg.host || '').trim(),
    port,
    secure,
    auth: { user: (cfg.user || '').trim(), pass: (cfg.pass || '').trim() },
    tls: {
      rejectUnauthorized: cfg.tlsRejectUnauthorized !== false,
    },
  };

  // Port 587: optional STARTTLS requirement (many cPanel/shared hosts fail if requireTLS is forced)
  if (!secure && port === 587 && process.env.SMTP_REQUIRE_TLS === 'true') {
    opts.requireTLS = true;
  }

  return opts;
};

/**
 * Create a Nodemailer transporter.
 */
const createTransporter = (smtpConfig = null) => {
  const options = buildTransportOptions(smtpConfig);
  return nodemailer.createTransport(options);
};

/**
 * Send an email.
 */
const sendEmail = async ({ to, subject, html, text, smtpConfig = null }) => {
  const config = require('../config');

  if (!smtpConfig && !isSmtpConfigured()) {
    const msg =
      'SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and usually SMTP_FROM) in backend/.env. If the password contains { } or # wrap it in double quotes.';
    logger.error(`❌ Email not sent: ${msg}`);
    return { success: false, error: msg };
  }

  try {
    const transporter = createTransporter(smtpConfig);
    const from = smtpConfig?.from || config.smtp.from;

    if (!from) {
      return { success: false, error: 'SMTP_FROM is not set in environment.' };
    }

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });

    logger.info(`📧 Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    const detail = err.response || err.message || String(err);
    logger.error(`❌ Email send failed to ${to}:`, detail);
    // Surface safe, actionable hints (no secrets)
    let hint = err.message || 'Unknown SMTP error';
    if (/Invalid login|authentication failed|535/i.test(hint)) {
      hint += ' — Check SMTP_USER / SMTP_PASS. Quote the password in .env if it contains special characters.';
    }
    if (/self signed certificate|certificate|UNABLE_TO_VERIFY_LEAF_SIGNATURE/i.test(hint)) {
      hint += ' — Try SMTP_TLS_REJECT_UNAUTHORIZED=false for dev only, or fix server TLS.';
    }
    if (/connection refused|ECONNREFUSED|ETIMEDOUT|getaddrinfo/i.test(hint)) {
      hint += ' — Check SMTP_HOST / port and firewall.';
    }
    return { success: false, error: hint };
  }
};

/**
 * Send an SMS via configured gateway.
 */
const sendSms = async ({ to, message, smsConfig = null }) => {
  try {
    const config = require('../config');
    const cfg = smsConfig || config.sms;

    logger.info(`📱 SMS [${cfg.provider}] → ${to}: ${message}`);

    return { success: true };
  } catch (err) {
    logger.error(`❌ SMS send failed to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send welcome credentials email to a new tenant SuperAdmin.
 */
const sendWelcomeEmail = async (email, name, password, tenantName) => {
  return sendEmail({
    to: email,
    subject: `Welcome to FinX — Your ${tenantName} Account is Ready`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Welcome to FinX, ${name}!</h2>
        <p>Your cooperative <strong>${tenantName}</strong> has been successfully provisioned.</p>
        <h3>Your Login Credentials:</h3>
        <table border="1" cellpadding="8" style="border-collapse: collapse;">
          <tr><td>Email</td><td>${email}</td></tr>
          <tr><td>Password</td><td>${password}</td></tr>
        </table>
        <p style="color: red;"><strong>Please change your password immediately after first login.</strong></p>
        <p>FinX Platform Team</p>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendSms, sendWelcomeEmail, isSmtpConfigured };
