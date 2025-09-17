"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Plus,
  MessageSquare
} from "lucide-react"

const activities = [
  {
    id: 1,
    type: "task_completed",
    title: "SEO Audit completed for TechCorp",
    description: "Technical SEO audit has been completed and report generated",
    user: "Sarah Johnson",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-400/10"
  },
  {
    id: 2,
    type: "content_published",
    title: "5 blog posts published",
    description: "New content published for Fashion Forward campaign",
    user: "Mike Chen",
    time: "4 hours ago",
    icon: FileText,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10"
  },
  {
    id: 3,
    type: "client_feedback",
    title: "Client feedback received",
    description: "HealthPlus provided feedback on social media strategy",
    user: "Dr. Ahmed Hassan",
    time: "6 hours ago",
    icon: MessageSquare,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10"
  },
  {
    id: 4,
    type: "campaign_started",
    title: "Link building campaign started",
    description: "Outreach campaign initiated for 20 high-quality backlinks",
    user: "Alex Rodriguez",
    time: "1 day ago",
    icon: TrendingUp,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10"
  },
  {
    id: 5,
    type: "team_added",
    title: "New team member added",
    description: "Emma Wilson joined as Content Specialist",
    user: "Admin",
    time: "2 days ago",
    icon: Users,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10"
  },
  {
    id: 6,
    type: "deadline_approaching",
    title: "Project deadline approaching",
    description: "TechCorp SEO Campaign due in 3 days",
    user: "System",
    time: "2 days ago",
    icon: AlertTriangle,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10"
  }
]

export function RecentActivityEnhanced() {
  return (
    <Card className="bg-crm-card border-crm-border">
      <CardHeader>
        <CardTitle className="text-crm-text flex items-center justify-between">
          Recent Activity
          <Badge variant="outline" className="text-xs text-crm-text-secondary border-crm-border">
            {activities.length} updates
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-crm-surface/50 transition-colors">
                <div className={`p-2 rounded-full ${activity.bgColor}`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-crm-text truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-crm-text-secondary whitespace-nowrap ml-2">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-crm-text-secondary mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarFallback className="bg-crm-primary text-white text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-crm-text-secondary">
                      {activity.user}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-crm-border">
          <button className="w-full text-sm text-crm-primary hover:text-crm-primary/80 font-medium transition-colors">
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  )
}