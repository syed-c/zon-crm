import { Email } from "@convex-dev/auth/providers/Email"
import { alphabet, generateRandomString } from "oslo/crypto"

export const SMTPOTP = Email({
  id: "smtp-otp",
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    return generateRandomString(6, alphabet("0-9"))
  },
  async sendVerificationRequest({ identifier: email, token }) {
    try {
      // Simple logging approach for development
      console.log(`=== OTP EMAIL ===`);
      console.log(`To: ${email}`);
      console.log(`Code: ${token}`);
      console.log(`Subject: ZON CRM - Your Verification Code`);
      console.log(`SMTP: smtp.hostinger.com:587`);
      console.log(`From: contact@syedrayyan.com`);
      console.log(`================`);
      
      // Function should return void for Convex Auth
      return;

    } catch (error) {
      console.error("Failed to send OTP email:", error);
      throw new Error("Failed to send verification email");
    }
  }
})

// Helper functions for email templates
function getEmailHTML(token: string, email: string) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ZON CRM - Verification Code</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            background: linear-gradient(135deg, #d57de3, #8b5cf6);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 15px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
          }
          .title {
            color: #151c40;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
          }
          .subtitle {
            color: #666;
            font-size: 16px;
            margin: 10px 0 0 0;
          }
          .code-container {
            background-color: #f8f9fa;
            border: 2px dashed #d57de3;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
          }
          .verification-code {
            font-size: 36px;
            font-weight: bold;
            color: #d57de3;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 0;
          }
          .instructions {
            background-color: #e8f4fd;
            border-left: 4px solid #d57de3;
            padding: 20px;
            margin: 25px 0;
            border-radius: 5px;
          }
          .instructions h3 {
            color: #151c40;
            margin-top: 0;
            font-size: 18px;
          }
          .instructions p {
            margin: 10px 0;
            color: #555;
          }
          .security-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 25px 0;
            color: #856404;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Z</div>
            <h1 class="title">ZON CRM</h1>
            <p class="subtitle">Digital Marketing Agency Management</p>
          </div>
          
          <h2 style="color: #151c40; text-align: center; margin-bottom: 20px;">
            Your Verification Code
          </h2>
          
          <div class="code-container">
            <p class="verification-code">${token}</p>
          </div>
          
          <div class="instructions">
            <h3>How to use this code:</h3>
            <p>1. Return to the ZON CRM login page</p>
            <p>2. Enter the verification code above</p>
            <p>3. Click "Verify & Sign In" to access your account</p>
          </div>
          
          <div class="security-note">
            <strong>Security Notice:</strong> This code will expire in 15 minutes for your security. 
            If you didn't request this code, please ignore this email.
          </div>
          
          <div class="footer">
            <p>This email was sent to <strong>${email}</strong></p>
            <p>© 2024 ZON Digital Marketing. All rights reserved.</p>
            <p>Visit us at <a href="https://www.zon.ae" style="color: #d57de3;">www.zon.ae</a></p>
          </div>
        </div>
      </body>
      </html>
    `
}

function getEmailText(token: string, email: string) {
    return `
ZON CRM - Verification Code

Your verification code is: ${token}

This code will expire in 15 minutes.

To complete your login:
1. Return to the ZON CRM login page
2. Enter the verification code above
3. Click "Verify & Sign In"

If you didn't request this code, please ignore this email.

© 2024 ZON Digital Marketing
Visit us at www.zon.ae
    `
}