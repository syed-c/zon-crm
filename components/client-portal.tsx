
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  FileText, 
  Search, 
  Link as LinkIcon, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  TrendingUp,
  Eye
} from "lucide-react";

export default function ClientPortal() {
  // Get current user to determine client access
  const currentUser = useQuery(api.rbac.getCurrentUser);
  
  // For demo purposes, show all projects. In production, filter by client relationship
  const projects = useQuery(api.projects.listProjects);
  
  // Get aggregated data for client dashboard
  const allTasks = useQuery(api.tasks.listTasks);
  const allContent = useQuery(api.content.listAllContent);

  if (!currentUser) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crm-primary mx-auto mb-4"></div>
            <p className="text-crm-muted">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate overall statistics
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter(p => p.status === "active").length || 0;
  const totalTasks = allTasks?.length || 0;
  const completedTasks = allTasks?.filter(t => t.status === "done").length || 0;
  const totalContent = allContent?.length || 0;
  const publishedContent = allContent?.filter(c => c.status === "published").length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-crm-text">
          Welcome back, {currentUser.name || "Client"}
        </h1>
        <p className="text-crm-muted">
          Here's an overview of your projects and their progress
        </p>
        <div className="flex items-center space-x-2 text-sm text-crm-muted">
          <Eye className="w-4 h-4" />
          <span>Read-only access • Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-crm-card border-crm-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crm-muted">Total Projects</p>
                <p className="text-2xl font-bold text-crm-text">{totalProjects}</p>
              </div>
              <Target className="w-8 h-8 text-crm-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crm-card border-crm-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crm-muted">Active Projects</p>
                <p className="text-2xl font-bold text-crm-text">{activeProjects}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-crm-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crm-card border-crm-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crm-muted">Tasks Completed</p>
                <p className="text-2xl font-bold text-crm-text">{completedTasks}/{totalTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-crm-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crm-card border-crm-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crm-muted">Content Published</p>
                <p className="text-2xl font-bold text-crm-text">{publishedContent}/{totalContent}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card className="bg-crm-card border-crm-border">
        <CardHeader>
          <CardTitle className="text-crm-text">Your Projects</CardTitle>
          <CardDescription className="text-crm-muted">
            Overview of all your active and completed projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {projects?.map((project) => {
              // Calculate project progress (mock data for demo)
              const projectTasks = allTasks?.filter(t => t.projectId === project._id) || [];
              const completedProjectTasks = projectTasks.filter(t => t.status === "done");
              const progress = projectTasks.length > 0 
                ? Math.round((completedProjectTasks.length / projectTasks.length) * 100) 
                : 0;

              const getStatusColor = (status: string) => {
                switch (status) {
                  case "active": return "bg-blue-500 text-white";
                  case "completed": return "bg-crm-success text-white";
                  case "planning": return "bg-yellow-500 text-white";
                  default: return "bg-gray-500 text-white";
                }
              };

              return (
                <Card key={project._id} className="bg-crm-bg border-crm-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium text-crm-text">{project.name}</h3>
                        <p className="text-crm-muted text-sm">{project.description}</p>
                      </div>
                      <Badge className={getStatusColor(project.status || "active")}>
                        {project.status || "active"}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-crm-muted">Progress</span>
                        <span className="text-crm-text font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-crm-muted">
                          <CheckCircle className="w-4 h-4" />
                          <span>{completedProjectTasks.length}/{projectTasks.length} tasks</span>
                        </div>
                        {project.dueDate && (
                          <div className="flex items-center space-x-2 text-crm-muted">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {totalProjects === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-crm-muted mx-auto mb-4" />
                <p className="text-crm-muted">No projects assigned yet</p>
                <p className="text-crm-muted text-sm">Your projects will appear here once they're created</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-crm-card border-crm-border">
          <CardHeader>
            <CardTitle className="text-crm-text">Recent Activity</CardTitle>
            <CardDescription className="text-crm-muted">
              Latest updates on your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allContent?.slice(0, 5).map((content) => (
                <div key={content._id} className="flex items-center justify-between p-3 bg-crm-bg rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-crm-text text-sm font-medium">{content.title}</p>
                      <p className="text-crm-muted text-xs">Content • {new Date(content.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={
                    content.status === "published" ? "bg-crm-success" :
                    content.status === "ready" ? "bg-blue-500" :
                    content.status === "in_progress" ? "bg-yellow-500" : "bg-gray-500"
                  }>
                    {content.status}
                  </Badge>
                </div>
              ))}
              
              {totalContent === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 text-crm-muted mx-auto mb-2" />
                  <p className="text-crm-muted text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crm-card border-crm-border">
          <CardHeader>
            <CardTitle className="text-crm-text">Performance Summary</CardTitle>
            <CardDescription className="text-crm-muted">
              Key metrics across all your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-crm-success rounded-full"></div>
                  <span className="text-crm-muted text-sm">Completed Tasks</span>
                </div>
                <span className="text-crm-text font-medium">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-crm-muted text-sm">Published Content</span>
                </div>
                <span className="text-crm-text font-medium">
                  {totalContent > 0 ? Math.round((publishedContent / totalContent) * 100) : 0}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-crm-primary rounded-full"></div>
                  <span className="text-crm-muted text-sm">Active Projects</span>
                </div>
                <span className="text-crm-text font-medium">{activeProjects}</span>
              </div>

              <div className="pt-4 border-t border-crm-border">
                <p className="text-crm-muted text-xs">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
