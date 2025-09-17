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
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CheckCircle, AlertCircle, Clock, Search, Target } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

const SEO_KINDS = [
  { value: "title_tag", label: "Title Tag" },
  { value: "meta_description", label: "Meta Description" },
  { value: "h1", label: "H1 Tag" },
  { value: "h2", label: "H2 Tags" },
  { value: "alt_text", label: "Alt Text" },
  { value: "internal_linking", label: "Internal Linking" },
  { value: "canonical", label: "Canonical URL" },
  { value: "schema", label: "Schema Markup" },
  { value: "url_structure", label: "URL Structure" },
  { value: "keyword_density", label: "Keyword Density" },
];

export default function SeoPageContent() {
  const [selectedProject, setSelectedProject] = useState<Id<"projects"> | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Queries
  const projects = useQuery(api.projects.listProjects);
  const seoItems = useQuery(api.seo.listSeoItemsByProject, 
    selectedProject ? { projectId: selectedProject } : "skip"
  );
  const seoProgress = useQuery(api.seo.getSeoProgress, 
    selectedProject ? { projectId: selectedProject } : "skip"
  );

  // Mutations
  const createSeoItem = useMutation(api.seo.createSeoItem);
  const updateSeoItem = useMutation(api.seo.updateSeoItem);
  const deleteSeoItem = useMutation(api.seo.deleteSeoItem);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "wip": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "issue": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ok: { color: "bg-green-500", label: "Fixed" },
      wip: { color: "bg-yellow-500", label: "In Progress" },
      issue: { color: "bg-red-500", label: "Issue" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.issue;
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { color: "bg-red-600", label: "High" },
      medium: { color: "bg-yellow-600", label: "Medium" },
      low: { color: "bg-green-600", label: "Low" },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    
    return (
      <Badge variant="outline" className={`${config.color} text-white border-0`}>
        {config.label}
      </Badge>
    );
  };

  const handleCreateSeoItem = async (formData: FormData) => {
    if (!selectedProject) return;

    try {
      const kind = formData.get("kind") as string;
      const details = formData.get("details") as string;
      const priority = formData.get("priority") as string;

      await createSeoItem({
        projectId: selectedProject,
        kind,
        details: details || undefined,
        priority: priority || "medium",
        status: "issue",
      });

      toast.success("SEO item created successfully!");
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create SEO item");
      console.error(error);
    }
  };

  const handleUpdateStatus = async (seoItemId: Id<"seoItems">, status: string) => {
    try {
      await updateSeoItem({ seoItemId, status });
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">SEO Management</h1>
          <p className="text-gray-400 mt-2">Track and manage on-page SEO optimization tasks</p>
        </div>
        
        {selectedProject && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add SEO Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2A2A2A] border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create SEO Task</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Add a new SEO optimization task
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateSeoItem} className="space-y-4">
                <div>
                  <Label htmlFor="kind" className="text-white">SEO Element</Label>
                  <Select name="kind" required>
                    <SelectTrigger className="bg-[#121212] border-gray-600 text-white">
                      <SelectValue placeholder="Select SEO element" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-gray-600">
                      {SEO_KINDS.map((kind) => (
                        <SelectItem key={kind.value} value={kind.value} className="text-white">
                          {kind.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="details" className="text-white">Details</Label>
                  <Textarea
                    id="details"
                    name="details"
                    className="bg-[#121212] border-gray-600 text-white"
                    placeholder="Describe the SEO issue or task"
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
                      <SelectItem value="high" className="text-white">High</SelectItem>
                      <SelectItem value="medium" className="text-white">Medium</SelectItem>
                      <SelectItem value="low" className="text-white">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white">
                  Create SEO Task
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
              <SelectValue placeholder="Choose a project to manage SEO" />
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

      {selectedProject && seoProgress && seoProgress !== undefined && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-white">{seoProgress.total}</p>
                </div>
                <Search className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-green-500">{seoProgress.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-500">{seoProgress.inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Issues</p>
                  <p className="text-2xl font-bold text-red-500">{seoProgress.issues}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedProject && seoProgress && seoProgress !== undefined && (
        <Card className="bg-[#2A2A2A] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">SEO Progress</CardTitle>
            <CardDescription className="text-gray-400">
              {seoProgress.completionRate}% of SEO tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={seoProgress.completionRate} className="w-full" />
          </CardContent>
        </Card>
      )}

      {selectedProject && seoItems && seoItems !== undefined && (
        <Card className="bg-[#2A2A2A] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">SEO Tasks</CardTitle>
            <CardDescription className="text-gray-400">
              Manage on-page SEO optimization tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seoItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(item.status || "issue")}
                    <div>
                      <h3 className="text-white font-medium">
                        {SEO_KINDS.find(k => k.value === item.kind)?.label || item.kind}
                      </h3>
                      {item.details && (
                        <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(item.priority || "medium")}
                    {getStatusBadge(item.status || "issue")}
                    <Select
                      value={item.status || "issue"}
                      onValueChange={(status) => handleUpdateStatus(item._id, status)}
                    >
                      <SelectTrigger className="w-32 bg-[#2A2A2A] border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2A2A] border-gray-600">
                        <SelectItem value="issue" className="text-white">Issue</SelectItem>
                        <SelectItem value="wip" className="text-white">In Progress</SelectItem>
                        <SelectItem value="ok" className="text-white">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              
              {seoItems.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No SEO tasks found for this project.</p>
                  <p className="text-gray-500 text-sm">Create your first SEO task to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedProject && (
        <Card className="bg-[#2A2A2A] border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">
              Select a project above to start managing SEO tasks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
