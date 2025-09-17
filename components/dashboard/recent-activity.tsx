"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  CheckCircle, 
  FileText, 
  Link as LinkIcon, 
  AlertTriangle,
  Clock
} from "lucide-react"

type Activity = {
  id: string
  type: string
  user: string | null
  userInitials: string
  action: string
  target: string
  project: string | null
  time: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mod = await import("@/services/dashboardData")
        const data = await mod.fetchRecentActivity(10)
        if (!cancelled) setActivities(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load activity")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <Card className="bg-crm-card border-crm-border">
      <CardHeader>
        <CardTitle className="text-crm-text">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-crm-text-secondary">Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-crm-hover text-crm-text text-xs">
                  {activity.userInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-crm-text">
                    <span className="font-medium">{activity.user ?? "System"}</span>
                    {" "}
                    <span className="text-crm-text-secondary">{activity.action}</span>
                    {" "}
                    <span className="font-medium">{activity.target}</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <Badge 
                    variant="outline" 
                    className="text-xs text-crm-text-secondary border-crm-border"
                  >
                    {activity.project ?? "General"}
                  </Badge>
                  <span className="text-xs text-crm-text-secondary">
                    {activity.time}
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