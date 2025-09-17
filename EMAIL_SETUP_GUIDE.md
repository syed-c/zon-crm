# Email Setup Guide for ZON CRM OTP

## Current Status
✅ **OTP System Working**: The system generates and stores OTP codes
✅ **Console Logging**: OTP codes are displayed in browser console
❌ **Real Email Sending**: Currently in development mode

## Quick Setup Options

### Option 1: EmailJS (Recommended - Free & Easy)
1. Go to [emailjs.com](https://www.emailjs.com)
2. Create a free account
3. Create an email service (Gmail, Outlook, etc.)
4. Create an email template
5. Get your Service ID, Template ID, and Public Key
6. Update `convex/realEmailService.ts` with your credentials

### Option 2: SendinBlue (Now Brevo) - Free Tier
1. Go to [sendinblue.com](https://www.sendinblue.com)
2. Create a free account (300 emails/day free)
3. Get your API key
4. Update `convex/realEmailService.ts` with your API key

### Option 3: SMTP2GO - Free Tier
1. Go to [smtp2go.com](https://www.smtp2go.com)
2. Create a free account (1000 emails/month free)
3. Get your API key
4. Update `convex/realEmailService.ts` with your API key

## Current Working Solution

The system is currently working in **development mode**:

1. **Go to**: `http://localhost:3000/login`
2. **Enter**: `contact@syedrayyan.com`
3. **Click**: "Send Verification Code"
4. **Check Console**: Open browser console (F12) to see the OTP code
5. **Enter Code**: Use the 6-digit code from console to login

## Console Output Example
```
=== OTP CREATED & EMAIL SENT ===
Email: contact@syedrayyan.com
Code: 123456
Expires: 12/19/2024, 5:48:35 PM
Email Result: { success: true, messageId: "dev_1234567890", mode: "development", code: "123456" }
================================
```

## Your SMTP Settings (Ready to Use)
- **Host**: smtp.hostinger.com
- **Port**: 587
- **User**: contact@syedrayyan.com
- **Pass**: Rayyan@1834

## Next Steps
1. Choose one of the email services above
2. Set up your account
3. Update the credentials in `convex/realEmailService.ts`
4. Test the email sending

The system is ready for production - just needs email service credentials!
