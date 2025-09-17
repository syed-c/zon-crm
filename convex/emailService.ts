import { action } from "./_generated/server";
import { v } from "convex/values";

// Simple email sending using EmailJS (free service)
export const sendOTPEmail = action({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // For development, just log the OTP
      console.log(`=== OTP EMAIL ===`);
      console.log(`To: ${args.email}`);
      console.log(`Code: ${args.code}`);
      console.log(`Subject: ZON CRM - Your Verification Code`);
      console.log(`SMTP: smtp.hostinger.com:587`);
      console.log(`From: contact@syedrayyan.com`);
      console.log(`================`);
      
      // In production, you can integrate with EmailJS or any other free email service
      // For now, we'll just log it for development
      
      return { success: true, messageId: `dev_${Date.now()}` };
      
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      throw new Error("Failed to send verification email");
    }
  },
});

// Alternative: Send email using a simple HTTP service
export const sendEmailViaService = action({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // You can use any free email service like:
      // - EmailJS (free tier: 200 emails/month)
      // - SendGrid (free tier: 100 emails/day)
      // - Mailgun (free tier: 5,000 emails/month)
      // - Or your own SMTP server
      
      const emailData = {
        to: args.email,
        from: "contact@syedrayyan.com",
        subject: "ZON CRM - Your Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #d57de3, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">ZON CRM</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Digital Marketing Agency Management</p>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #151c40; text-align: center; margin-bottom: 20px;">Your Verification Code</h2>
              <div style="background: white; border: 2px dashed #d57de3; border-radius: 10px; padding: 25px; text-align: center; margin: 20px 0;">
                <p style="font-size: 36px; font-weight: bold; color: #d57de3; letter-spacing: 8px; margin: 0; font-family: monospace;">${args.code}</p>
              </div>
              <div style="background: #e8f4fd; border-left: 4px solid #d57de3; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <h3 style="color: #151c40; margin-top: 0;">How to use this code:</h3>
                <p style="margin: 10px 0; color: #555;">1. Return to the ZON CRM login page</p>
                <p style="margin: 10px 0; color: #555;">2. Enter the verification code above</p>
                <p style="margin: 10px 0; color: #555;">3. Click "Verify & Sign In" to access your account</p>
              </div>
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; color: #856404;">
                <strong>Security Notice:</strong> This code will expire in 15 minutes for your security. 
                If you didn't request this code, please ignore this email.
              </div>
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>This email was sent to <strong>${args.email}</strong></p>
                <p>© 2024 ZON Digital Marketing. All rights reserved.</p>
                <p>Visit us at <a href="https://www.zon.ae" style="color: #d57de3;">www.zon.ae</a></p>
              </div>
            </div>
          </div>
        `,
        text: `
ZON CRM - Verification Code

Your verification code is: ${args.code}

This code will expire in 15 minutes.

To complete your login:
1. Return to the ZON CRM login page
2. Enter the verification code above
3. Click "Verify & Sign In"

If you didn't request this code, please ignore this email.

© 2024 ZON Digital Marketing
Visit us at www.zon.ae
        `
      };
      
      // Log the email for development
      console.log(`=== EMAIL SERVICE ===`);
      console.log(`To: ${emailData.to}`);
      console.log(`From: ${emailData.from}`);
      console.log(`Subject: ${emailData.subject}`);
      console.log(`Code: ${args.code}`);
      console.log(`===================`);
      
      return { success: true, messageId: `email_${Date.now()}` };
      
    } catch (error) {
      console.error("Failed to send email via service:", error);
      throw new Error("Failed to send verification email");
    }
  },
});