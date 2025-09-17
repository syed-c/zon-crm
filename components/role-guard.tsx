"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"

interface RoleGuardProps {
  children: ReactNode
  module: string
  capability: string
  projectId?: string
  fallback?: ReactNode
}

export function RoleGuard({ 
  children, 
  module, 
  capability, 
  projectId, 
  fallback 
}: RoleGuardProps) {
  const hasPermission = useQuery(api.rbac.checkPermission, {
    module,
    capability,
    projectId: projectId as any,
  })

  // Loading state
  if (hasPermission === undefined) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-crm-primary"></div>
      </div>
    )
  }

  // Access denied
  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Card className="bg-crm-card border-crm-border">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-crm-danger mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-crm-text mb-2">Access Denied</h3>
            <p className="text-crm-muted">
              You don't have permission to {capability} {module}.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}

// Hook for checking permissions in components
export function usePermission(module: string, capability: string, projectId?: string) {
  return useQuery(api.rbac.checkPermission, {
    module,
    capability,
    projectId: projectId as any,
  })
}

// Component for conditional rendering based on permissions
interface PermissionGateProps {
  module: string
  capability: string
  projectId?: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ 
  module, 
  capability, 
  projectId, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const hasPermission = usePermission(module, capability, projectId)
  
  if (hasPermission === undefined) return null
  if (!hasPermission) return <>{fallback}</>
  
  return <>{children}</>
}