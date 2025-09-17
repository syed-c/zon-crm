"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

const deadlines = [
  {
    id: 1,
    title: "TechCorp SEO Audit Report",
    project: "TechCorp SEO Campaign",
    dueDate: "2024-01-15",
    daysLeft: 3,
    priority: "high",
    progress: 85,
    status: "in_progress",
    projectId: "1"
  },
  {
    id: 2,
    title: "Social Media Content Calendar",
    project: "Fashion Forward Social",
    dueDate: "2024-01-18",
    daysLeft: 6,
    priority: "medium",
    progress: 60,
    status: "in_progress",
    projectId: "2"
  },
  {
    id: 3,
    title: "Google Ads Campaign Setup",
    project: "HealthPlus Digital Marketing",
    dueDate: "2024-01-20",
    daysLeft: 8,
    priority: "high",
    progress: 30,
    status: "pending",
    projectId: "3"
  },
  {
    id: 4,
    title: "Blog Post Series (5 articles)",
    project: "TechCorp SEO Campaign",
    dueDate: "2024-01-22",
    daysLeft: 10,
    priority: "medium",
    progress: 40,
    status: "in_progress",
    projectId: "1"
  },
  {
    id: 5,
    title: "Instagram Ad Creative Review",
    project: "Fashion Forward Social",
    dueDate: "2024-01-25",
    daysLeft: 13,
    priority: "low",
    progress: 75,
    status: "review",
    projectId: "2"
  }
]

export function UpcomingDeadlinesEnhanced() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 border-red-400/30 bg-red-400/10"
      case "medium": return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
      case "low": return "text-green-400 border-green-400/30 bg-green-400/10"
      default: return "text-crm-text-secondary border-crm-border"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-400" />
      case "in_progress": return <Clock className="h-4 w-4 text-blue-400" />
      case "review": return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      default: return <Clock className="h-4 w-4 text-crm-text-secondary" />
    }
  }

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 3) return "text-red-400"
    if (daysLeft <= 7) return "text-yellow-400"
    return "text-crm-text-secondary"
  }

  return (
    <Card className="bg-crm-card border-crm-border">
      <CardHeader>
        <CardTitle className="text-crm-text flex items-center justify-between">
          Upcoming Deadlines
          <Badge variant="outline" className="text-xs text-crm-text-secondary border-crm-border">
            {deadlines.filter(d => d.daysLeft <= 7).length} urgent
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="p-3 rounded-lg border border-crm-border hover:border-crm-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-crm-text truncate">
                    {deadline.title}
                  </h4>
                  <p className="text-xs text-crm-text-secondary mt-1">
                    {deadline.project}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  {getStatusIcon(deadline.status)}
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(deadline.priority)}`}>
                    {deadline.priority}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Calendar className="h-3 w-3 text-crm-text-secondary" />
                  <span className="text-crm-text-secondary">
                    {new Date(deadline.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <span className={`text-xs font-medium ${getUrgencyColor(deadline.daysLeft)}`}>
                  {deadline.daysLeft === 0 ? "Due today" : 
                   deadline.daysLeft === 1 ? "Due tomorrow" :
                   `${deadline.daysLeft} days left`}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-crm-text-secondary">Progress</span>
                  <span className="text-crm-text font-medium">{deadline.progress}%</span>
                </div>
                <Progress value={deadline.progress} className="h-1.5" />
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-crm-text-secondary capitalize">
                  {deadline.status.replace('_', ' ')}
                </span>
                <Link 
                  href={`/projects/${deadline.projectId}`}
                  className="text-xs text-crm-primary hover:text-crm-primary/80 font-medium flex items-center transition-colors"
                >
                  View project
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-crm-border">
          <Link 
            href="/tasks"
            className="w-full block text-center text-sm text-crm-primary hover:text-crm-primary/80 font-medium transition-colors"
          >
            View all deadlines
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}