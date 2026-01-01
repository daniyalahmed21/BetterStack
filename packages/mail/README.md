# Email Integration

This document explains how to configure and use the email notification system in the BetterStack clone.

## Overview

The email integration allows you to receive notifications for:
- **Website Incidents**: When a monitored website goes down or comes back up
- **Heartbeat Failures**: When a heartbeat misses its expected ping

## Architecture

The email system is built using:
- **@repo/mail**: Shared package for email logic (used by both API and Worker)
- **nodemailer**: SMTP email sending library
- **HTML Templates**: Beautiful, responsive email templates

## Configuration

### Environment Variables

Add the following to your `.env` file in both `apps/api` and `apps/worker`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="BetterStack <alerts@yourdomain.com>"
```

### Gmail Setup

If using Gmail:
1. Enable 2-factor authentication on your Google account
2. Generate an [App Password](https://support.google.com/accounts/answer/185833)
3. Use the app password as `SMTP_PASS`

### Other SMTP Providers

You can use any SMTP provider:
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **AWS SES**: `email-smtp.us-east-1.amazonaws.com:587`
- **Outlook**: `smtp-mail.outlook.com:587`

## Development Mode

If SMTP credentials are not configured, the system will:
- Log email details to the console
- Continue functioning without sending actual emails
- Display `[EMAIL MOCK]` messages in logs

This allows you to develop and test without setting up SMTP.

## Usage

### 1. Create an Alert Channel

In the Alerting page:
1. Click "Create Alert Channel"
2. Select "Email" as the type
3. Enter a name (e.g., "My Email")
4. Enter your email address as the target
5. Click "Create"

### 2. Automatic Alerts

Once configured, you'll receive emails when:
- A monitored website goes down (incident started)
- A monitored website comes back up (incident resolved)
- A heartbeat misses its expected ping

### 3. Email Content

Emails include:
- **Subject**: Clear indication of the alert type
- **HTML Body**: Formatted with website/heartbeat details
- **Plain Text**: Fallback for email clients that don't support HTML
- **Timestamp**: When the incident occurred

## Testing

### Test Website Alerts

1. Create a monitor with a URL that will fail (e.g., `http://localhost:9999`)
2. Wait for the worker to check it (runs every minute)
3. Check your email or console logs

### Test Heartbeat Alerts

1. Create a heartbeat with a short period (e.g., 60 seconds)
2. Don't ping it
3. Wait for the grace period to expire
4. Check your email or console logs

## Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials**: Verify all environment variables are set correctly
2. **Check logs**: Look for `[EMAIL ERROR]` messages
3. **Test SMTP connection**: Use a tool like [smtp-test](https://www.npmjs.com/package/smtp-test)
4. **Check spam folder**: Emails might be filtered as spam

### Gmail Errors

- **"Less secure app access"**: Use an App Password instead
- **"Username and Password not accepted"**: Enable 2FA and generate an App Password
- **Rate limiting**: Gmail has sending limits for free accounts

## Production Recommendations

1. **Use a dedicated SMTP service**: SendGrid, Mailgun, or AWS SES
2. **Set up SPF/DKIM**: Improve email deliverability
3. **Monitor sending limits**: Track email volume
4. **Use a custom domain**: Set `SMTP_FROM` to your domain
5. **Enable TLS**: Set `SMTP_SECURE=true` for port 465

## API Reference

### sendEmail

```typescript
import { sendEmail } from "@repo/mail";

await sendEmail(
  "user@example.com",
  "Subject Line",
  "Plain text body",
  "<html>HTML body</html>" // optional
);
```

### getAlertHtml

```typescript
import { getAlertHtml } from "@repo/mail";

const html = getAlertHtml(
  "Alert Title",
  "Alert message",
  "https://example.com" // optional
);
```

## Future Enhancements

- [ ] Email templates with custom branding
- [ ] Digest emails (daily/weekly summaries)
- [ ] Email preferences per user
- [ ] Unsubscribe links
- [ ] Email verification for alert channels
