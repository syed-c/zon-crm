"use client"

import { KPIWidgets } from "@/components/dashboard/kpi-widgets"
import { TaskProgressChart } from "@/components/dashboard/task-progress-chart"
import { RecentActivityEnhanced } from "@/components/dashboard/recent-activity-enhanced"
import { UpcomingDeadlinesEnhanced } from "@/components/dashboard/upcoming-deadlines-enhanced"

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Widgets */}
      <KPIWidgets />
      
      {/* Charts Row */}
      <TaskProgressChart />
      
      {/* Activity and Deadlines Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivityEnhanced />
        <UpcomingDeadlinesEnhanced />
      </div>
    </div>
  )
}
