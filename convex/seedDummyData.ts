import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDummyData = mutation({
  args: {},
  handler: async (ctx, args) => {
    // Create dummy clients
    const client1 = await ctx.db.insert("clients", {
      name: "TechCorp Solutions",
      contactEmail: "john@techcorp.com",
      phone: "+971 50 123 4567",
      website: "https://techcorp.com",
      notes: "Technology company specializing in software solutions",
      metadata: {
        industry: "Technology",
        contactName: "John Smith",
        status: "active"
      }
    });

    const client2 = await ctx.db.insert("clients", {
      name: "Fashion Forward LLC",
      contactEmail: "sarah@fashionforward.com",
      phone: "+971 55 987 6543",
      website: "https://fashionforward.com",
      notes: "Fashion and retail company with focus on sustainable clothing",
      metadata: {
        industry: "Fashion & Retail",
        contactName: "Sarah Johnson",
        status: "active"
      }
    });

    const client3 = await ctx.db.insert("clients", {
      name: "HealthPlus Medical",
      contactEmail: "ahmed@healthplus.ae",
      phone: "+971 52 456 7890",
      website: "https://healthplus.ae",
      notes: "Healthcare provider offering comprehensive medical services",
      metadata: {
        industry: "Healthcare",
        contactName: "Dr. Ahmed Hassan",
        status: "active"
      }
    });

    // Create dummy projects
    const project1 = await ctx.db.insert("projects", {
      clientId: client1,
      name: "TechCorp SEO Campaign",
      slug: "techcorp-seo-campaign",
      description: "Comprehensive SEO optimization for TechCorp's main website and blog",
      status: "active",
      startDate: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
      dueDate: Date.now() + (60 * 24 * 60 * 60 * 1000), // 60 days from now
      tags: ["SEO", "Content", "Technical"],
      metadata: {}
    });

    const project2 = await ctx.db.insert("projects", {
      clientId: client2,
      name: "Fashion Forward Social Media",
      slug: "fashion-forward-social",
      description: "Complete social media management and content creation for Fashion Forward",
      status: "active",
      startDate: Date.now() - (15 * 24 * 60 * 60 * 1000), // 15 days ago
      dueDate: Date.now() + (45 * 24 * 60 * 60 * 1000), // 45 days from now
      tags: ["Social Media", "Content", "Design"],
      metadata: {}
    });

    const project3 = await ctx.db.insert("projects", {
      clientId: client3,
      name: "HealthPlus Digital Marketing",
      slug: "healthplus-digital-marketing",
      description: "Full digital marketing strategy including SEO, PPC, and content marketing",
      status: "active",
      startDate: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
      dueDate: Date.now() + (90 * 24 * 60 * 60 * 1000), // 90 days from now
      tags: ["SEO", "PPC", "Content", "Email"],
      metadata: {}
    });

    // Create dummy tasks for each project
    const tasks = [
      // TechCorp SEO Campaign tasks
      {
        projectId: project1,
        title: "Technical SEO Audit",
        description: "Complete technical SEO audit of the main website",
        status: "completed",
        priority: "high",
        dueDate: Date.now() + (7 * 24 * 60 * 60 * 1000),
        metadata: { segment: "seo", type: "audit" }
      },
      {
        projectId: project1,
        title: "Keyword Research & Strategy",
        description: "Research target keywords and create content strategy",
        status: "in_progress",
        priority: "high",
        dueDate: Date.now() + (14 * 24 * 60 * 60 * 1000),
        metadata: { segment: "seo", type: "keyword-research" }
      },
      {
        projectId: project1,
        title: "Create 5 SEO-optimized blog posts",
        description: "Write and optimize 5 blog posts targeting main keywords",
        status: "pending",
        priority: "medium",
        dueDate: Date.now() + (21 * 24 * 60 * 60 * 1000),
        metadata: { segment: "content", type: "blog-post" }
      },
      {
        projectId: project1,
        title: "Link Building Campaign",
        description: "Execute link building strategy to acquire 20 high-quality backlinks",
        status: "pending",
        priority: "medium",
        dueDate: Date.now() + (30 * 24 * 60 * 60 * 1000),
        metadata: { segment: "seo", type: "backlinks" }
      },

      // Fashion Forward Social Media tasks
      {
        projectId: project2,
        title: "Social Media Strategy Development",
        description: "Create comprehensive social media strategy and content calendar",
        status: "completed",
        priority: "high",
        dueDate: Date.now() + (3 * 24 * 60 * 60 * 1000),
        metadata: { segment: "social", type: "strategy" }
      },
      {
        projectId: project2,
        title: "Create 30 Social Media Posts",
        description: "Design and create 30 engaging social media posts for Instagram and Facebook",
        status: "in_progress",
        priority: "high",
        dueDate: Date.now() + (10 * 24 * 60 * 60 * 1000),
        metadata: { segment: "social", type: "content-creation" }
      },
      {
        projectId: project2,
        title: "Launch Instagram Ad Campaign",
        description: "Set up and launch targeted Instagram advertising campaign",
        status: "pending",
        priority: "medium",
        dueDate: Date.now() + (14 * 24 * 60 * 60 * 1000),
        metadata: { segment: "social", type: "campaign" }
      },

      // HealthPlus Digital Marketing tasks
      {
        projectId: project3,
        title: "Healthcare SEO Audit",
        description: "Specialized SEO audit for healthcare website compliance",
        status: "in_progress",
        priority: "high",
        dueDate: Date.now() + (5 * 24 * 60 * 60 * 1000),
        metadata: { segment: "seo", type: "audit" }
      },
      {
        projectId: project3,
        title: "Google Ads Setup",
        description: "Set up Google Ads campaigns for healthcare services",
        status: "pending",
        priority: "high",
        dueDate: Date.now() + (12 * 24 * 60 * 60 * 1000),
        metadata: { segment: "ads", type: "ppc-setup" }
      },
      {
        projectId: project3,
        title: "Patient Newsletter Setup",
        description: "Create automated email newsletter for patient engagement",
        status: "pending",
        priority: "medium",
        dueDate: Date.now() + (20 * 24 * 60 * 60 * 1000),
        metadata: { segment: "email", type: "newsletter" }
      }
    ];

    // Insert all tasks
    for (const task of tasks) {
      await ctx.db.insert("tasks", task);
    }

    // Create KPI snapshots for projects
    const kpiData = [
      // TechCorp SEO metrics
      {
        projectId: project1,
        segment: "seo",
        date: Date.now() - (7 * 24 * 60 * 60 * 1000),
        metrics: {
          seoScore: 75,
          keywordRankings: 45,
          organicTraffic: 12500,
          backlinks: 89,
          technicalIssues: 3,
          pageSpeed: 85
        }
      },
      {
        projectId: project1,
        segment: "content",
        date: Date.now() - (7 * 24 * 60 * 60 * 1000),
        metrics: {
          postsPublished: 8,
          avgReadingTime: 4.2,
          socialShares: 156,
          comments: 23,
          contentScore: 88
        }
      },

      // Fashion Forward Social metrics
      {
        projectId: project2,
        segment: "social",
        date: Date.now() - (7 * 24 * 60 * 60 * 1000),
        metrics: {
          followers: 15420,
          engagement: 6.8,
          reach: 45600,
          impressions: 89300,
          postsPublished: 12,
          storiesPosted: 8
        }
      },

      // HealthPlus Digital metrics
      {
        projectId: project3,
        segment: "seo",
        date: Date.now() - (3 * 24 * 60 * 60 * 1000),
        metrics: {
          seoScore: 68,
          keywordRankings: 32,
          organicTraffic: 8900,
          backlinks: 45,
          technicalIssues: 7,
          pageSpeed: 78
        }
      },
      {
        projectId: project3,
        segment: "ads",
        date: Date.now() - (3 * 24 * 60 * 60 * 1000),
        metrics: {
          adSpend: 2500,
          clicks: 890,
          impressions: 45600,
          ctr: 1.95,
          cpc: 2.81,
          conversions: 23,
          roas: 3.2
        }
      }
    ];

    // Insert KPI snapshots
    for (const kpi of kpiData) {
      await ctx.db.insert("kpiSnapshots", kpi);
    }

    return {
      message: "Dummy data seeded successfully",
      clients: 3,
      projects: 3,
      tasks: tasks.length,
      kpiSnapshots: kpiData.length
    };
  },
});

