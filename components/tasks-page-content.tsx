

"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Target, Clock, CheckCircle, AlertCircle, Users, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const TASK_STATUSES = [
  { value: "pending", label: "To Do", color: "bg-gray-500", icon: Clock },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-500", icon: Clock },
  { value: "completed", label: "Done", color: "bg-green-500", icon: CheckCircle },
  { value: "blocked", label: "Blocked", color: "bg-red-500", icon: AlertCircle },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-green-600" },
  { value: "medium", label: "Medium", color: "bg-yellow-600" },
  { value: "high", label: "High", color: "bg-red-600" },
];

export default function TasksPageContent() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [tasks, setTasks] = useState<Array<any>>([]);
  const [members, setMembers] = useState<Array<{ id: string; name: string }>>([]);
  const [taskStats, setTaskStats] = useState<null | {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    blocked: number;
    completionRate: number;
  }>(null);

  // Load projects on mount
  useEffect(() => {
    let ignore = false;
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id,name")
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Failed to load projects");
        console.error(error);
        return;
      }
      if (!ignore) setProjects(data || []);
    }
    loadProjects();
    return () => {
      ignore = true;
    };
  }, []);

  // Load team members (try team_members, fallback to users)
  useEffect(() => {
    let ignore = false;
    async function loadMembers() {
      // Try team_members
      let list: Array<{ id: string; name: string }> = [];
      let errorAny: any = null;
      const tm = await supabase.from("team_members").select("id,name").order("name", { ascending: true });
      if (!tm.error && tm.data) {
        list = tm.data as any;
      } else {
        errorAny = tm.error;
        // Fallback to users table
        const u = await supabase.from("users").select("id,name,email").order("name", { ascending: true });
        if (!u.error && u.data) {
          list = (u.data as any).map((r: any) => ({ id: r.id, name: r.name || r.email || r.id }));
        }
      }
      if (!ignore) setMembers(list);
      if (!list.length && errorAny) {
        // Silently ignore if neither table exists; UI will hide selector
        // console.warn("No members table found", errorAny);
      }
    }
    loadMembers();
    return () => {
      ignore = true;
    };
  }, []);

  // Load tasks when project changes
  useEffect(() => {
    if (!selectedProject) {
      setTasks([]);
      setTaskStats(null);
      return;
    }
    let ignore = false;
    async function loadTasks() {
      setIsLoading(true);
      // First try with optional columns (description, assignee_id). If it fails due to missing columns, retry without.
      let sel = "id, project_id, title, description, assignee_id, status, due_date, created_at";
      let query = await supabase
        .from("tasks")
        .select(sel)
        .eq("project_id", selectedProject)
        .order("created_at", { ascending: false });

      let data = query.data;
      let error = query.error;

      if (error && (error.code === "42703" || error.code === "PGRST204")) {
        // Retry without missing columns
        const retry = await supabase
          .from("tasks")
          .select("id, project_id, title, status, due_date, created_at")
          .eq("project_id", selectedProject)
          .order("created_at", { ascending: false });
        data = retry.data as any;
        error = retry.error as any;
      }
      setIsLoading(false);
      if (error) {
        toast.error("Failed to load tasks");
        console.error(error);
        return;
      }
      if (ignore) return;
      const rows = (data as any[]) || [];
      setTasks(rows);
      const total = rows.length;
      const count = (key: string) => rows.filter((t: any) => (t.status || "pending") === key).length;
      const done = count("completed");
      const stats = {
        total,
        todo: count("pending"),
        inProgress: count("in_progress"),
        done,
        blocked: count("blocked"),
        completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      };
      setTaskStats(stats);
    }
    loadTasks();
    return () => {
      ignore = true;
    };
  }, [selectedProject]);

  const getStatusConfig = (status: string) => {
    return TASK_STATUSES.find(s => s.value === status) || TASK_STATUSES[0];
  };

  const getPriorityBadge = (priority: string) => {
    const config = PRIORITIES.find(p => p.value === priority) || PRIORITIES[1];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const handleCreateTask = async (formData: FormData) => {
    if (!selectedProject) return;
    const title = (formData.get("title") as string) || "";
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const description = (formData.get("description") as string) || null; // may not exist in DB; omit if column missing
    const priority = ((formData.get("priority") as string) || "medium") as string; // UI-only if DB has no column
    const dueDateStr = (formData.get("dueDate") as string) || "";
    const dueDate = dueDateStr ? new Date(dueDateStr).toISOString() : null;
    const assigneeId = (formData.get("assigneeId") as string) || "";

    const insertPayload: Record<string, any> = {
      project_id: selectedProject,
      title,
      priority,
      status: "pending",
    };
    // Remove priority if your table doesn't have it
    delete insertPayload.priority;
    // Only attach description if your table has it; comment out by default
    if (description) insertPayload.description = description;
    if (dueDate) insertPayload.due_date = dueDate;
    if (assigneeId) insertPayload.assignee_id = assigneeId;

    // Try insert; if it fails due to unknown columns, retry without them
    let insert = await supabase.from("tasks").insert(insertPayload);
    if (insert.error && (insert.error.code === "PGRST204" || insert.error.code === "42703")) {
      const retryPayload = { ...insertPayload } as any;
      if (insert.error.message?.includes("description")) delete retryPayload.description;
      if (insert.error.message?.includes("assignee") || insert.error.message?.includes("assignee_id")) delete retryPayload.assignee_id;
      insert = await supabase.from("tasks").insert(retryPayload);
    }
    if (insert.error) {
      toast.error("Failed to create task");
      console.error(insert.error);
      return;
    }
    toast.success("Task created successfully!");
    setIsCreateDialogOpen(false);
    // reload
    if (selectedProject) {
      const { data } = await supabase
        .from("tasks")
        .select("id, project_id, title, description, assignee_id, status, due_date, created_at")
        .eq("project_id", selectedProject)
        .order("created_at", { ascending: false });
      setTasks(data || []);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId);
    if (error) {
      toast.error("Failed to update task");
      console.error(error);
      return;
    }
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status } : t)));
    toast.success("Task status updated!");
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);
    if (error) {
      toast.error("Failed to delete task");
      console.error(error);
      return;
    }
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.success("Task deleted successfully!");
  };

  // Group tasks by status for Kanban view
  const tasksByStatus = useMemo(() => {
    return TASK_STATUSES.reduce((acc, status) => {
      acc[status.value] = (tasks && Array.isArray(tasks)) ? tasks.filter(task => (task.status || "todo") === status.value) : [];
      return acc;
    }, {} as Record<string, any[]>);
  }, [tasks]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Task Management</h1>
          <p className="text-gray-400 mt-2">Manage tasks with Kanban board and team collaboration</p>
        </div>
        
        {selectedProject && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2A2A2A] border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Task</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Add a new task to the project
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateTask} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Task Title</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    className="bg-[#121212] border-gray-600 text-white"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="bg-[#121212] border-gray-600 text-white"
                    placeholder="Task description"
                    rows={3}
                  />
                </div>
                {members.length > 0 && (
                  <div>
                    <Label htmlFor="assigneeId" className="text-white">Assign To</Label>
                    <Select name="assigneeId">
                      <SelectTrigger className="bg-[#121212] border-gray-600 text-white">
                        <SelectValue placeholder="Select a member (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2A2A] border-gray-600 max-h-64">
                        {members.map((m) => (
                          <SelectItem key={m.id} value={m.id} className="text-white">
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="priority" className="text-white">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger className="bg-[#121212] border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-gray-600">
                      {PRIORITIES.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value} className="text-white">
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate" className="text-white">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className="bg-[#121212] border-gray-600 text-white"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white">
                  Create Task
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Project Selection */}
      <Card className="bg-[#2A2A2A] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Select Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject || ""} onValueChange={(value) => setSelectedProject(value)}>
            <SelectTrigger className="bg-[#121212] border-gray-600 text-white">
              <SelectValue placeholder="Choose a project to manage tasks" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A] border-gray-600">
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id} className="text-white">
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Task Statistics */}
      {selectedProject && taskStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-white">{taskStats.total}</p>
                </div>
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">To Do</p>
                  <p className="text-2xl font-bold text-gray-500">{taskStats.todo}</p>
                </div>
                <Clock className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-500">{taskStats.inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Done</p>
                  <p className="text-2xl font-bold text-green-500">{taskStats.done}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Completion</p>
                  <p className="text-2xl font-bold text-blue-500">{taskStats.completionRate}%</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Kanban Board */}
      {selectedProject && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {TASK_STATUSES.map((status) => {
            const StatusIcon = status.icon;
            const statusTasks = tasksByStatus[status.value] || [];
            
            return (
              <Card key={status.value} className="bg-[#2A2A2A] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusIcon className="w-5 h-5 mr-2" />
                      {status.label}
                    </div>
                    <Badge className={`${status.color} text-white`}>
                      {statusTasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statusTasks.map((task) => (
                      <div key={task.id || task._id} className="p-3 bg-[#121212] rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white font-medium text-sm">{task.title}</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTask(task.id || task._id)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-400 text-xs mb-2">{task.description}</p>
                        )}
                        {task.assignee_id && (
                          <p className="text-gray-500 text-[11px] mb-1">Assigned to: {members.find(m => m.id === task.assignee_id)?.name || task.assignee_id}</p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          {getPriorityBadge("medium")}
                          
                          <Select
                            value={task.status || "pending"}
                            onValueChange={(newStatus) => handleUpdateTaskStatus(task.id || task._id, newStatus)}
                          >
                            <SelectTrigger className="w-20 h-6 text-xs bg-[#2A2A2A] border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2A2A2A] border-gray-600">
                              {TASK_STATUSES.map((s) => (
                                <SelectItem key={s.value} value={s.value} className="text-white text-xs">
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {task.dueDate && (
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {statusTasks.length === 0 && (
                      <div className="text-center py-8">
                        <StatusIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No {status.label.toLowerCase()} tasks</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!selectedProject && (
        <Card className="bg-[#2A2A2A] border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">
              Select a project above to start managing tasks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

