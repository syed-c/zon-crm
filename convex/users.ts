import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { ROLES } from "./rbac";

export const currentLoggedInUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user: Doc<"users"> | null = await ctx.db.get(userId);
    return user;
  },
});

export const createDemoUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if demo users already exist
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return { message: "Demo users already exist", count: existingUsers.length };
    }

    // Create demo users with correct RBAC roles
    const adminUser = await ctx.db.insert("users", {
      name: "Admin User",
      email: "admin@zon.ae",
      emailVerificationTime: Date.now(),
      role: ROLES.SUPER_ADMIN, // Use super_admin role for full access
      isAnonymous: false,
    });

    const managerUser = await ctx.db.insert("users", {
      name: "Manager User", 
      email: "manager@zon.ae",
      emailVerificationTime: Date.now(),
      role: ROLES.PROJECT_MANAGER, // Use project_manager role
      isAnonymous: false,
    });

    const editorUser = await ctx.db.insert("users", {
      name: "Editor User",
      email: "editor@zon.ae", 
      emailVerificationTime: Date.now(),
      role: ROLES.CONTENT_WRITER, // Use content_writer role
      isAnonymous: false,
    });

    return {
      message: "Demo users created successfully",
      users: [
        { id: adminUser, email: "admin@zon.ae", role: ROLES.SUPER_ADMIN },
        { id: managerUser, email: "manager@zon.ae", role: ROLES.PROJECT_MANAGER },
        { id: editorUser, email: "editor@zon.ae", role: ROLES.CONTENT_WRITER }
      ]
    };
  },
});

export const updateExistingUserRoles = mutation({
  args: {},
  handler: async (ctx) => {
    // Update existing users with correct roles
    const users = await ctx.db.query("users").collect();
    
    for (const user of users) {
      let newRole = user.role;
      
      // Map old roles to new RBAC roles
      if (user.email === "admin@zon.ae" || user.role === "admin") {
        newRole = ROLES.SUPER_ADMIN;
      } else if (user.email === "manager@zon.ae" || user.role === "manager") {
        newRole = ROLES.PROJECT_MANAGER;
      } else if (user.email === "editor@zon.ae" || user.role === "editor") {
        newRole = ROLES.CONTENT_WRITER;
      }
      
      if (newRole !== user.role) {
        await ctx.db.patch(user._id, { role: newRole });
      }
    }
    
    return { message: "User roles updated successfully", count: users.length };
  },
});
