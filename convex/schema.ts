import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  // Convex-managed auth tables (users, authSessions, etc.)
  ...authTables,

  // Extended user profile with role
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.string()), // manager, editor, writer, seo_specialist, link_builder, auditor
  }).index("email", ["email"]),

  // Clients (businesses)
  clients: defineTable({
    name: v.string(),
    website: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.any())),
  }).index("by_name", ["name"])
    .index("by_email", ["contactEmail"]),

  // Projects: each belongs to a client, may have status/priority
  projects: defineTable({
    clientId: v.id("clients"),
    name: v.string(),
    slug: v.string(), // human-friendly unique-ish slug (enforce uniqueness per-client in app logic)
    description: v.optional(v.string()),
    status: v.optional(v.string()), // e.g., active, archived
    startDate: v.optional(v.number()), // ms since epoch
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.record(v.string(), v.any())),
  }).index("by_client", ["clientId"])
    .index("by_client_and_status", ["clientId", "status"])
    .index("by_slug_and_client", ["slug", "clientId"])
    .index("by_due_date", ["dueDate"]),

  // Team members (people on projects). Optional link to auth users.
  teamMembers: defineTable({
    userId: v.optional(v.id("users")), // link to auth user doc when available
    name: v.string(),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.any())),
  }).index("by_email", ["email"])
    .index("by_user", ["userId"]),

  // Tasks: project-scoped, assignable, priority, status
  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()), // e.g., todo, in_progress, done, blocked
    priority: v.optional(v.string()), // low, medium, high
    assigneeId: v.optional(v.id("teamMembers")),
    createdBy: v.optional(v.id("teamMembers")),
    estimateHours: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    blockedReason: v.optional(v.string()),
    // NOTE: keep dependency edges in taskDependencies table for efficient queries
    metadata: v.optional(v.record(v.string(), v.any())),
  }).index("by_project", ["projectId"])
    .index("by_project_and_status", ["projectId", "status"])
    .index("by_project_and_assignee", ["projectId", "assigneeId"])
    .index("by_assignee", ["assigneeId"])
    .index("by_due_date_and_project", ["dueDate", "projectId"])
    .index("by_priority_and_project", ["priority", "projectId"]),

  // Task dependency edges (directed): from -> to (from depends on to)
  taskDependencies: defineTable({
    fromTaskId: v.id("tasks"),
    toTaskId: v.id("tasks"),
  }).index("by_from", ["fromTaskId"])
    .index("by_to", ["toTaskId"]),

  // Content: articles, briefs, pages. Full-text search on body.
  content: defineTable({
    title: v.string(),
    url: v.string(),
    targetKeyword: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    writerId: v.optional(v.id("users")),
    editorId: v.optional(v.id("users")),
    status: v.string(), // draft, in_progress, ready, published
    deadline: v.optional(v.number()),
    projectId: v.optional(v.id("projects")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_project", ["projectId"])
    .index("by_status", ["status"])
    .index("by_writer", ["writerId"])
    .index("by_editor", ["editorId"]),

  // Content approval workflow tracking
  contentApprovals: defineTable({
    contentId: v.id("content"),
    approverId: v.id("users"),
    role: v.union(v.literal("editor"), v.literal("manager")),
    decision: v.union(v.literal("approved"), v.literal("rejected")),
    comment: v.optional(v.string()),
    time: v.number(),
  }).index("by_content", ["contentId"])
    .index("by_approver", ["approverId"]),

  // On-page SEO checklist items (per content or project-level items)
  seoItems: defineTable({
    projectId: v.id("projects"),
    contentId: v.optional(v.id("content")), // optional link to content
    kind: v.string(), // e.g., title_tag, meta_description, h1, alt_text
    status: v.optional(v.string()), // ok, issue, wip
    details: v.optional(v.string()),
    ownerId: v.optional(v.id("teamMembers")),
    priority: v.optional(v.string()),
  }).index("by_project", ["projectId"])
    .index("by_content", ["contentId"])
    .index("by_project_and_kind", ["projectId", "kind"])
    .index("by_status_and_project", ["status", "projectId"]),

  // Backlinks: origin, target content, domain, status
  backlinks: defineTable({
    projectId: v.id("projects"),
    sourceUrl: v.string(),
    sourceDomain: v.string(),
    targetContentId: v.optional(v.id("content")),
    discoveredAt: v.optional(v.number()),
    status: v.optional(v.string()), // live, lost, pending
    anchorText: v.optional(v.string()),
    authority: v.optional(v.number()), // domain authority / score
    notes: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.any())),
  }).index("by_project", ["projectId"])
    .index("by_project_and_status", ["projectId", "status"])
    .index("by_domain", ["sourceDomain"])
    .index("by_discovered_date", ["discoveredAt"]),

  // KPI snapshots for tracking metrics over time
  kpiSnapshots: defineTable({
    projectId: v.id("projects"),
    segment: v.string(), // seo, social, content, ads, email, web, analytics
    date: v.number(),
    metrics: v.record(v.string(), v.any()),
  }).index("by_project", ["projectId"])
    .index("by_project_and_segment", ["projectId", "segment"])
    .index("by_date", ["date"]),

  // User permissions for granular access control
  userPermissions: defineTable({
    userId: v.id("users"),
    module: v.string(), // projects, seo, content, etc.
    capability: v.string(), // view, edit, approve, export
    projectId: v.optional(v.id("projects")), // project-specific permissions
    granted: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_user_and_module", ["userId", "module"])
    .index("by_project", ["projectId"]),

  // Activity logs for audit trail
  activityLogs: defineTable({
    userId: v.id("users"),
    projectId: v.optional(v.id("projects")),
    entity: v.string(), // table name
    entityId: v.string(), // record ID
    action: v.string(), // create, update, delete, view
    payload: v.optional(v.record(v.string(), v.any())),
    timestamp: v.number(),
  }).index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_entity", ["entity", "entityId"]),

  // Notifications for users
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.string(), // info, warning, error, success
    read: v.boolean(),
    projectId: v.optional(v.id("projects")),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "read"])
    .index("by_project", ["projectId"]),

  // OTP codes for authentication
  otpCodes: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
  }).index("by_email", ["email"])
    .index("by_email_and_code", ["email", "code"])
    .index("by_expires_at", ["expiresAt"]),

  // User sessions for OTP authentication
  userSessions: defineTable({
    email: v.string(),
    sessionId: v.string(),
    expiresAt: v.number(),
    isActive: v.boolean(),
  }).index("by_email", ["email"])
    .index("by_session_id", ["sessionId"])
    .index("by_expires_at", ["expiresAt"]),
})

