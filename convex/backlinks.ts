import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listBacklinksByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const backlinks = await ctx.db
      .query("backlinks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
    return backlinks;
  },
});

export const listBacklinksByStatus = query({
  args: { 
    projectId: v.id("projects"),
    status: v.string() 
  },
  handler: async (ctx, args) => {
    const backlinks = await ctx.db
      .query("backlinks")
      .withIndex("by_project_and_status", (q) => 
        q.eq("projectId", args.projectId).eq("status", args.status)
      )
      .collect();
    return backlinks;
  },
});

export const createBacklink = mutation({
  args: {
    projectId: v.id("projects"),
    sourceUrl: v.string(),
    sourceDomain: v.string(),
    targetContentId: v.optional(v.id("content")),
    status: v.optional(v.string()), // live, lost, pending
    anchorText: v.optional(v.string()),
    authority: v.optional(v.number()), // domain authority score
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const backlinkId = await ctx.db.insert("backlinks", {
      projectId: args.projectId,
      sourceUrl: args.sourceUrl,
      sourceDomain: args.sourceDomain,
      targetContentId: args.targetContentId,
      discoveredAt: Date.now(),
      status: args.status ?? "pending",
      anchorText: args.anchorText,
      authority: args.authority,
      notes: args.notes,
      metadata: {},
    });
    return backlinkId;
  },
});

export const updateBacklink = mutation({
  args: {
    backlinkId: v.id("backlinks"),
    status: v.optional(v.string()),
    anchorText: v.optional(v.string()),
    authority: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { backlinkId, ...updates } = args;
    await ctx.db.patch(backlinkId, updates);
    return null;
  },
});

export const deleteBacklink = mutation({
  args: { backlinkId: v.id("backlinks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.backlinkId);
    return null;
  },
});

// Get backlink statistics for a project
export const getBacklinkStats = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const allBacklinks = await ctx.db
      .query("backlinks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const total = allBacklinks.length;
    const live = allBacklinks.filter(link => link.status === "live").length;
    const pending = allBacklinks.filter(link => link.status === "pending").length;
    const lost = allBacklinks.filter(link => link.status === "lost").length;

    const totalAuthority = allBacklinks
      .filter(link => link.authority && link.status === "live")
      .reduce((sum, link) => sum + (link.authority || 0), 0);
    
    const averageAuthority = live > 0 ? Math.round(totalAuthority / live) : 0;

    return {
      total,
      live,
      pending,
      lost,
      averageAuthority,
    };
  },
});

// Get top domains by authority
export const getTopDomains = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const backlinks = await ctx.db
      .query("backlinks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .filter((q) => q.eq(q.field("status"), "live"))
      .collect();

    // Group by domain and calculate stats
    const domainStats = backlinks.reduce((acc, link) => {
      const domain = link.sourceDomain;
      if (!acc[domain]) {
        acc[domain] = {
          domain,
          count: 0,
          authority: link.authority || 0,
          links: [],
        };
      }
      acc[domain].count += 1;
      acc[domain].links.push(link);
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by authority
    return Object.values(domainStats)
      .sort((a: any, b: any) => (b.authority || 0) - (a.authority || 0))
      .slice(0, 10); // Top 10 domains
  },
});