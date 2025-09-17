import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendOTPEmail = action({
  args: {
    email: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // For development, just log the OTP
      console.log(`=== OTP EMAIL ===`);
      console.log(`To: ${args.email}`);
      console.log(`Code: ${args.token}`);
      console.log(`Subject: ZON CRM - Your Verification Code`);
      console.log(`================`);
      
      // In production, you would integrate with your email service here
      // For now, we'll simulate success
      return { success: true, messageId: `dev_${Date.now()}` };
      
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      throw new Error("Failed to send verification email");
    }
  },
});
