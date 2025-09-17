import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// SEO Items (On-page optimization tracking)
export const listSeoItemsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const seoItems = await ctx.db
      .query("seoItems")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
    return seoItems;
  },
});

export const listSeoItemsByStatus = query({
  args: { 
    projectId: v.id("projects"),
    status: v.string() 
  },
  handler: async (ctx, args) => {
    const seoItems = await ctx.db
      .query("seoItems")
      .withIndex("by_status_and_project", (q) => 
        q.eq("status", args.status).eq("projectId", args.projectId)
      )
      .collect();
    return seoItems;
  },
});

export const createSeoItem = mutation({
  args: {
    projectId: v.id("projects"),
    contentId: v.optional(v.id("content")),
    kind: v.string(), // title_tag, meta_description, h1, alt_text, etc.
    status: v.optional(v.string()), // ok, issue, wip
    details: v.optional(v.string()),
    ownerId: v.optional(v.id("teamMembers")),
    priority: v.optional(v.string()), // high, medium, low
  },
  handler: async (ctx, args) => {
    const seoItemId = await ctx.db.insert("seoItems", {
      projectId: args.projectId,
      contentId: args.contentId,
      kind: args.kind,
      status: args.status ?? "issue",
      details: args.details,
      ownerId: args.ownerId,
      priority: args.priority ?? "medium",
    });
    return seoItemId;
  },
});

export const updateSeoItem = mutation({
  args: {
    seoItemId: v.id("seoItems"),
    status: v.optional(v.string()),
    details: v.optional(v.string()),
    ownerId: v.optional(v.id("teamMembers")),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { seoItemId, ...updates } = args;
    await ctx.db.patch(seoItemId, updates);
    return null;
  },
});

export const deleteSeoItem = mutation({
  args: { seoItemId: v.id("seoItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.seoItemId);
    return null;
  },
});

// Get SEO checklist progress for a project
export const getSeoProgress = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const allItems = await ctx.db
      .query("seoItems")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const total = allItems.length;
    const completed = allItems.filter(item => item.status === "ok").length;
    const inProgress = allItems.filter(item => item.status === "wip").length;
    const issues = allItems.filter(item => item.status === "issue").length;

    return {
      total,
      completed,
      inProgress,
      issues,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  },
});