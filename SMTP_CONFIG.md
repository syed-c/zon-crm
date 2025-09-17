# SMTP Configuration for ZON CRM OTP Verification

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# SMTP Configuration for OTP Emails
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contact@syedrayyan.com
SMTP_PASS=Rayyan@1834

# Resend API Key (for email sending)
RESEND_API_KEY=your_resend_api_key_here

# Convex Configuration
CONVEX_DEPLOYMENT=your_convex_deployment_url
CONVEX_SITE_URL=your_site_url
```

## How It Works

1. **SMTP Settings**: Your Hostinger SMTP credentials are used as the sender email
2. **Resend API**: The actual email sending is handled by Resend API for reliability
3. **Fallback Mode**: If Resend fails, the OTP is logged to console for development

## Email Template

The OTP emails include:
- Professional ZON CRM branding
- Clear verification code display
- Step-by-step instructions
- Security notice about expiration
- Responsive HTML design

## Testing

To test the OTP functionality:

1. Start the development server: `npm run dev`
2. Navigate to `/login`
3. Enter an email address
4. Check the console logs for the OTP code
5. Enter the code to complete login

## Production Setup

For production:

1. Get a Resend API key from [resend.com](https://resend.com)
2. Add the `RESEND_API_KEY` to your environment variables
3. Verify your domain with Resend
4. Update the `from` email to use your verified domain

## Troubleshooting

- **Emails not sending**: Check Resend API key and domain verification
- **SMTP errors**: Verify Hostinger SMTP credentials
- **Development mode**: Check console logs for OTP codes
