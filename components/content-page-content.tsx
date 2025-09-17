"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CheckCircle, XCircle, FileText, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;

type ContentItem = {
  id: string;
  project_id: string | null;
  title: string;
  description?: string | null;
  url?: string | null;
  keywords?: string | null;
  file_url?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export default function ContentPageContent() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; status?: string }>>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [projectStatusById, setProjectStatusById] = useState<Record<string, string>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Local persistence for under-review/disapproved flags to avoid enum issues
  const [underReviewIds, setUnderReviewIds] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("content_under_review") || "{}"); } catch { return {}; }
  });
  const [disapprovedIds, setDisapprovedIds] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("content_disapproved") || "{}"); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem("content_under_review", JSON.stringify(underReviewIds)); }, [underReviewIds]);
  useEffect(() => { localStorage.setItem("content_disapproved", JSON.stringify(disapprovedIds)); }, [disapprovedIds]);

  // Load projects
  useEffect(() => {
    let ignore = false;
    async function loadProjects() {
      const pj = await supabase.from("projects").select("id,name,status").order("created_at", { ascending: false });
      if (!pj.error && pj.data && !ignore) setProjects(pj.data as any);
    }
    loadProjects();
    return () => { ignore = true; };
  }, []);

  // Load content for selected project
  useEffect(() => {
    if (!selectedProject) { setItems([]); return; }
    let ignore = false;
    async function load() {
      const sel = await supabase
        .from("content")
        .select("id,title,project_id,status,file_url,created_at,url,description,keywords")
        .eq("project_id", selectedProject)
        .order("created_at", { ascending: false });
      let rows = (sel.data as any[]) || [];
      if (sel.error && (sel.error.code === "42703" || sel.error.code === "PGRST204")) {
        const retry = await supabase
          .from("content")
          .select("id,title,project_id,status,file_url,created_at")
          .eq("project_id", selectedProject)
          .order("created_at", { ascending: false });
        rows = (retry.data as any[]) || [];
      }
      const pj = await supabase.from("projects").select("id,status").eq("id", selectedProject);
      if (!pj.error && pj.data && pj.data[0]) setProjectStatusById(prev => ({ ...prev, [selectedProject as string]: pj.data![0].status as any }));
      if (!ignore) setItems(rows as any);
    }
    load();
    return () => { ignore = true; };
  }, [selectedProject]);

  // Derived lists and stats
  const inProgressItems = useMemo(() => items.filter(i => i.project_id && projectStatusById[i.project_id] === "active" && !underReviewIds[i.id]), [items, projectStatusById, underReviewIds]);
  const underReviewItems = useMemo(() => items.filter(i => !!underReviewIds[i.id]), [items, underReviewIds]);
  const completedItems = useMemo(() => items.filter(i => (i.status === "published") && !disapprovedIds[i.id]), [items, disapprovedIds]);
  const disapprovedItems = useMemo(() => items.filter(i => !!disapprovedIds[i.id]), [items, disapprovedIds]);

  const statsThisMonth = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const changed = (items as any[]).filter((i: any) => new Date(i.created_at || 0).getTime() >= start).length;
    return { changed, inProgress: inProgressItems.length };
  }, [items, inProgressItems]);

  // Actions
  const startWork = async (projectId: string | null) => {
    if (!projectId) { toast.error("Link to a project first"); return; }
    setProjectStatusById(prev => ({ ...prev, [projectId]: "active" }));
    const upd = await supabase.from("projects").update({ status: "active" as any }).eq("id", projectId);
    if (upd.error) toast.error("Failed to start work"); else toast.success("Moved to In Progress");
  };

  const submitForReview = (id: string) => { setUnderReviewIds(prev => ({ ...prev, [id]: true })); toast.success("Submitted for review"); };
  const approve = async (id: string) => { const r = await supabase.from("content").update({ status: "published" }).eq("id", id); if (r.error) return toast.error("Approve failed"); setUnderReviewIds(p => { const n={...p}; delete n[id]; return n; }); setDisapprovedIds(p => { const n={...p}; delete n[id]; return n; }); setItems(prev => prev.map(i => (i.id===id ? { ...i, status: "published" } : i))); toast.success("Approved"); };
  const disapprove = (id: string) => { setUnderReviewIds(p => { const n={...p}; delete n[id]; return n; }); setDisapprovedIds(p => ({ ...p, [id]: true })); toast.success("Disapproved"); };
  const deleteItem = async (id: string) => { const d = await supabase.from("content").delete().eq("id", id); if (d.error) return toast.error("Delete failed"); setItems(prev => prev.filter(i => i.id !== id)); toast.success("Deleted"); };

  const handleCreate = async (formData: FormData) => {
    if (!selectedProject) { toast.error("Select a project first"); return; }
    const title = (formData.get("title") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const url = (formData.get("url") as string || "").trim();
    const keywords = (formData.get("keywords") as string || "").trim();
    const file = formData.get("file") as File | null;
    if (!title || !description || !url || !keywords || !file) { toast.error("All fields are required"); return; }

    let fileUrl: string | undefined;
    try {
      const ext = file.name?.split(".").pop() || "bin";
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2,10)}.${ext}`;
      const up = await supabase.storage.from(STORAGE_BUCKET as string).upload(path, file as File, { upsert: true });
      if (!up.error) { const { data: pub } = supabase.storage.from(STORAGE_BUCKET as string).getPublicUrl(path as string); fileUrl = (pub && (pub as any).publicUrl) || undefined; }
    } catch {}

    const payload: any = { title, project_id: selectedProject, status: "draft" };
    if (url) payload.url = url; if (description) payload.description = description; if (keywords) payload.keywords = keywords; if (fileUrl) payload.file_url = fileUrl;
    let ins = await supabase.from("content").insert(payload);
    if (ins.error && (ins.error.code === "42703" || ins.error.code === "PGRST204")) { const minimal: any = { title, project_id: selectedProject, status: "draft" }; if (fileUrl) minimal.file_url = fileUrl; ins = await supabase.from("content").insert(minimal); }
    if (ins.error) { toast.error("Failed to create"); return; }
    await supabase.from("projects").update({ status: "active" as any }).eq("id", selectedProject);
    setProjectStatusById(prev => ({ ...prev, [selectedProject]: "active" }));
    setIsCreateDialogOpen(false);
    const { data } = await supabase.from("content").select("id,title,project_id,status,file_url,created_at,url,description,keywords").eq("project_id", selectedProject).order("created_at", { ascending: false });
    setItems((data as any[]) || []);
    toast.success("Content task added to In Progress");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Management</h1>
          <p className="text-gray-400 mt-2">Manage content tasks by project</p>
        </div>
        {selectedProject && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Content Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2A2A2A] border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add Content Task</DialogTitle>
                <DialogDescription className="text-gray-400">All fields are required</DialogDescription>
              </DialogHeader>
              <form action={handleCreate} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Title</Label>
                  <Input id="title" name="title" required className="bg-[#121212] border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea id="description" name="description" required className="bg-[#121212] border-gray-600 text-white" rows={3} />
                </div>
                <div>
                  <Label htmlFor="url" className="text-white">Page URL</Label>
                  <Input id="url" name="url" required className="bg-[#121212] border-gray-600 text-white" placeholder="https://example.com/page" />
                </div>
                <div>
                  <Label htmlFor="keywords" className="text-white">Keywords</Label>
                  <Input id="keywords" name="keywords" required className="bg-[#121212] border-gray-600 text-white" placeholder="keyword1, keyword2" />
                </div>
                <div>
                  <Label htmlFor="file" className="text-white">Upload File</Label>
                  <Input id="file" name="file" type="file" required accept=".doc,.docx,.pdf,.txt,.md,.rtf,.html,.htm,.csv,.xlsx,.ppt,.pptx,.zip,.rar,.7z,image/*,application/*,text/*" className="bg-[#121212] border-gray-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Project Selection */}
      <Card className="bg-[#2A2A2A] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Select Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject || ""} onValueChange={setSelectedProject as any}>
            <SelectTrigger className="bg-[#121212] border-gray-600 text-white">
              <SelectValue placeholder="Choose a project to manage content" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A] border-gray-700 max-h-64">
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id} className="text-white">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Stats */}
      {selectedProject && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#2A2A2A] border-gray-700"><CardContent className="p-6">
            <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-400">Changes this month</p><p className="text-2xl font-bold text-white">{statsThisMonth.changed}</p></div><FileText className="w-8 h-8 text-gray-500" /></div>
          </CardContent></Card>
          <Card className="bg-[#2A2A2A] border-gray-700"><CardContent className="p-6">
            <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-400">In Progress</p><p className="text-2xl font-bold text-yellow-500">{statsThisMonth.inProgress}</p></div><Clock className="w-8 h-8 text-yellow-500" /></div>
          </CardContent></Card>
        </div>
      )}

      {/* Status Lanes */}
      {selectedProject && (
        <div className="space-y-8">
          {[
            { key: "in_progress", title: "In Progress", list: inProgressItems },
            { key: "under_review", title: "Under Review", list: underReviewItems },
            { key: "completed", title: "Completed", list: completedItems },
            { key: "disapproved", title: "Disapproved", list: disapprovedItems },
          ].map(col => (
            <div key={col.key}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-semibold">{col.title}</h2>
                <Badge className="bg-[#1DB954] text-white">{col.list.length}</Badge>
              </div>
              <div className="grid gap-4">
                {col.list.map((content) => (
                  <Card key={content.id} className="bg-[#2A2A2A] border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg">{content.title}</CardTitle>
                          {content.description && <p className="text-gray-400 mt-1 text-sm">{content.description}</p>}
                          {content.keywords && <Badge variant="outline" className="mt-2 text-gray-400 border-gray-600">{content.keywords}</Badge>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400"></div>
                        <div className="flex gap-2">
                          {content.file_url && (
                            <a href={content.file_url} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">View</Button></a>
                          )}
                          {col.key === "in_progress" && (
                            <>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => submitForReview(content.id)}>Submit for Review</Button>
                              <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white" onClick={() => deleteItem(content.id)}>Delete</Button>
                            </>
                          )}
                          {col.key === "under_review" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => approve(content.id)}><CheckCircle className="w-4 h-4 mr-1" />Approve</Button>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => disapprove(content.id)}><XCircle className="w-4 h-4 mr-1" />Disapprove</Button>
                            </>
                          )}
                          {col.key === "completed" && (<Badge className="bg-green-600 text-white">Completed</Badge>)}
                          {col.key === "disapproved" && (<Badge className="bg-red-600 text-white">Disapproved</Badge>)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {col.list.length === 0 && (
                  <Card className="bg-[#2A2A2A] border-gray-700"><CardContent className="flex flex-col items-center justify-center py-12"><FileText className="w-12 h-12 text-gray-500 mb-4" /><p className="text-gray-400 text-center">No items</p></CardContent></Card>
                )}
              </div>
            </div>
          ))}

          {/* If newly created item is draft and project not active yet, allow Start Work */}
          {inProgressItems.length === 0 && items.length > 0 && projectStatusById[selectedProject!] !== "active" && (
            <div className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => startWork(selectedProject)}>Start Work</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


