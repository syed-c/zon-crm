
"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, Plus, LogOut } from "lucide-react"

interface AppShellProps {
  children: React.ReactNode
  user?: any
}

export function AppShell({ children, user: initialUser }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any | null>(initialUser ?? null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" })
        const data = await res.json()
        if (!cancelled) setUser(data?.user || null)
      } catch {
        if (!cancelled) setUser(null)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])
  
  // Handle loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-crm-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-crm-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-crm-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }
  
  // Get page title based on pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard": return "Dashboard"
      case "/projects": return "Projects"
      case "/content": return "Content Management"
      case "/seo": return "SEO Management"
      case "/backlinks": return "Backlinks"
      case "/clients": return "Clients"
      case "/tasks": return "Tasks"
      case "/audit-report": return "Audit Report"
      case "/admin/users/new": return "Admin"
      case "/client-portal": return "Client Portal"
      default: return "Dashboard"
    }
  }

  const handleSignOut = async () => {
    // Clear session from localStorage
    localStorage.removeItem("simple_session_id")
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-crm-bg">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - Always Present */}
        <header className="bg-crm-card border-b border-crm-border px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-crm-text">{getPageTitle()}</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crm-muted h-4 w-4" />
                <Input
                  placeholder="Search projects, tasks, clients..."
                  className="pl-10 w-80 bg-crm-hover border-crm-border text-crm-text placeholder:text-crm-muted"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-crm-text-secondary">
                Welcome, {user.email}
              </div>
              <Button variant="outline" size="sm" className="text-crm-muted border-crm-border hover:bg-crm-hover">
                <Bell className="h-4 w-4" />
              </Button>
              <Button className="bg-crm-primary hover:bg-crm-primary/80 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="text-crm-muted border-crm-border hover:bg-crm-hover"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

