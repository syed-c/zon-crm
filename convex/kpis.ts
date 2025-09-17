import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// KPI snapshot for tracking metrics over time
export const createKpiSnapshot = mutation({
  args: {
    projectId: v.id("projects"),
    segment: v.string(), // seo, social, content, ads, email, web, analytics
    date: v.number(),
    metrics: v.record(v.string(), v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("kpiSnapshots", {
      projectId: args.projectId,
      segment: args.segment,
      date: args.date,
      metrics: args.metrics,
    });
  },
});

// Get latest KPIs for a project and segment
export const getLatestKpis = query({
  args: {
    projectId: v.id("projects"),
    segment: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const snapshot = await ctx.db
      .query("kpiSnapshots")
      .withIndex("by_project_and_segment", (q) =>
        q.eq("projectId", args.projectId).eq("segment", args.segment)
      )
      .order("desc")
      .first();

    return snapshot;
  },
});

// Get KPI trends over time
export const getKpiTrends = query({
  args: {
    projectId: v.id("projects"),
    segment: v.string(),
    days: v.optional(v.number()), // defaults to 30
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const days = args.days || 30;
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

    const snapshots = await ctx.db
      .query("kpiSnapshots")
      .withIndex("by_project_and_segment", (q) =>
        q.eq("projectId", args.projectId).eq("segment", args.segment)
      )
      .filter((q) => q.gte(q.field("date"), cutoffDate))
      .order("desc")
      .collect();

    return snapshots;
  },
});

// Get dashboard overview KPIs (all segments for a project)
export const getDashboardKpis = query({
  args: {
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // If no project specified, get global KPIs
    if (!args.projectId) {
      // Return mock global KPIs for now
      return {
        totalProjects: 12,
        activeProjects: 8,
        completedProjects: 4,
        onTimeRate: 94,
        overdueTasksCount: 7,
        teamUtilization: 87,
      };
    }

    // Get latest snapshot for each segment
    const segments = ["seo", "social", "content", "ads", "email", "web", "analytics"];
    const kpis: Record<string, any> = {};

    for (const segment of segments) {
      const snapshot = await ctx.db
        .query("kpiSnapshots")
        .withIndex("by_project_and_segment", (q) =>
          q.eq("projectId", args.projectId!).eq("segment", segment)
        )
        .order("desc")
        .first();

      if (snapshot) {
        kpis[segment] = snapshot.metrics;
      }
    }

    return kpis;
  },
});

// Seed KPI data for development
export const seedKpiData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get first project for seeding
    const project = await ctx.db.query("projects").first();
    if (!project) return null;

    const now = Date.now();
    const segments = [
      {
        segment: "seo",
        metrics: {
          seoScore: 87,
          keywordsRanking: 234,
          pagesIndexed: 1247,
          backlinks: 89,
          organicTraffic: 12450,
          avgPosition: 8.2,
        },
      },
      {
        segment: "social",
        metrics: {
          postsScheduled: 24,
          engagementRate: 4.2,
          reach: 12500,
          pendingApproval: 6,
          followers: 8900,
          impressions: 45600,
        },
      },
      {
        segment: "content",
        metrics: {
          inPipeline: 18,
          published: 45,
          avgWordCount: 1247,
          approvalRate: 94,
          readingTime: 6.2,
          seoScore: 89,
        },
      },
      {
        segment: "ads",
        metrics: {
          totalSpend: 12450,
          roas: 4.2,
          ctr: 2.8,
          activeCampaigns: 8,
          impressions: 234500,
          conversions: 156,
        },
      },
      {
        segment: "email",
        metrics: {
          openRate: 24.5,
          ctr: 3.8,
          deliverability: 98.2,
          activeJourneys: 12,
          subscribers: 15600,
          unsubscribeRate: 0.8,
        },
      },
      {
        segment: "web",
        metrics: {
          openTickets: 23,
          sprintVelocity: 42,
          cwvScore: 89,
          abTests: 4,
          pageSpeed: 2.1,
          uptime: 99.9,
        },
      },
      {
        segment: "analytics",
        metrics: {
          sessions: 45200,
          conversionRate: 3.4,
          revenue: 89450,
          bounceRate: 42,
          avgSessionDuration: 245,
          pageViews: 123400,
        },
      },
    ];

    const results: any[] = [];
    for (const { segment, metrics } of segments) {
      const kpiId = await ctx.db.insert("kpiSnapshots", {
        projectId: project._id,
        segment,
        date: now,
        metrics,
      });
      results.push(kpiId);
    }

    return results;
  },
});

