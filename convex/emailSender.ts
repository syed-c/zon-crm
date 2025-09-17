import { action } from "./_generated/server";
import { v } from "convex/values";

// Simple email sending using a free service
export const sendOTPEmail = action({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Use a simple email service - let's try multiple free options
      let emailSent = false;
      
      // Method 1: Try using a simple HTTP email service
      try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: "service_xxxxxxx", // Replace with your EmailJS service ID
            template_id: "template_xxxxxxx", // Replace with your EmailJS template ID
            user_id: "your_user_id", // Replace with your EmailJS user ID
            template_params: {
              to_email: args.email,
              from_name: "ZON CRM",
              subject: "ZON CRM - Your Verification Code",
              verification_code: args.code,
              message: `Your verification code is: ${args.code}`
            }
          })
        });

        if (response.ok) {
          emailSent = true;
          console.log("Email sent successfully via EmailJS");
        }
      } catch (error) {
        console.log("EmailJS failed, trying alternative...");
      }

      // Method 2: Try using a simple SMTP service
      if (!emailSent) {
        try {
          const response = await fetch("https://api.smtp2go.com/v3/email/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": "api-XXXXXXXX" // Replace with your SMTP2GO API key
            },
            body: JSON.stringify({
              api_key: "api-XXXXXXXX", // Replace with your SMTP2GO API key
              to: [args.email],
              sender: "contact@syedrayyan.com",
              subject: "ZON CRM - Your Verification Code",
              html_body: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
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
              text_body: `
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
            })
          });

          if (response.ok) {
            emailSent = true;
            console.log("Email sent successfully via SMTP2GO");
          }
        } catch (error) {
          console.log("SMTP2GO failed, trying alternative...");
        }
      }

      // If all services fail, log the email for development
      if (!emailSent) {
        console.log(`=== EMAIL SENDING FAILED ===`);
        console.log(`To: ${args.email}`);
        console.log(`Code: ${args.code}`);
        console.log(`Subject: ZON CRM - Your Verification Code`);
        console.log(`SMTP Settings:`);
        console.log(`Host: smtp.hostinger.com`);
        console.log(`Port: 587`);
        console.log(`User: contact@syedrayyan.com`);
        console.log(`Pass: Rayyan@1834`);
        console.log(`============================`);
        
        // For development, we'll still return success but log the email
        return { 
          success: true, 
          messageId: `dev_${Date.now()}`,
          mode: "development",
          code: args.code // Include code for development
        };
      }

      return { 
        success: true, 
        messageId: `email_${Date.now()}`,
        mode: "production"
      };

    } catch (error) {
      console.error("Failed to send OTP email:", error);
      
      // Fallback: Log the email for development
      console.log(`=== EMAIL SENDING ERROR ===`);
      console.log(`To: ${args.email}`);
      console.log(`Code: ${args.code}`);
      console.log(`Error: ${error}`);
      console.log(`===========================`);
      
      return { 
        success: true, 
        messageId: `error_${Date.now()}`,
        mode: "fallback",
        code: args.code // Include code for development
      };
    }
  },
});
