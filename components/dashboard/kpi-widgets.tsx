"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  Link as LinkIcon
} from "lucide-react"

interface KPIWidgetProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  description?: string
}

function KPIWidget({ title, value, change, changeType, icon, description }: KPIWidgetProps) {
  return (
    <Card className="bg-crm-card border-crm-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-crm-text-secondary">
          {title}
        </CardTitle>
        <div className="text-crm-text-secondary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-crm-text">{value}</div>
        {change && (
          <div className="flex items-center space-x-2 mt-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                changeType === "positive" 
                  ? "text-green-400 border-green-400/30" 
                  : changeType === "negative"
                  ? "text-red-400 border-red-400/30"
                  : "text-crm-text-secondary border-crm-border"
              }`}
            >
              {changeType === "positive" && <TrendingUp className="w-3 h-3 mr-1" />}
              {change}
            </Badge>
          </div>
        )}
        {description && (
          <p className="text-xs text-crm-text-secondary mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function KPIWidgets() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    overdueTasks: 0,
    activeClients: 0,
    contentPublished: 0,
    backlinksEarned: 0,
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mod = await import("@/services/dashboardData")
        const data = await mod.fetchDashboardMetrics()
        if (!cancelled) setMetrics(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load metrics")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Card className="bg-crm-card border-crm-border"><CardContent>Loading...</CardContent></Card></div>
  }

  if (error) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Card className="bg-crm-card border-crm-border"><CardContent className="text-red-400">{error}</CardContent></Card></div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPIWidget
        title="Total Projects"
        value={metrics.totalProjects}
        change="+12%"
        changeType="positive"
        icon={<FolderOpen className="h-4 w-4" />}
        description="vs last month"
      />
      
      <KPIWidget
        title="Active Projects"
        value={metrics.activeProjects}
        change="+8%"
        changeType="positive"
        icon={<Clock className="h-4 w-4" />}
        description="currently in progress"
      />
      
      <KPIWidget
        title="Completed Projects"
        value={metrics.completedProjects}
        change="+3"
        changeType="positive"
        icon={<CheckCircle className="h-4 w-4" />}
        description="this month"
      />
      
      <KPIWidget
        title="Overdue Tasks"
        value={metrics.overdueTasks}
        change="+4"
        changeType="negative"
        icon={<AlertTriangle className="h-4 w-4" />}
        description="need attention"
      />
      
      <KPIWidget
        title="Active Clients"
        value={metrics.activeClients}
        change="+2"
        changeType="positive"
        icon={<Users className="h-4 w-4" />}
        description="this quarter"
      />
      
      <KPIWidget
        title="Content Published"
        value={metrics.contentPublished}
        change="+15%"
        changeType="positive"
        icon={<FileText className="h-4 w-4" />}
        description="this month"
      />
      
      <KPIWidget
        title="Backlinks Earned"
        value={metrics.backlinksEarned}
        change="+23%"
        changeType="positive"
        icon={<LinkIcon className="h-4 w-4" />}
        description="this month"
      />
      
      <KPIWidget
        title="Team Efficiency"
        value="87%"
        change="+5%"
        changeType="positive"
        icon={<TrendingUp className="h-4 w-4" />}
        description="task completion rate"
      />
    </div>
  )
}