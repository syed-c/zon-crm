import { supabase } from "@/lib/supabaseClient";

export type DashboardMetrics = {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueTasks: number;
  activeClients: number;
  contentPublished: number;
  backlinksEarned: number;
};

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const [projectsCount, activeCount, completedCount, overdueCount, clientsCount, contentCount, backlinksCount] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact" }),
    supabase.from("projects").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("projects").select("id", { count: "exact" }).eq("status", "completed"),
    supabase.from("tasks").select("id", { count: "exact" }).eq("status", "overdue"),
    supabase.from("clients").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("content").select("id", { count: "exact" }).eq("status", "published"),
    supabase.from("backlinks").select("id", { count: "exact" }),
  ]);

  const safeCount = (r: any) => r.count ?? 0;

  return {
    totalProjects: safeCount(projectsCount),
    activeProjects: safeCount(activeCount),
    completedProjects: safeCount(completedCount),
    overdueTasks: safeCount(overdueCount),
    activeClients: safeCount(clientsCount),
    contentPublished: safeCount(contentCount),
    backlinksEarned: safeCount(backlinksCount),
  };
}

export type TaskStatusSlice = { name: string; value: number; color: string };

export async function fetchTaskStatusDistribution(): Promise<TaskStatusSlice[]> {
  const statuses = [
    { key: "completed", label: "Completed", color: "#1DB954" },
    { key: "in_progress", label: "In Progress", color: "#FFD700" },
    { key: "pending", label: "Pending", color: "#FF4C4C" },
    { key: "blocked", label: "Blocked", color: "#808080" },
  ];

  const results = await Promise.all(
    statuses.map((s) => supabase.from("tasks").select("id", { count: "exact" }).eq("status", s.key))
  );

  return statuses.map((s, i) => ({ name: s.label, value: results[i].count ?? 0, color: s.color }));
}

export type ActivityItem = {
  id: string;
  type: string;
  user: string | null;
  userInitials: string;
  action: string;
  target: string;
  project: string | null;
  time: string;
};

export async function fetchRecentActivity(limit = 10): Promise<ActivityItem[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("id, type, user, action, target, project, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((r) => ({
    id: String(r.id),
    type: r.type,
    user: r.user,
    userInitials: (r.user?.match(/\b\w/g) || []).slice(0, 2).join("") || "--",
    action: r.action,
    target: r.target,
    project: r.project,
    time: new Date(r.created_at).toLocaleString(),
  }));
}


