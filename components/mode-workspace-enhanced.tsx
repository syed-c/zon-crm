"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Search, 
  BarChart3, 
  Users, 
  FileText, 
  Link as LinkIcon, 
  Globe, 
  Mail, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from "lucide-react"

interface ModeWorkspaceEnhancedProps {
  segment: string
  projectId?: string | null
  activeTabProp?: string
}

export default function ModeWorkspaceEnhanced({ segment, projectId: projectIdProp, activeTabProp }: ModeWorkspaceEnhancedProps) {
  const searchParams = useSearchParams()
  const projectId = projectIdProp ?? searchParams.get("project") ?? searchParams.get("projectId")
  const [activeTab, setActiveTab] = useState(activeTabProp || "overview")

  const getSegmentConfig = () => {
    const configs = {
      seo: {
        title: "SEO Management",
        description: "Optimize search engine rankings and organic traffic",
        icon: <Search className="h-6 w-6" />,
        color: "text-green-400",
        tabs: ["overview", "on-page", "keywords", "backlinks", "audits", "competitors"],
        kpis: [
          { label: "SEO Score", value: "85/100", change: "+5", trend: "up" },
          { label: "Keywords Ranking", value: "247", change: "+12", trend: "up" },
          { label: "Organic Traffic", value: "15.2K", change: "+8%", trend: "up" },
          { label: "Backlinks", value: "1,234", change: "+23", trend: "up" }
        ]
      },
      social: {
        title: "Social Media Management",
        description: "Manage social media campaigns and engagement",
        icon: <Users className="h-6 w-6" />,
        color: "text-blue-400",
        tabs: ["overview", "calendar", "assets", "campaigns", "analytics", "influencers"],
        kpis: [
          { label: "Total Followers", value: "45.2K", change: "+1.2K", trend: "up" },
          { label: "Engagement Rate", value: "6.8%", change: "+0.5%", trend: "up" },
          { label: "Posts This Month", value: "32", change: "+8", trend: "up" },
          { label: "Reach", value: "125K", change: "+15%", trend: "up" }
        ]
      },
      content: {
        title: "Content Management",
        description: "Create, manage, and optimize content strategy",
        icon: <FileText className="h-6 w-6" />,
        color: "text-purple-400",
        tabs: ["overview", "briefs", "drafts", "published", "calendar", "performance"],
        kpis: [
          { label: "Content Published", value: "24", change: "+6", trend: "up" },
          { label: "Avg. Reading Time", value: "4.2min", change: "+0.3", trend: "up" },
          { label: "Social Shares", value: "892", change: "+156", trend: "up" },
          { label: "Content Score", value: "92/100", change: "+4", trend: "up" }
        ]
      },
      ads: {
        title: "Advertising Management",
        description: "Manage paid advertising campaigns and budgets",
        icon: <BarChart3 className="h-6 w-6" />,
        color: "text-yellow-400",
        tabs: ["overview", "campaigns", "ad-sets", "creatives", "budgets", "reports"],
        kpis: [
          { label: "Total Spend", value: "$12.5K", change: "+$2.1K", trend: "up" },
          { label: "ROAS", value: "4.2x", change: "+0.3x", trend: "up" },
          { label: "CTR", value: "2.8%", change: "+0.4%", trend: "up" },
          { label: "Conversions", value: "156", change: "+23", trend: "up" }
        ]
      },
      email: {
        title: "Email Marketing",
        description: "Manage email campaigns and automation",
        icon: <Mail className="h-6 w-6" />,
        color: "text-pink-400",
        tabs: ["overview", "campaigns", "lists", "automation", "templates", "analytics"],
        kpis: [
          { label: "Open Rate", value: "24.5%", change: "+2.1%", trend: "up" },
          { label: "Click Rate", value: "3.8%", change: "+0.5%", trend: "up" },
          { label: "Subscribers", value: "8.9K", change: "+234", trend: "up" },
          { label: "Revenue", value: "$5.2K", change: "+$890", trend: "up" }
        ]
      },
      web: {
        title: "Web Development",
        description: "Manage website development and optimization",
        icon: <Globe className="h-6 w-6" />,
        color: "text-cyan-400",
        tabs: ["overview", "tickets", "sprints", "pages", "performance", "deployments"],
        kpis: [
          { label: "Page Speed", value: "92/100", change: "+5", trend: "up" },
          { label: "Core Web Vitals", value: "Good", change: "Improved", trend: "up" },
          { label: "Tickets Closed", value: "18", change: "+6", trend: "up" },
          { label: "Uptime", value: "99.9%", change: "0%", trend: "neutral" }
        ]
      },
      analytics: {
        title: "Analytics & Reporting",
        description: "Track performance and generate insights",
        icon: <TrendingUp className="h-6 w-6" />,
        color: "text-orange-400",
        tabs: ["overview", "traffic", "conversions", "funnels", "attribution", "reports"],
        kpis: [
          { label: "Total Sessions", value: "45.2K", change: "+12%", trend: "up" },
          { label: "Conversion Rate", value: "3.4%", change: "+0.8%", trend: "up" },
          { label: "Avg. Session Duration", value: "3:42", change: "+0:23", trend: "up" },
          { label: "Bounce Rate", value: "42%", change: "-5%", trend: "up" }
        ]
      }
    }
    return configs[segment as keyof typeof configs] || configs.seo
  }

  const config = getSegmentConfig()

  const renderTabContent = (tab: string) => {
    switch (tab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.kpis.map((kpi, index) => (
                <Card key={index} className="bg-crm-card border-crm-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-crm-text-secondary">
                      {kpi.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-crm-text">{kpi.value}</div>
                    <div className="flex items-center mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          kpi.trend === "up" 
                            ? "text-green-400 border-green-400/30" 
                            : "text-crm-text-secondary border-crm-border"
                        }`}
                      >
                        {kpi.trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
                        {kpi.change}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <CardTitle className="text-crm-text">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "SEO audit completed", time: "2 hours ago", status: "completed" },
                    { action: "5 blog posts published", time: "1 day ago", status: "completed" },
                    { action: "Link building campaign started", time: "2 days ago", status: "in_progress" },
                    { action: "Keyword research updated", time: "3 days ago", status: "completed" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-crm-border last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === "completed" ? "bg-green-400" : "bg-yellow-400"
                        }`} />
                        <span className="text-crm-text">{activity.action}</span>
                      </div>
                      <span className="text-sm text-crm-text-secondary">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return (
          <div className="space-y-6">
            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <CardTitle className="text-crm-text capitalize">{tab} Management</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Manage your {segment} {tab} activities and track performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample content for each tab */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <Card key={item} className="bg-crm-surface border-crm-border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm text-crm-text">
                              {segment.toUpperCase()} Item #{item}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs text-crm-text-secondary border-crm-border">
                              Active
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-crm-text-secondary mb-3">
                            Sample {tab} item for {segment} management with detailed description and metrics.
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Progress value={Math.random() * 100} className="w-16 h-2" />
                              <span className="text-xs text-crm-text-secondary">
                                {Math.floor(Math.random() * 100)}%
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-crm-text-secondary hover:text-crm-text">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-crm-text-secondary hover:text-crm-text">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-crm-text-secondary hover:text-red-400">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg bg-crm-surface ${config.color}`}>
            {config.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-crm-text">{config.title}</h1>
            <p className="text-crm-text-secondary">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-crm-border text-crm-text hover:bg-crm-hover">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-crm-border text-crm-text hover:bg-crm-hover">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-crm-primary hover:bg-crm-primary/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New {segment.charAt(0).toUpperCase() + segment.slice(1)}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-crm-surface border border-crm-border">
          {config.tabs.map((tab) => (
            <TabsTrigger 
              key={tab} 
              value={tab}
              className="capitalize text-crm-text-secondary data-[state=active]:text-crm-text data-[state=active]:bg-crm-card"
            >
              {tab.replace("-", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {config.tabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            {renderTabContent(tab)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}