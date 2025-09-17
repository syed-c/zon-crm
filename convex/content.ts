import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

const statusValidator = v.union(
  v.literal("draft"),
  v.literal("in_progress"),
  v.literal("ready"),
  v.literal("published")
);

// ========== Queries ==========

export const getContentById = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const content: Doc<"content"> | null = await ctx.db.get(args.contentId);
    return content;
  },
});

export const listContentsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const contents: Doc<"content">[] = await ctx.db
      .query("content")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
    return contents;
  },
});

export const listContentsByStatus = query({
  args: { status: statusValidator },
  handler: async (ctx, args) => {
    const contents: Doc<"content">[] = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
    return contents;
  },
});

export const listAllContent = query({
  args: {},
  handler: async (ctx, args) => {
    const contents: Doc<"content">[] = await ctx.db
      .query("content")
      .order("desc")
      .collect();
    return contents;
  },
});

// List pending approvals for the current user (editor) or by role (manager)
export const listPendingApprovalsForUser = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const userId = args.userId ?? (await getAuthUserId(ctx));
    if (!userId) return [];
    
    const user = await ctx.db.get(userId);
    if (!user) return [];
    
    if (user.role === "manager") {
      // Manager sees content that has an editor approval but is not yet published
      const ready = await ctx.db
        .query("content")
        .withIndex("by_status", (q) => q.eq("status", "ready"))
        .collect();
      return ready;
    } else {
      // Editor - get all content and filter by editorId and status
      const allContent = await ctx.db.query("content").collect();
      const assigned = allContent.filter((c) => c.editorId === userId && c.status === "ready");
      return assigned;
    }
  },
});

export const listContentByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const contents: Doc<"content">[] = await ctx.db
      .query("content")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
    return contents;
  },
});

// ========== Mutations ==========

export const createContent = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    targetKeyword: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    writerId: v.optional(v.id("users")),
    editorId: v.optional(v.id("users")),
    status: v.optional(statusValidator),
    deadline: v.optional(v.number()),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const status = args.status ?? "draft";
    const id = await ctx.db.insert("content", {
      title: args.title,
      url: args.url,
      targetKeyword: args.targetKeyword,
      wordCount: args.wordCount,
      writerId: args.writerId,
      editorId: args.editorId,
      status,
      deadline: args.deadline,
      projectId: args.projectId,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const patchContent = mutation({
  args: {
    contentId: v.id("content"),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    targetKeyword: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    writerId: v.optional(v.id("users")),
    editorId: v.optional(v.id("users")),
    status: v.optional(statusValidator),
    deadline: v.optional(v.number()),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthUserId(ctx);
    const existing: Doc<"content"> | null = await ctx.db.get(args.contentId);
    if (!existing) throw new Error("Content not found");
    
    // Authorization: allow writer/editor/manager to patch
    if (currentUser) {
      const user = await ctx.db.get(currentUser);
      if (
        currentUser !== existing.writerId &&
        currentUser !== existing.editorId &&
        user?.role !== "manager"
      ) {
        throw new Error("Not authorized to edit this content");
      }
    } else {
      throw new Error("Authentication required");
    }

    const now = Date.now();
    await ctx.db.patch(args.contentId, {
      ...(args.title !== undefined ? { title: args.title } : {}),
      ...(args.url !== undefined ? { url: args.url } : {}),
      ...(args.targetKeyword !== undefined ? { targetKeyword: args.targetKeyword } : {}),
      ...(args.wordCount !== undefined ? { wordCount: args.wordCount } : {}),
      ...(args.writerId !== undefined ? { writerId: args.writerId } : {}),
      ...(args.editorId !== undefined ? { editorId: args.editorId } : {}),
      ...(args.status !== undefined ? { status: args.status } : {}),
      ...(args.deadline !== undefined ? { deadline: args.deadline } : {}),
      ...(args.projectId !== undefined ? { projectId: args.projectId } : {}),
      updatedAt: now,
    });
    return null;
  },
});

export const deleteContent = mutation({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthUserId(ctx);
    const existing = await ctx.db.get(args.contentId);
    if (!existing) throw new Error("Not found");
    if (!currentUser) throw new Error("Authentication required");
    
    const userRecord = await ctx.db.get(currentUser);
    // Only writer or manager can delete
    if (currentUser !== existing.writerId && userRecord?.role !== "manager") {
      throw new Error("Not authorized to delete this content");
    }
    
    await ctx.db.delete(args.contentId);
    return null;
  },
});

// ========== Workflow Mutations (public) ==========

export const submitForReview = mutation({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");
    
    const content = await ctx.db.get(args.contentId);
    if (!content) throw new Error("Content not found");
    if (content.writerId !== userId) throw new Error("Only the assigned writer can submit");
    
    await ctx.db.patch(args.contentId, { status: "ready", updatedAt: Date.now() });
    return null;
  },
});

export const editorDecision = mutation({
  args: {
    contentId: v.id("content"),
    decision: v.union(v.literal("approve"), v.literal("reject")),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");
    
    const content = await ctx.db.get(args.contentId);
    if (!content) throw new Error("Content not found");
    if (content.editorId !== userId) throw new Error("Only the assigned editor can perform this action");

    // record approval into contentApprovals
    await ctx.db.insert("contentApprovals", {
      contentId: args.contentId,
      approverId: userId,
      role: "editor",
      decision: args.decision === "approve" ? "approved" : "rejected",
      comment: args.comment,
      time: Date.now(),
    });

    if (args.decision === "approve") {
      // Keep status 'ready' — manager must publish
      await ctx.db.patch(args.contentId, { updatedAt: Date.now() });
    } else {
      // send back to writer for edits
      await ctx.db.patch(args.contentId, { status: "in_progress", updatedAt: Date.now() });
    }

    return null;
  },
});

// Manager publishes content. Requires at least one editor approval.
export const managerPublish = mutation({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");
    
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "manager") throw new Error("Only managers may publish");

    // verify editor approval exists
    const approvals = await ctx.db
      .query("contentApprovals")
      .withIndex("by_content", (q) => q.eq("contentId", args.contentId))
      .collect();

    const hasEditorApproval = approvals.some((a) => a.role === "editor" && a.decision === "approved");
    if (!hasEditorApproval) throw new Error("Editor approval required before manager can publish");

    // Directly publish the content
    await ctx.db.patch(args.contentId, { status: "published", updatedAt: Date.now() });
    
    // record manager approval
    await ctx.db.insert("contentApprovals", {
      contentId: args.contentId,
      approverId: userId,
      role: "manager",
      decision: "approved",
      comment: undefined,
      time: Date.now(),
    });

    return null;
  },
});


