import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple email/password authentication
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("=== SIMPLE LOGIN ATTEMPT ===");
    console.log("Email:", args.email);
    console.log("Password:", args.password);
    
    // For now, hardcode admin credentials
    // In production, you'd hash passwords and store them in the database
    const adminEmail = "contact@syedrayyan.com";
    const adminPassword = "admin123"; // Change this to a secure password
    
    if (args.email === adminEmail && args.password === adminPassword) {
      // Create a simple session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const sessionExpiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      
      // Store session in database
      await ctx.db.insert("userSessions", {
        email: args.email,
        sessionId: sessionId,
        expiresAt: sessionExpiresAt,
        isActive: true,
      });
      
      // Ensure user exists
      let user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();
        
      if (!user) {
        await ctx.db.insert("users", {
          email: args.email,
          name: "Admin",
          role: "admin",
          emailVerificationTime: Date.now(),
        });
      }
      
      console.log("=== LOGIN SUCCESS ===");
      console.log("Session ID:", sessionId);
      console.log("====================");
      
      return {
        success: true,
        sessionId: sessionId,
        message: "Login successful",
      };
    } else {
      console.log("=== LOGIN FAILED ===");
      console.log("Invalid credentials");
      console.log("==================");
      
      return {
        success: false,
        message: "Invalid email or password",
      };
    }
  },
});

// Get current user from session
export const getCurrentUser = query({
  args: {
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("=== GET CURRENT USER (SIMPLE) ===");
    console.log("Session ID:", args.sessionId);
    
    if (!args.sessionId || args.sessionId === "") {
      console.log("No session ID provided, returning null");
      return null;
    }
    
    try {
      // Check if session exists and is active
      const session = await ctx.db
        .query("userSessions")
        .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .first();
        
      if (!session) {
        console.log("Session not found or inactive");
        return null;
      }
      
      // Check if session is expired
      if (session.expiresAt < Date.now()) {
        console.log("Session expired");
        return null;
      }
      
      // Get user details
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), session.email))
        .first();
        
      console.log("User found:", user);
      console.log("=============================");
      
      return user;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return null;
    }
  },
});

// Sign out
export const signOut = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("=== SIGN OUT ===");
    console.log("Session ID:", args.sessionId);
    
    const session = await ctx.db
      .query("userSessions")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .first();
      
    if (session) {
      await ctx.db.patch(session._id, { isActive: false });
      console.log("Session deactivated");
    }
    
    console.log("===============");
    return { success: true };
  },
});
