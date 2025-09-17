import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

// Define role hierarchy and permissions
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin", 
  PROJECT_MANAGER: "project_manager",
  SEO_SPECIALIST: "seo_specialist",
  CONTENT_WRITER: "content_writer",
  LINK_BUILDER: "link_builder",
  AUDITOR: "auditor",
  DESIGNER: "designer",
  CLIENT: "client",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Define capabilities for each module
export const CAPABILITIES = {
  VIEW: "view",
  EDIT: "edit", 
  APPROVE: "approve",
  EXPORT: "export",
} as const;

export type Capability = typeof CAPABILITIES[keyof typeof CAPABILITIES];

// Define modules
export const MODULES = {
  PROJECTS: "projects",
  SEO: "seo",
  CONTENT: "content", 
  SOCIAL: "social",
  REPORTS: "reports",
  FILES: "files",
  SETTINGS: "settings",
  CLIENTS: "clients",
  TASKS: "tasks",
} as const;

export type Module = typeof MODULES[keyof typeof MODULES];

// Role-based permissions matrix
export const ROLE_PERMISSIONS: Record<Role, Record<Module, Capability[]>> = {
  [ROLES.SUPER_ADMIN]: {
    [MODULES.PROJECTS]: ["view", "edit", "approve", "export"],
    [MODULES.SEO]: ["view", "edit", "approve", "export"],
    [MODULES.CONTENT]: ["view", "edit", "approve", "export"],
    [MODULES.SOCIAL]: ["view", "edit", "approve", "export"],
    [MODULES.REPORTS]: ["view", "edit", "approve", "export"],
    [MODULES.FILES]: ["view", "edit", "approve", "export"],
    [MODULES.SETTINGS]: ["view", "edit", "approve", "export"],
    [MODULES.CLIENTS]: ["view", "edit", "approve", "export"],
    [MODULES.TASKS]: ["view", "edit", "approve", "export"],
  },
  [ROLES.ADMIN]: {
    [MODULES.PROJECTS]: ["view", "edit", "approve", "export"],
    [MODULES.SEO]: ["view", "edit", "approve", "export"],
    [MODULES.CONTENT]: ["view", "edit", "approve", "export"],
    [MODULES.SOCIAL]: ["view", "edit", "approve", "export"],
    [MODULES.REPORTS]: ["view", "edit", "approve", "export"],
    [MODULES.FILES]: ["view", "edit", "approve", "export"],
    [MODULES.SETTINGS]: ["view", "edit"],
    [MODULES.CLIENTS]: ["view", "edit", "approve", "export"],
    [MODULES.TASKS]: ["view", "edit", "approve", "export"],
  },
  [ROLES.PROJECT_MANAGER]: {
    [MODULES.PROJECTS]: ["view", "edit", "approve", "export"],
    [MODULES.SEO]: ["view", "edit", "approve"],
    [MODULES.CONTENT]: ["view", "edit", "approve"],
    [MODULES.SOCIAL]: ["view", "edit", "approve"],
    [MODULES.REPORTS]: ["view", "export"],
    [MODULES.FILES]: ["view", "edit"],
    [MODULES.SETTINGS]: ["view"],
    [MODULES.CLIENTS]: ["view", "edit"],
    [MODULES.TASKS]: ["view", "edit", "approve"],
  },
  [ROLES.SEO_SPECIALIST]: {
    [MODULES.PROJECTS]: ["view"],
    [MODULES.SEO]: ["view", "edit"],
    [MODULES.CONTENT]: ["view"],
    [MODULES.SOCIAL]: ["view"],
    [MODULES.REPORTS]: ["view"],
    [MODULES.FILES]: ["view"],
    [MODULES.SETTINGS]: [],
    [MODULES.CLIENTS]: ["view"],
    [MODULES.TASKS]: ["view", "edit"],
  },
  [ROLES.CONTENT_WRITER]: {
    [MODULES.PROJECTS]: ["view"],
    [MODULES.SEO]: ["view"],
    [MODULES.CONTENT]: ["view", "edit"],
    [MODULES.SOCIAL]: ["view", "edit"],
    [MODULES.REPORTS]: ["view"],
    [MODULES.FILES]: ["view", "edit"],
    [MODULES.SETTINGS]: [],
    [MODULES.CLIENTS]: ["view"],
    [MODULES.TASKS]: ["view", "edit"],
  },
  [ROLES.LINK_BUILDER]: {
    [MODULES.PROJECTS]: ["view"],
    [MODULES.SEO]: ["view", "edit"],
    [MODULES.CONTENT]: ["view"],
    [MODULES.SOCIAL]: ["view"],
    [MODULES.REPORTS]: ["view"],
    [MODULES.FILES]: ["view"],
    [MODULES.SETTINGS]: [],
    [MODULES.CLIENTS]: ["view"],
    [MODULES.TASKS]: ["view", "edit"],
  },
  [ROLES.AUDITOR]: {
    [MODULES.PROJECTS]: ["view"],
    [MODULES.SEO]: ["view", "edit"],
    [MODULES.CONTENT]: ["view"],
    [MODULES.SOCIAL]: ["view"],
    [MODULES.REPORTS]: ["view", "export"],
    [MODULES.FILES]: ["view"],
    [MODULES.SETTINGS]: [],
    [MODULES.CLIENTS]: ["view"],
    [MODULES.TASKS]: ["view", "edit"],
  },
  [ROLES.DESIGNER]: {
    [MODULES.PROJECTS]: ["view"],
    [MODULES.SEO]: ["view"],
    [MODULES.CONTENT]: ["view", "edit"],
    [MODULES.SOCIAL]: ["view", "edit"],
    [MODULES.REPORTS]: ["view"],
    [MODULES.FILES]: ["view", "edit"],
    [MODULES.SETTINGS]: [],
    [MODULES.CLIENTS]: ["view"],
    [MODULES.TASKS]: ["view", "edit"],
  },
  [ROLES.CLIENT]: {
    [MODULES.PROJECTS]: ["view"],
    [MODULES.SEO]: ["view"],
    [MODULES.CONTENT]: ["view"],
    [MODULES.SOCIAL]: ["view"],
    [MODULES.REPORTS]: ["view"],
    [MODULES.FILES]: ["view"],
    [MODULES.SETTINGS]: [],
    [MODULES.CLIENTS]: [],
    [MODULES.TASKS]: ["view"],
  },
};

