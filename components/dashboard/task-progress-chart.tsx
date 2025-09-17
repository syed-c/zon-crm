

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function TaskProgressChart() {
  const [statusData, setStatusData] = useState<{ name: string; value: number; color: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mod = await import("@/services/dashboardData")
        const data = await mod.fetchTaskStatusDistribution()
        if (!cancelled) setStatusData(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load chart")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-crm-card border-crm-border">
        <CardHeader>
          <CardTitle className="text-crm-text">Tasks by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-crm-text-secondary">Coming soon</div>
        </CardContent>
      </Card>

      <Card className="bg-crm-card border-crm-border">
        <CardHeader>
          <CardTitle className="text-crm-text">Task Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px'
                }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Legend 
                wrapperStyle={{ 
                  color: '#FFFFFF',
                  fontSize: '14px'
                }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

