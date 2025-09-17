import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const testOTP = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log(`Testing OTP for email: ${args.email}`);
      
      // Generate a test token
      const token = Math.random().toString().substring(2, 8);
      
      console.log(`=== TEST OTP ===`);
      console.log(`To: ${args.email}`);
      console.log(`Code: ${token}`);
      console.log(`===============`);
      
      return { success: true, token };
    } catch (error) {
      console.error("Test OTP error:", error);
      throw new Error("Test OTP failed");
    }
  },
});
