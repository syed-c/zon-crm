
"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Search,
  Calendar,
  BarChart3,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target
} from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"

interface EnhancedProjectDashboardProps {
  projectId: Id<"projects">
  activeTab: string
  onTabChange: (tab: string) => void
}

export function EnhancedProjectDashboard({ 
  projectId, 
  activeTab, 
  onTabChange 
}: EnhancedProjectDashboardProps) {
  const project = useQuery(api.projects.getProject, { projectId })
  const kpis = useQuery(api.kpis.getDashboardKpis, { projectId })
  const tasks = useQuery(api.tasks.listTasksByProject, { projectId })
  const content = useQuery(api.content.listContentByProject, { projectId })

  if (!project) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-crm-hover rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-crm-hover rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const overviewKpis = [
    {
      title: "Progress",
      value: "67%",
      change: "+12%",
      icon: Target,
      color: "text-crm-success"
    },
    {
      title: "Due This Week",
      value: "8",
      change: "+3",
      icon: Clock,
      color: "text-crm-danger"
    },
    {
      title: "SEO Health",
      value: "89%",
      change: "+5%",
      icon: Search,
      color: "text-green-400"
    },
    {
      title: "Content Pipeline",
      value: "24",
      change: "+6",
      icon: FileText,
      color: "text-purple-400"
    }
  ]

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "seo", label: "SEO", icon: Search },
    { id: "content", label: "Content", icon: FileText },
    { id: "social", label: "Social", icon: Users },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "files", label: "Files", icon: FolderOpen },
    { id: "team", label: "Team", icon: Users },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-crm-text">{project.name}</h1>
          <p className="text-crm-muted">{project.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary" className="bg-crm-success/20 text-crm-success">
              {project.status || "Active"}
            </Badge>
            {project.dueDate && (
              <Badge variant="outline" className="border-crm-border text-crm-muted">
                Due: {new Date(project.dueDate).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-crm-border text-crm-muted hover:bg-crm-hover">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button className="bg-crm-primary hover:bg-crm-primary/80 text-white">
            <Users className="h-4 w-4 mr-2" />
            Invite Team
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewKpis.map((kpi, index) => (
          <Card key={index} className="bg-crm-card border-crm-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-crm-muted">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-crm-text">{kpi.value}</div>
              <p className="text-xs text-crm-success">
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
        <TabsList className="bg-crm-card border-crm-border">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="data-[state=active]:bg-crm-primary data-[state=active]:text-white text-crm-muted"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Task Progress */}
            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <CardTitle className="text-crm-text">Task Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-crm-muted">Completed</span>
                    <span className="text-crm-text">12/18</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-crm-success">12</div>
                    <div className="text-xs text-crm-muted">Done</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-crm-primary">4</div>
                    <div className="text-xs text-crm-muted">In Progress</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-crm-danger">2</div>
                    <div className="text-xs text-crm-muted">Blocked</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <CardTitle className="text-crm-text">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { task: "SEO Audit Report", due: "Tomorrow", priority: "high" },
                  { task: "Content Review", due: "Dec 28", priority: "medium" },
                  { task: "Social Media Assets", due: "Dec 30", priority: "low" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-crm-hover">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        item.priority === 'high' ? 'text-crm-danger' :
                        item.priority === 'medium' ? 'text-yellow-400' : 'text-crm-muted'
                      }`} />
                      <span className="text-sm text-crm-text">{item.task}</span>
                    </div>
                    <span className="text-xs text-crm-muted">{item.due}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-crm-card border-crm-border">
            <CardHeader>
              <CardTitle className="text-crm-text">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { user: "Sarah Chen", action: "completed SEO audit for homepage", time: "2 hours ago" },
                { user: "Mike Johnson", action: "uploaded new blog post draft", time: "4 hours ago" },
                { user: "Lisa Wang", action: "approved social media calendar", time: "6 hours ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 rounded bg-crm-hover">
                  <div className="w-8 h-8 bg-crm-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-crm-text">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-crm-muted">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tabs - Placeholder Content */}
        {tabs.slice(1).map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <CardTitle className="flex items-center text-crm-text">
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label} Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <tab.icon className="h-16 w-16 mx-auto mb-4 text-crm-muted opacity-50" />
                  <h3 className="text-lg font-semibold text-crm-text mb-2">
                    {tab.label} Dashboard
                  </h3>
                  <p className="text-crm-muted max-w-md mx-auto">
                    This section will contain the {tab.label.toLowerCase()} management interface 
                    with project-specific data, tools, and workflows.
                  </p>
                  <Button className="mt-4 bg-crm-primary hover:bg-crm-primary/80 text-white">
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
