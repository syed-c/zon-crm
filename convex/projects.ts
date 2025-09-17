import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listProjects = query({
  args: {},
  handler: async (ctx, args) => {
    const projects = await ctx.db.query("projects").order("desc").collect();
    return projects;
  },
});

export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    return project;
  },
});

export const getProjectById = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    return project;
  },
});

export const createProject = mutation({
  args: {
    clientId: v.id("clients"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    startDate: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      clientId: args.clientId,
      name: args.name,
      slug: args.slug,
      description: args.description,
      status: args.status ?? "active",
      startDate: args.startDate,
      dueDate: args.dueDate,
      tags: args.tags,
      metadata: {},
    });
    return projectId;
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    startDate: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    await ctx.db.patch(projectId, updates);
    return null;
  },
});

export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Delete all related tasks
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Delete all related KPI snapshots
    const kpiSnapshots = await ctx.db
      .query("kpiSnapshots")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    
    for (const snapshot of kpiSnapshots) {
      await ctx.db.delete(snapshot._id);
    }

    // Finally delete the project itself
    await ctx.db.delete(args.projectId);
    return null;
  },
});


