import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get unread notifications for current user
export const getUnreadNotifications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) => q.eq("userId", userId).eq("read", false))
      .order("desc")
      .take(10);

    return notifications;
  },
});

// Get all notifications for current user
export const getUserNotifications = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = args.limit || 50;
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return notifications;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found or access denied");
    }

    await ctx.db.patch(args.notificationId, { read: true });
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) => q.eq("userId", userId).eq("read", false))
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { read: true });
    }

    return unreadNotifications.length;
  },
});

// Create notification
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.string(),
    projectId: v.optional(v.id("projects")),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    return await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.title,
      message: args.message,
      type: args.type,
      read: false,
      projectId: args.projectId,
      entityType: args.entityType,
      entityId: args.entityId,
      createdAt: Date.now(),
    });
  },
});

// Delete notification
export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found or access denied");
    }

    await ctx.db.delete(args.notificationId);
  },
});

// Seed notifications for development
export const seedNotifications = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const notifications = [
      {
        title: "Task Assigned",
        message: "You have been assigned a new SEO audit task",
        type: "info",
      },
      {
        title: "Deadline Approaching",
        message: "Content review is due tomorrow",
        type: "warning",
      },
      {
        title: "Project Completed",
        message: "Website optimization project has been completed",
        type: "success",
      },
    ];

    const results: any[] = [];
    for (const notification of notifications) {
      const notificationId = await ctx.db.insert("notifications", {
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: false,
        createdAt: Date.now(),
      });
      results.push(notificationId);
    }

    return results;
  },
});
