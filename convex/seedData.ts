import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx, args) => {
    // Check if data already exists
    const existingClients = await ctx.db.query("clients").collect();
    if (existingClients.length > 0) {
      return { message: "Database already seeded" };
    }

    // Create sample clients
    const client1Id = await ctx.db.insert("clients", {
      name: "TechCorp Solutions",
      website: "https://techcorp.com",
      contactEmail: "contact@techcorp.com",
      phone: "+1-555-0123",
      notes: "Leading technology consulting firm",
      metadata: {}
    });

    const client2Id = await ctx.db.insert("clients", {
      name: "Green Energy Co",
      website: "https://greenenergy.com",
      contactEmail: "info@greenenergy.com",
      phone: "+1-555-0456",
      notes: "Renewable energy solutions provider",
      metadata: {}
    });

    const client3Id = await ctx.db.insert("clients", {
      name: "Fashion Forward",
      website: "https://fashionforward.com",
      contactEmail: "hello@fashionforward.com",
      phone: "+1-555-0789",
      notes: "Sustainable fashion brand",
      metadata: {}
    });

    // Create sample projects
    const now = Date.now();
    const oneMonthFromNow = now + (30 * 24 * 60 * 60 * 1000);
    const twoMonthsFromNow = now + (60 * 24 * 60 * 60 * 1000);

    const project1Id = await ctx.db.insert("projects", {
      clientId: client1Id,
      name: "Website Redesign & SEO Optimization",
      slug: "techcorp-website-redesign",
      description: "Complete website overhaul with focus on SEO performance and user experience",
      status: "active",
      startDate: now,
      dueDate: oneMonthFromNow,
      tags: ["seo", "web-design", "ux"],
      metadata: {}
    });

    const project2Id = await ctx.db.insert("projects", {
      clientId: client2Id,
      name: "Content Marketing Campaign",
      slug: "green-energy-content-campaign",
      description: "Comprehensive content strategy to increase organic traffic and brand awareness",
      status: "active",
      startDate: now,
      dueDate: twoMonthsFromNow,
      tags: ["content", "seo", "marketing"],
      metadata: {}
    });

    const project3Id = await ctx.db.insert("projects", {
      clientId: client3Id,
      name: "E-commerce SEO Audit",
      slug: "fashion-forward-seo-audit",
      description: "Technical SEO audit and optimization for e-commerce platform",
      status: "planning",
      startDate: now,
      dueDate: oneMonthFromNow,
      tags: ["seo", "audit", "ecommerce"],
      metadata: {}
    });

    // Create sample tasks
    await ctx.db.insert("tasks", {
      projectId: project1Id,
      title: "Conduct technical SEO audit",
      description: "Analyze current website structure and identify technical SEO issues",
      status: "in_progress",
      priority: "high",
      estimateHours: 8,
      dueDate: now + (7 * 24 * 60 * 60 * 1000), // 1 week from now
      tags: ["seo", "audit"],
      metadata: {}
    });

    await ctx.db.insert("tasks", {
      projectId: project1Id,
      title: "Redesign homepage layout",
      description: "Create new homepage design focusing on conversion optimization",
      status: "todo",
      priority: "high",
      estimateHours: 16,
      dueDate: now + (14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      tags: ["design", "ux"],
      metadata: {}
    });

    await ctx.db.insert("tasks", {
      projectId: project1Id,
      title: "Optimize page load speeds",
      description: "Implement performance optimizations to improve Core Web Vitals",
      status: "done",
      priority: "medium",
      estimateHours: 6,
      tags: ["performance", "seo"],
      metadata: {}
    });

    await ctx.db.insert("tasks", {
      projectId: project2Id,
      title: "Create content calendar",
      description: "Plan 3-month content calendar with target keywords",
      status: "done",
      priority: "high",
      estimateHours: 4,
      tags: ["content", "planning"],
      metadata: {}
    });

    await ctx.db.insert("tasks", {
      projectId: project2Id,
      title: "Write blog post: Solar Energy Benefits",
      description: "1500-word blog post targeting 'solar energy benefits' keyword",
      status: "in_progress",
      priority: "medium",
      estimateHours: 3,
      dueDate: now + (5 * 24 * 60 * 60 * 1000), // 5 days from now
      tags: ["content", "writing"],
      metadata: {}
    });

    // Create sample content
    await ctx.db.insert("content", {
      title: "The Future of Renewable Energy Technology",
      url: "/blog/future-renewable-energy-technology",
      targetKeyword: "renewable energy technology",
      wordCount: 1200,
      status: "published",
      projectId: project2Id,
      createdAt: now - (7 * 24 * 60 * 60 * 1000), // 1 week ago
      updatedAt: now - (2 * 24 * 60 * 60 * 1000), // 2 days ago
    });

    await ctx.db.insert("content", {
      title: "How to Choose the Right Solar Panels",
      url: "/blog/choose-right-solar-panels",
      targetKeyword: "solar panel selection",
      wordCount: 800,
      status: "ready",
      projectId: project2Id,
      createdAt: now - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: now - (1 * 24 * 60 * 60 * 1000), // 1 day ago
    });

    await ctx.db.insert("content", {
      title: "TechCorp Homepage Content",
      url: "/",
      targetKeyword: "technology consulting services",
      wordCount: 500,
      status: "in_progress",
      projectId: project1Id,
      createdAt: now - (5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: now,
    });

    // Create sample SEO items
    await ctx.db.insert("seoItems", {
      projectId: project1Id,
      kind: "Title Tag Optimization",
      status: "ok",
      details: "All pages have optimized title tags under 60 characters",
      priority: "high"
    });

    await ctx.db.insert("seoItems", {
      projectId: project1Id,
      kind: "Meta Description",
      status: "wip",
      details: "Working on meta descriptions for product pages",
      priority: "high"
    });

    await ctx.db.insert("seoItems", {
      projectId: project1Id,
      kind: "Image Alt Text",
      status: "issue",
      details: "Missing alt text on 15 product images",
      priority: "medium"
    });

    await ctx.db.insert("seoItems", {
      projectId: project2Id,
      kind: "Internal Linking",
      status: "ok",
      details: "Content pieces properly interlinked",
      priority: "medium"
    });

    // Create sample backlinks
    await ctx.db.insert("backlinks", {
      projectId: project1Id,
      sourceUrl: "https://techblog.com/best-consulting-firms",
      sourceDomain: "techblog.com",
      discoveredAt: now - (10 * 24 * 60 * 60 * 1000), // 10 days ago
      status: "live",
      anchorText: "leading technology consultants",
      authority: 65,
      notes: "High-quality editorial link"
    });

    await ctx.db.insert("backlinks", {
      projectId: project2Id,
      sourceUrl: "https://energynews.com/renewable-companies",
      sourceDomain: "energynews.com",
      discoveredAt: now - (5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: "live",
      anchorText: "Green Energy Co",
      authority: 72,
      notes: "Brand mention in industry roundup"
    });

    await ctx.db.insert("backlinks", {
      projectId: project1Id,
      sourceUrl: "https://businessdirectory.com/techcorp",
      sourceDomain: "businessdirectory.com",
      discoveredAt: now - (20 * 24 * 60 * 60 * 1000), // 20 days ago
      status: "pending",
      anchorText: "TechCorp Solutions",
      authority: 45,
      notes: "Directory listing pending approval"
    });

    return { 
      message: "Database seeded successfully",
      clients: 3,
      projects: 3,
      tasks: 5,
      content: 3,
      seoItems: 4,
      backlinks: 3
    };
  },
});