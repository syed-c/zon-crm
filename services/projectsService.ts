import { supabase } from "@/lib/supabaseClient";

export type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  client_id: string | null;
  status: "active" | "completed" | "on-hold" | "archived" | string;
  due_date: string | null; // ISO string
  created_at: string;
  slug?: string | null;
  tags?: string[] | null;
};

export type ProjectWithStats = ProjectRow & {
  client_name: string | null;
  task_total: number;
  task_completed: number;
  progress_pct: number; // 0-100
};

export async function fetchProjectsWithStats(): Promise<ProjectWithStats[]> {
  const [{ data: projects, error: pErr }, { data: clients, error: cErr }] = await Promise.all([
    supabase.from("projects").select("id,name,client_id,status,created_at,slug,description,tags,due_date"),
    supabase.from("clients").select("id,name"),
  ]);

  if (pErr) throw pErr;
  if (!projects) return [];

  const clientMap = new Map((clients || []).map((c: any) => [c.id, c.name]));

  // Fetch task counts grouped by project and status
  // Aggregate task counts client-side (portable)
  const { data: tasks, error: tErr } = await supabase
    .from("tasks")
    .select("project_id,status");

  if (tErr) throw tErr;
  const countByProject: Record<string, { total: number; completed: number }> = {};
  (tasks || []).forEach((r: any) => {
    const entry = (countByProject[r.project_id] ||= { total: 0, completed: 0 });
    entry.total += 1;
    if (r.status === "completed") entry.completed += 1;
  });

  return projects.map((p: any) => {
    const counts = countByProject[p.id] || { total: 0, completed: 0 };
    const progress = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;
    return {
      id: p.id,
      name: p.name,
      description: (p as any).description ?? null,
      client_id: p.client_id ?? null,
      status: p.status,
      due_date: (p as any).due_date ?? null,
      created_at: p.created_at,
      slug: (p as any).slug ?? null,
      tags: (p as any).tags ?? null,
      client_name: clientMap.get(p.client_id) ?? null,
      task_total: counts.total,
      task_completed: counts.completed,
      progress_pct: progress,
    } as ProjectWithStats;
  });
}

export async function createProject(input: {
  name: string;
  description?: string;
  clientId: string;
  status: "active" | "completed" | "on-hold" | "archived";
  dueDate?: string; // yyyy-mm-dd
  tags?: string[];
  slug: string;
}): Promise<string> {
  // Ensure unique slug by appending -2, -3, ... if exists
  let candidate = input.slug;
  let suffix = 1;
  while (true) {
    const { data: existing, error: existErr } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (existErr) break;
    if (!existing) break;
    suffix += 1;
    candidate = `${input.slug}-${suffix}`;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: input.name,
      description: input.description ?? null,
      client_id: input.clientId,
      status: input.status,
      due_date: input.dueDate ?? null,
      tags: input.tags ?? null,
      slug: candidate,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data!.id as string;
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectWithStats | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("id,name,client_id,status,created_at,slug,description,tags,due_date")
    .eq("slug", slug)
    .single();
  if (error) return null;
  // Attach minimal stats for now
  return {
    id: data.id,
    name: data.name,
    description: (data as any).description ?? null,
    client_id: data.client_id ?? null,
    status: data.status,
    due_date: (data as any).due_date ?? null,
    created_at: data.created_at,
    slug: (data as any).slug ?? null,
    tags: (data as any).tags ?? null,
    client_name: null,
    task_total: 0,
    task_completed: 0,
    progress_pct: 0,
  } as ProjectWithStats;
}

export async function deleteProject(idOrSlug: string): Promise<void> {
  // Try delete by id first
  const byId = await supabase
    .from("projects")
    .delete()
    .eq("id", idOrSlug)
    .select("id");

  if (byId.error) throw byId.error;
  if (byId.data && byId.data.length > 0) return;

  // If nothing deleted, try by slug
  const bySlug = await supabase
    .from("projects")
    .delete()
    .eq("slug", idOrSlug)
    .select("id");

  if (bySlug.error) throw bySlug.error;
}

export async function fetchProjectById(id: string): Promise<ProjectWithStats | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("id,name,client_id,status,created_at,slug,description,tags,due_date")
    .eq("id", id)
    .single();
  if (error) return null;
  return {
    id: data.id,
    name: data.name,
    description: (data as any).description ?? null,
    client_id: data.client_id ?? null,
    status: data.status,
    due_date: (data as any).due_date ?? null,
    created_at: data.created_at,
    slug: (data as any).slug ?? null,
    tags: (data as any).tags ?? null,
    client_name: null,
    task_total: 0,
    task_completed: 0,
    progress_pct: 0,
  } as ProjectWithStats;
}


