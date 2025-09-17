

"use client";

import { useEffect, useState } from "react";
import { fetchProjectById, fetchProjectBySlug } from "@/services/projectsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  BarChart3, 
  FileText, 
  Search, 
  Link as LinkIcon, 
  Users, 
  FolderOpen,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  TrendingUp
} from "lucide-react";
// Convex types removed

interface ProjectDetailContentProps {
  projectId: string;
  initialTab: string;
}

export default function ProjectDetailContent({ projectId, initialTab }: ProjectDetailContentProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [project, setProject] = useState<any>(undefined as any)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<any[]>([])
  const [content, setContent] = useState<any[]>([])
  const [seoItems, setSeoItems] = useState<any[]>([])
  const [backlinks, setBacklinks] = useState<any[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // Resolve either id or slug
        const byId = await fetchProjectById(projectId)
        const data = byId || await fetchProjectBySlug(projectId)
        if (!cancelled) setProject(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [projectId])

  // Handle loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crm-primary mx-auto mb-4"></div>
            <p className="text-crm-muted">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle project not found
  if (project === null) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-crm-danger mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-crm-text mb-2">Project Not Found</h2>
            <p className="text-crm-muted mb-4">The project you're looking for doesn't exist or has been deleted.</p>
            <Button asChild className="bg-crm-primary hover:bg-crm-primary/80 text-white">
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate project statistics
  const totalTasks = tasks.length || 0;
  const completedTasks = tasks.filter(task => task.status === "done").length || 0;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalContent = content.length || 0;
  const publishedContent = content.filter(c => c.status === "published").length || 0;

  const totalSeoTasks = seoItems.length || 0;
  const completedSeoTasks = seoItems.filter(seo => seo.status === "ok").length || 0;

  const totalBacklinks = backlinks.length || 0;
  const liveBacklinks = backlinks.filter(b => b.status === "live").length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-500 text-white";
      case "completed": return "bg-crm-success text-white";
      case "planning": return "bg-yellow-500 text-white";
      case "on-hold": return "bg-gray-500 text-white";
      default: return "bg-crm-muted text-white";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-crm-text">{project.name}</h1>
            <Badge className={getStatusColor(project.status || "active")}>
              {project.status || "active"}
            </Badge>
          </div>
          <p className="text-crm-muted">{project.description}</p>
          <div className="flex items-center space-x-4 text-sm text-crm-muted">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : "No deadline"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{progressPercentage}% Complete</span>
            </div>
          </div>
        </div>
        <Button className="bg-crm-primary hover:bg-crm-primary/80 text-white">
          Edit Project
        </Button>
      </div>

      {/* Project Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-crm-surface">
          <TabsTrigger value="overview" className="text-crm-text data-[state=active]:bg-crm-primary">
            Overview
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-crm-text data-[state=active]:bg-crm-primary">
            SEO
          </TabsTrigger>
          <TabsTrigger value="content" className="text-crm-text data-[state=active]:bg-crm-primary">
            Content
          </TabsTrigger>
          <TabsTrigger value="social" className="text-crm-text data-[state=active]:bg-crm-primary">
            Social
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-crm-text data-[state=active]:bg-crm-primary">
            Reports
          </TabsTrigger>
          <TabsTrigger value="files" className="text-crm-text data-[state=active]:bg-crm-primary">
            Files
          </TabsTrigger>
          <TabsTrigger value="team" className="text-crm-text data-[state=active]:bg-crm-primary">
            Team
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-crm-card border-crm-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-crm-muted">Progress</p>
                    <p className="text-2xl font-bold text-crm-text">{progressPercentage}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-crm-primary" />
                </div>
                <Progress value={progressPercentage} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-crm-card border-crm-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-crm-muted">Tasks</p>
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
                    <p className="text-sm font-medium text-crm-muted">Content</p>
                    <p className="text-2xl font-bold text-crm-text">{publishedContent}/{totalContent}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crm-card border-crm-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-crm-muted">Backlinks</p>
                    <p className="text-2xl font-bold text-crm-text">{liveBacklinks}/{totalBacklinks}</p>
                  </div>
                  <LinkIcon className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <CardTitle className="text-crm-text">Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-crm-bg rounded-lg">
                      <div className="flex items-center space-x-3">
                        {task.status === "done" ? (
                          <CheckCircle className="w-4 h-4 text-crm-success" />
                        ) : task.status === "in_progress" ? (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-crm-muted" />
                        )}
                        <span className="text-crm-text text-sm">{task.title || "Task"}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                  {totalTasks === 0 && (
                    <p className="text-crm-muted text-center py-4">No tasks yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <CardTitle className="text-crm-text">SEO Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-crm-muted">SEO Tasks Completed</span>
                    <span className="text-crm-text font-medium">{completedSeoTasks}/{totalSeoTasks}</span>
                  </div>
                  <Progress value={totalSeoTasks > 0 ? (completedSeoTasks / totalSeoTasks) * 100 : 0} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-crm-muted">Live Backlinks</span>
                    <span className="text-crm-text font-medium">{liveBacklinks}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-crm-muted">Published Content</span>
                    <span className="text-crm-text font-medium">{publishedContent}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="mt-6">
          <Card className="bg-crm-card border-crm-border">
            <CardHeader>
              <CardTitle className="text-crm-text flex items-center">
                <Search className="w-5 h-5 mr-2" />
                SEO Tasks for {project.name}
              </CardTitle>
              <CardDescription className="text-crm-muted">
                Manage on-page SEO optimization tasks for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoItems.map((seoItem, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-crm-bg rounded-lg border border-crm-border">
                    <div className="flex items-center space-x-4">
                      {seoItem.status === "ok" ? (
                        <CheckCircle className="w-4 h-4 text-crm-success" />
                      ) : seoItem.status === "wip" ? (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-crm-danger" />
                      )}
                      <div>
                        <h3 className="text-crm-text font-medium">{seoItem.kind}</h3>
                        {seoItem.details && (
                          <p className="text-crm-muted text-sm mt-1">{seoItem.details}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={
                      seoItem.status === "ok" ? "bg-crm-success" :
                      seoItem.status === "wip" ? "bg-yellow-500" : "bg-crm-danger"
                    }>
                      {seoItem.status === "ok" ? "Fixed" : 
                       seoItem.status === "wip" ? "In Progress" : "Issue"}
                    </Badge>
                  </div>
                ))}
                {totalSeoTasks === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-crm-muted mx-auto mb-4" />
                    <p className="text-crm-muted">No SEO tasks for this project yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-6">
          <Card className="bg-crm-card border-crm-border">
            <CardHeader>
              <CardTitle className="text-crm-text flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Content Pipeline for {project.name}
              </CardTitle>
              <CardDescription className="text-crm-muted">
                Track content creation and publishing workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-crm-bg rounded-lg border border-crm-border">
                    <div>
                      <h3 className="text-crm-text font-medium">{c.title}</h3>
                      <p className="text-crm-muted text-sm">{c.url}</p>
                      {c.targetKeyword && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {c.targetKeyword}
                        </Badge>
                      )}
                    </div>
                    <Badge className={
                      c.status === "published" ? "bg-crm-success" :
                      c.status === "ready" ? "bg-blue-500" :
                      c.status === "in_progress" ? "bg-yellow-500" : "bg-gray-500"
                    }>
                      {c.status}
                    </Badge>
                  </div>
                ))}
                {totalContent === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-crm-muted mx-auto mb-4" />
                    <p className="text-crm-muted">No content for this project yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="mt-6">
          <Card className="bg-crm-card border-crm-border">
            <CardHeader>
              <CardTitle className="text-crm-text">Social Media Calendar</CardTitle>
              <CardDescription className="text-crm-muted">
                Manage social media content and scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-crm-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-crm-muted" />
                </div>
                <p className="text-crm-muted">Social media management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <Card className="bg-crm-card border-crm-border">
            <CardHeader>
              <CardTitle className="text-crm-text">Project Reports</CardTitle>
              <CardDescription className="text-crm-muted">
                Analytics and performance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-crm-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-crm-muted" />
                </div>
                <p className="text-crm-muted">Detailed reports coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="mt-6">
          <Card className="bg-crm-card border-crm-border">
            <CardHeader>
              <CardTitle className="text-crm-text">Project Files</CardTitle>
              <CardDescription className="text-crm-muted">
                Manage project assets and documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-crm-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-crm-muted" />
                </div>
                <p className="text-crm-muted">File management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="mt-6">
          <Card className="bg-crm-card border-crm-border">
            <CardHeader>
              <CardTitle className="text-crm-text">Project Team</CardTitle>
              <CardDescription className="text-crm-muted">
                Manage team members and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-crm-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-crm-muted" />
                </div>
                <p className="text-crm-muted">Team management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

