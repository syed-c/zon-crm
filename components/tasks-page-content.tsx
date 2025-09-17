

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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
import { Id } from "@/convex/_generated/dataModel";

const TASK_STATUSES = [
  { value: "todo", label: "To Do", color: "bg-gray-500", icon: Clock },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-500", icon: Clock },
  { value: "done", label: "Done", color: "bg-green-500", icon: CheckCircle },
  { value: "blocked", label: "Blocked", color: "bg-red-500", icon: AlertCircle },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-green-600" },
  { value: "medium", label: "Medium", color: "bg-yellow-600" },
  { value: "high", label: "High", color: "bg-red-600" },
];

export default function TasksPageContent() {
  const [selectedProject, setSelectedProject] = useState<Id<"projects"> | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Queries
  const projects = useQuery(api.projects.listProjects);
  const tasks = useQuery(api.tasks.listTasksByProject, selectedProject ? { projectId: selectedProject } : "skip");
  const taskStats = useQuery(api.tasks.getTaskStats, selectedProject ? { projectId: selectedProject } : "skip");

  // Mutations
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

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

    try {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const priority = formData.get("priority") as string;
      const dueDate = formData.get("dueDate") as string;

      await createTask({
        projectId: selectedProject,
        title,
        description: description || undefined,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
        status: "todo",
      });

      toast.success("Task created successfully!");
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: Id<"tasks">, status: string) => {
    try {
      await updateTask({ taskId, status });
      toast.success("Task status updated!");
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId: Id<"tasks">) => {
    try {
      await deleteTask({ taskId });
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  // Group tasks by status for Kanban view
  const tasksByStatus = TASK_STATUSES.reduce((acc, status) => {
    acc[status.value] = (tasks && Array.isArray(tasks)) ? tasks.filter(task => task.status === status.value) : [];
    return acc;
  }, {} as Record<string, any[]>);

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
          <Select value={selectedProject || ""} onValueChange={(value) => setSelectedProject(value as Id<"projects">)}>
            <SelectTrigger className="bg-[#121212] border-gray-600 text-white">
              <SelectValue placeholder="Choose a project to manage tasks" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A] border-gray-600">
              {projects?.map((project) => (
                <SelectItem key={project._id} value={project._id} className="text-white">
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
                      <div key={task._id} className="p-3 bg-[#121212] rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white font-medium text-sm">{task.title}</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTask(task._id)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-400 text-xs mb-2">{task.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          {getPriorityBadge(task.priority || "medium")}
                          
                          <Select
                            value={task.status || "todo"}
                            onValueChange={(newStatus) => handleUpdateTaskStatus(task._id, newStatus)}
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

