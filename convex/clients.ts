import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listClients = query({
  args: {},
  handler: async (ctx, args) => {
    const clients = await ctx.db.query("clients").order("desc").collect();
    return clients;
  },
});

export const getClientById = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const client = await ctx.db.get(args.clientId);
    return client;
  },
});

export const getClientProjects = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .collect();
    return projects;
  },
});

export const createClient = mutation({
  args: {
    name: v.string(),
    website: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clientId = await ctx.db.insert("clients", {
      name: args.name,
      website: args.website,
      contactEmail: args.contactEmail,
      phone: args.phone,
      notes: args.notes,
      metadata: {},
    });
    return clientId;
  },
});

export const updateClient = mutation({
  args: {
    clientId: v.id("clients"),
    name: v.optional(v.string()),
    website: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clientId, ...updates } = args;
    await ctx.db.patch(clientId, updates);
    return null;
  },
});

export const deleteClient = mutation({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    // Check if client has projects
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();
    
    if (projects.length > 0) {
      throw new Error("Cannot delete client with active projects. Please delete or reassign projects first.");
    }
    
    await ctx.db.delete(args.clientId);
    return null;
  },
});

// Get client statistics
export const getClientStats = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === "active").length;
    const completedProjects = projects.filter(p => p.status === "completed").length;

    // Get tasks for all client projects - simplified approach
    let totalTasks = 0;
    let completedTasks = 0;

    for (const project of projects) {
      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_project", (q) => q.eq("projectId", project._id))
        .collect();
      
      totalTasks += tasks.length;
      const doneTasks = tasks.filter(task => task.status === "done");
      completedTasks += doneTasks.length;
    }

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  },
});

