import nodemailer from 'nodemailer';

let transporter = null;

// Initialize or get transporter
const getTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
    console.log(`[EmailService] Configured SMTP transporter with user: ${user}`);
  } else {
    // If no credentials provided, create testing transporter
    console.log('[EmailService] No SMTP credentials provided in .env. Creating test email transporter.');
    const testAccount = await nodemailer.createTestAccount().catch(() => null);
    if (testAccount) {
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }
  }

  return transporter;
};

/**
 * Send 6-Digit Password Reset OTP Email
 */
export const sendPasswordResetEmail = async (toEmail, otpCode, userName = 'Friend') => {
  const mailTransporter = await getTransporter();
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@majlis-alaman.com';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #060911; color: #f1f5f9; padding: 40px 20px; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background: #0b1120; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 24px; padding: 32px 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
        
        <!-- Header Logo -->
        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; width: 56px; height: 56px; background: linear-gradient(135deg, #059669, #10b981); border-radius: 18px; line-height: 56px; text-align: center;">
            <span style="font-size: 28px; color: #ffffff; font-weight: bold;">م</span>
          </div>
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 12px 0 4px 0; letter-spacing: -0.5px;">Majlis Al-Aman</h1>
          <p style="color: #10b981; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-weight: bold;">مَجْلِسُ الأَمَان — Islamic Habit Sanctuary</p>
        </div>

        <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 20px 0;"></div>

        <!-- Bismillah -->
        <p style="color: #fbbf24; font-size: 18px; margin: 0 0 16px 0; font-family: serif;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>

        <h2 style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">Password Reset Verification Code</h2>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0 0 24px 0;">
          Assalamu Alaikum ${userName},<br />
          We received a request to reset your password. Use the 6-digit verification code below to set a new password.
        </p>

        <!-- OTP Code Box -->
        <div style="background: rgba(16, 185, 129, 0.1); border: 2px dashed #10b981; border-radius: 16px; padding: 18px; margin: 0 auto 24px auto; max-width: 280px;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #34d399; font-family: monospace;">${otpCode}</span>
        </div>

        <p style="color: #f59e0b; font-size: 12px; font-weight: 600; margin: 0 0 20px 0;">
          ⏳ This code is valid for 10 minutes.
        </p>

        <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.4;">
          If you did not request this password reset, please ignore this email. Your account remains secure.
        </p>

        <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 24px 0;"></div>

        <p style="color: #475569; font-size: 10px; margin: 0;">
          © ${new Date().getFullYear()} Majlis Al-Aman. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const info = await mailTransporter.sendMail({
    from: `"Majlis Al-Aman" <${fromAddress}>`,
    to: toEmail,
    subject: `🔑 ${otpCode} is your Majlis Al-Aman Password Reset Code`,
    text: `Your Majlis Al-Aman verification code is: ${otpCode}. It is valid for 10 minutes.`,
    html: htmlContent
  });

  console.log(`[EmailService] OTP sent to ${toEmail}. Message ID: ${info.messageId || 'sent'}`);
  return info;
};
