"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

const upcomingTasks = [
  {
    id: 1,
    title: "Complete keyword research for Q1 campaign",
    project: "TechCorp SEO",
    assignee: "Sarah Johnson",
    assigneeInitials: "SJ",
    dueDate: "Today",
    priority: "high",
    status: "in_progress",
    daysLeft: 0
  },
  {
    id: 2,
    title: "Publish blog post: 'Advanced SEO Techniques'",
    project: "StartupXYZ",
    assignee: "Mike Chen",
    assigneeInitials: "MC",
    dueDate: "Tomorrow",
    priority: "medium",
    status: "review",
    daysLeft: 1
  },
  {
    id: 3,
    title: "Technical audit for mobile optimization",
    project: "E-commerce Store",
    assignee: "Emma Davis",
    assigneeInitials: "ED",
    dueDate: "Dec 28",
    priority: "high",
    status: "todo",
    daysLeft: 2
  },
  {
    id: 4,
    title: "Backlink outreach campaign - Phase 2",
    project: "SaaS Client",
    assignee: "Alex Rodriguez",
    assigneeInitials: "AR",
    dueDate: "Dec 30",
    priority: "medium",
    status: "in_progress",
    daysLeft: 4
  },
  {
    id: 5,
    title: "Monthly SEO report generation",
    project: "Local Business",
    assignee: "John Smith",
    assigneeInitials: "JS",
    dueDate: "Jan 2",
    priority: "low",
    status: "todo",
    daysLeft: 7
  }
]

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "text-red-400 border-red-400/30 bg-red-400/10"
    case "medium":
      return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
    case "low":
      return "text-gray-400 border-gray-400/30 bg-gray-400/10"
    default:
      return "text-crm-text-secondary border-crm-border"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "todo":
      return "text-gray-400 border-gray-400/30 bg-gray-400/10"
    case "in_progress":
      return "text-blue-400 border-blue-400/30 bg-blue-400/10"
    case "review":
      return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
    case "done":
      return "text-green-400 border-green-400/30 bg-green-400/10"
    default:
      return "text-crm-text-secondary border-crm-border"
  }
}

function getDueDateColor(daysLeft: number) {
  if (daysLeft === 0) return "text-red-400"
  if (daysLeft <= 2) return "text-yellow-400"
  return "text-crm-text-secondary"
}

export function UpcomingDeadlines() {
  return (
    <Card className="bg-crm-card border-crm-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-crm-text flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Deadlines
        </CardTitle>
        <Button variant="outline" size="sm" className="text-crm-text-secondary border-crm-border hover:bg-crm-hover">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg bg-crm-hover/50 border border-crm-border/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-crm-text line-clamp-2">
                    {task.title}
                  </h4>
                  <div className="flex items-center space-x-1 ml-2">
                    {task.daysLeft === 0 && <AlertTriangle className="h-4 w-4 text-red-400" />}
                    {task.daysLeft <= 2 && task.daysLeft > 0 && <Clock className="h-4 w-4 text-yellow-400" />}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs text-crm-text-secondary border-crm-border">
                    {task.project}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-crm-primary text-white text-xs">
                        {task.assigneeInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-crm-text-secondary">{task.assignee}</span>
                  </div>
                  
                  <span className={`text-xs font-medium ${getDueDateColor(task.daysLeft)}`}>
                    {task.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}