// Helper function to check if user has permission
export const hasPermission = async (
  ctx: any,
  module: Module,
  capability: Capability,
  projectId?: Id<"projects">
): Promise<boolean> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;

  const user = await ctx.db.get(userId);
  if (!user || !user.role) return false;

  const role = user.role as Role;
  const permissions = ROLE_PERMISSIONS[role];
  
  if (!permissions || !permissions[module]) return false;
  
  const modulePermissions = permissions[module];
  const hasCapability = modulePermissions.includes(capability);
  
  // For clients, additional check: they can only access their own projects
  if (role === ROLES.CLIENT && projectId) {
    // TODO: Implement client-project relationship check
    // For now, assume clients can access all projects they're assigned to
    return hasCapability;
  }
  
  return hasCapability;
};

// Middleware function to enforce permissions
export const requirePermission = async (
  ctx: any,
  module: Module,
  capability: Capability,
  projectId?: Id<"projects">
): Promise<void> => {
  const hasAccess = await hasPermission(ctx, module, capability, projectId);
  if (!hasAccess) {
    throw new Error(`Access denied: Missing ${capability} permission for ${module}`);
  }
};

// Get current user with role information
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const user = await ctx.db.get(userId);
    return user;
  },
});

// Check if current user has specific permission
export const checkPermission = query({
  args: {
    module: v.string(),
    capability: v.string(),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    return await hasPermission(
      ctx,
      args.module as Module,
      args.capability as Capability,
      args.projectId
    );
  },
});

// Get user permissions for all modules
export const getUserPermissions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user || !user.role) return null;

    const role = user.role as Role;
    return ROLE_PERMISSIONS[role] || null;
  },
});

// Super Admin: Create user with role and permissions
export const createUserWithRole = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.string(),
    projectAccess: v.optional(v.array(v.id("projects"))),
  },
  handler: async (ctx, args) => {
    // Only super admin can create users
    await requirePermission(ctx, MODULES.SETTINGS, CAPABILITIES.EDIT);
    
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      emailVerificationTime: Date.now(),
    });

    // TODO: Send invitation email
    // TODO: Store project access permissions
    
    return userId;
  },
});

// Update user role and permissions
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
    projectAccess: v.optional(v.array(v.id("projects"))),
  },
  handler: async (ctx, args) => {
    // Only super admin can update user roles
    await requirePermission(ctx, MODULES.SETTINGS, CAPABILITIES.EDIT);
    
    await ctx.db.patch(args.userId, {
      role: args.role,
    });

    // TODO: Update project access permissions
    
    return null;
  },
});

// List all users (admin only)
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requirePermission(ctx, MODULES.SETTINGS, CAPABILITIES.VIEW);
    
    const users = await ctx.db.query("users").collect();
    return users;
  },
});