"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Eye, 
  FileText, 
  BarChart3, 
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  MessageSquare
} from "lucide-react"

export function ClientPortalDashboard() {
  // Mock data for client portal - in real implementation, this would be filtered by client ID
  const mockProjects = [
    {
      id: "1",
      name: "Website SEO Optimization",
      status: "In Progress",
      progress: 75,
      dueDate: "2024-01-15",
      description: "Comprehensive SEO audit and optimization"
    },
    {
      id: "2", 
      name: "Content Marketing Campaign",
      status: "Review",
      progress: 90,
      dueDate: "2024-01-10",
      description: "Blog content creation and social media strategy"
    }
  ]

  const mockDeliverables = [
    {
      title: "SEO Audit Report",
      type: "Report",
      status: "Completed",
      date: "2023-12-20",
      downloadUrl: "#"
    },
    {
      title: "Keyword Research",
      type: "Document", 
      status: "Completed",
      date: "2023-12-18",
      downloadUrl: "#"
    },
    {
      title: "Content Calendar Q1",
      type: "Calendar",
      status: "In Review",
      date: "2023-12-22",
      downloadUrl: null
    }
  ]

  const mockKpis = [
    { label: "Organic Traffic", value: "+23%", change: "vs last month", color: "text-crm-success" },
    { label: "Keyword Rankings", value: "47", change: "top 10 positions", color: "text-crm-primary" },
    { label: "Content Published", value: "12", change: "this month", color: "text-blue-400" },
    { label: "Backlinks Acquired", value: "8", change: "high quality", color: "text-green-400" }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-crm-text">Client Portal</h1>
          <p className="text-crm-muted">Track your project progress and deliverables</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-crm-border text-crm-muted hover:bg-crm-hover">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Team
          </Button>
          <Button className="bg-crm-primary hover:bg-crm-primary/80 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download Reports
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockKpis.map((kpi, index) => (
          <Card key={index} className="bg-crm-card border-crm-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-crm-muted">
                {kpi.label}
              </CardTitle>
              <TrendingUp className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <p className="text-xs text-crm-muted">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="bg-crm-card border-crm-border">
          <TabsTrigger 
            value="projects"
            className="data-[state=active]:bg-crm-primary data-[state=active]:text-white text-crm-muted"
          >
            <FileText className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="deliverables"
            className="data-[state=active]:bg-crm-primary data-[state=active]:text-white text-crm-muted"
          >
            <Download className="h-4 w-4 mr-2" />
            Deliverables
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="data-[state=active]:bg-crm-primary data-[state=active]:text-white text-crm-muted"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockProjects.map((project) => (
              <Card key={project.id} className="bg-crm-card border-crm-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-crm-text">{project.name}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={
                        project.status === "Completed" ? "bg-crm-success/20 text-crm-success" :
                        project.status === "In Progress" ? "bg-crm-primary/20 text-crm-primary" :
                        "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-crm-muted">{project.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-crm-muted">Progress</span>
                      <span className="text-crm-text">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-crm-muted">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-crm-border text-crm-muted hover:bg-crm-hover"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Deliverables Tab */}
        <TabsContent value="deliverables" className="space-y-4">
          <Card className="bg-crm-card border-crm-border">
            <CardHeader>
              <CardTitle className="text-crm-text">Project Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDeliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded bg-crm-hover">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded bg-crm-primary/20">
                        <FileText className="h-5 w-5 text-crm-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-crm-text">{deliverable.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-crm-muted">
                          <span>{deliverable.type}</span>
                          <span>•</span>
                          <span>{new Date(deliverable.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant="secondary"
                        className={
                          deliverable.status === "Completed" ? "bg-crm-success/20 text-crm-success" :
                          "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {deliverable.status}
                      </Badge>
                      
                      {deliverable.downloadUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-crm-border text-crm-muted hover:bg-crm-hover"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* SEO Performance */}
            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <CardTitle className="text-crm-text">SEO Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-crm-muted">Organic Traffic Growth</span>
                    <span className="text-crm-success">+23%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-crm-muted">Keyword Rankings (Top 10)</span>
                    <span className="text-crm-primary">47/100</span>
                  </div>
                  <Progress value={47} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-crm-muted">Technical SEO Score</span>
                    <span className="text-green-400">89/100</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Content Performance */}
            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <CardTitle className="text-crm-text">Content Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-crm-primary">12</div>
                    <div className="text-xs text-crm-muted">Articles Published</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-crm-success">2.4K</div>
                    <div className="text-xs text-crm-muted">Avg. Page Views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">4.2min</div>
                    <div className="text-xs text-crm-muted">Avg. Read Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">18%</div>
                    <div className="text-xs text-crm-muted">Engagement Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}