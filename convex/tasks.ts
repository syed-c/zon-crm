import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listTasks = query({
  args: {},
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks").order("desc").collect();
    return tasks;
  },
});

export const listTasksByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
    return tasks;
  },
});

export const listTasksByStatus = query({
  args: { 
    projectId: v.id("projects"),
    status: v.string() 
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project_and_status", (q) => 
        q.eq("projectId", args.projectId).eq("status", args.status)
      )
      .collect();
    return tasks;
  },
});

export const createTask = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()), // todo, in_progress, done, blocked
    priority: v.optional(v.string()), // low, medium, high
    assigneeId: v.optional(v.id("teamMembers")),
    estimateHours: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      status: args.status ?? "todo",
      priority: args.priority ?? "medium",
      assigneeId: args.assigneeId,
      createdBy: args.assigneeId,
      estimateHours: args.estimateHours,
      dueDate: args.dueDate,
      tags: args.tags,
      blockedReason: undefined,
      metadata: {},
    });
    return taskId;
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    assigneeId: v.optional(v.id("teamMembers")),
    estimateHours: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    blockedReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { taskId, ...updates } = args;
    await ctx.db.patch(taskId, updates);
    return null;
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
    return null;
  },
});

// Get task statistics for a project
export const getTaskStats = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const allTasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const total = allTasks.length;
    const todo = allTasks.filter(task => task.status === "todo").length;
    const inProgress = allTasks.filter(task => task.status === "in_progress").length;
    const done = allTasks.filter(task => task.status === "done").length;
    const blocked = allTasks.filter(task => task.status === "blocked").length;

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      total,
      todo,
      inProgress,
      done,
      blocked,
      completionRate,
    };
  },
});
