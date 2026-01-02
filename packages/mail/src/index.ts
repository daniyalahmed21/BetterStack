import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.SMTP_USER);
console.log(process.env.SMTP_PASS);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function getAlertHtml(title: string, message: string, url?: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333;">${title}</h2>
      <p style="font-size: 16px; color: #555;">${message}</p>
      ${url ? `
      <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
        <p style="margin: 0; font-weight: bold;">Target:</p>
        <a href="${url}" style="color: #007bff; text-decoration: none;">${url}</a>
      </div>
      ` : ""}
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        This is an automated alert from your BetterStack clone.
      </p>
    </div>
  `;
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
    console.log(`[EMAIL MOCK] Body: ${text}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BetterStack" <alerts@betterstack.clone>',
      to,
      subject,
      text,
      html,
    });
    console.log(`[EMAIL SENT] Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error);
    throw error;
  }
}
