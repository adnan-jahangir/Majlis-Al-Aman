import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Gmail direct configuration support
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  return null;
};

export const sendReminderEmail = async ({ user, pendingPrayers = [], quranPagesToday = 0, streak = 0 }) => {
  try {
    if (!user || !user.email) return { success: false, reason: 'No user email' };

    const transporter = createTransporter();
    const appUrl = process.env.CLIENT_URL || 'https://majlis-al-aman.vercel.app';
    const senderEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.GMAIL_USER || 'notifications@majlis.app';

    const pendingText = pendingPrayers.length > 0 
      ? pendingPrayers.join(', ')
      : 'daily prayers';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border: 1px solid rgba(16, 185, 129, 0.3); margin-bottom: 12px;">
            🌿 Majlis Al-Aman Reminder
          </div>
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 8px 0;">Daily Worship Fill-Up Reminder</h1>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">Assalamu Alaikum ${user.name || 'Brother/Sister'}, preserve your consistency before the day ends.</p>
        </div>

        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #10b981; font-size: 16px; margin: 0 0 12px 0;">📋 Today's Status:</h2>
          <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Pending Prayers to log:</strong> <span style="color: #f59e0b;">${pendingText}</span></li>
            <li><strong>Quran pages logged today:</strong> <span style="color: #10b981;">${quranPagesToday} pages</span></li>
            <li><strong>Current Streak:</strong> <span style="color: #f59e0b;">🔥 ${streak} Days Active</span></li>
          </ul>
        </div>

        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${appUrl}" style="display: inline-block; background: #10b981; color: #022c22; text-decoration: none; padding: 14px 32px; border-radius: 14px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Open Tracker & Log Worship ✓
          </a>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 16px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0 0 4px 0;"><em>"Indeed, prayer has been decreed upon the believers a decree of specified times." (Surah An-Nisa: 103)</em></p>
          <p style="margin: 0;">You can customize reminder times or disable email alerts in your Majlis Al-Aman Settings.</p>
        </div>
      </div>
    `;

    if (!transporter) {
      console.log(`[Email Reminder Simulation] To: ${user.email} | Pending: ${pendingText} | (Configure SMTP_USER & SMTP_PASS in server/.env to send real emails)`);
      return {
        success: true,
        simulated: true,
        message: `Email reminder triggered for ${user.email} (SMTP configuration logged)`
      };
    }

    const info = await transporter.sendMail({
      from: `"Majlis Al-Aman" <${senderEmail}>`,
      to: user.email,
      subject: `🌿 Fill up today's Namaz & Quran log — Majlis Al-Aman`,
      html: htmlContent
    });

    console.log(`[Email Reminder Sent] To: ${user.email}, Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Send reminder email error:', error.message);
    return { success: false, error: error.message };
  }
};
