

"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Bell, 
  Plus, 
  User,
  Settings,
  LogOut
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthActions } from "@convex-dev/auth/react";

interface AppShellEnhancedProps {
  children: React.ReactNode
}

export function AppShellEnhanced({ children }: AppShellEnhancedProps) {
  const pathname = usePathname()
  const currentUser = useQuery(api.rbac.getCurrentUser)
  const unreadNotifications = useQuery(api.notifications.getUnreadNotifications) || []
  const { signOut } = useAuthActions();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/landing";
  };

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname.startsWith("/mode/")) {
      const segment = pathname.split("/")[2]
      const segmentNames: Record<string, string> = {
        seo: "SEO Management",
        social: "Social Media",
        content: "Content Management", 
        ads: "Advertising",
        email: "Email Marketing",
        web: "Web Development",
        analytics: "Analytics & Reporting"
      }
      return segmentNames[segment] || "Mode Workspace"
    }
    
    switch (pathname) {
      case "/": return "Dashboard"
      case "/projects": return "Projects"
      case "/content": return "Content Management"
      case "/seo": return "SEO Management"
      case "/backlinks": return "Backlinks"
      case "/clients": return "Clients"
      case "/tasks": return "Tasks"
      case "/reports": return "Reports"
      case "/settings": return "Settings"
      case "/admin/users/new": return "Add Team Member"
      case "/client-portal": return "Client Portal"
      default: 
        if (pathname.startsWith("/projects/")) return "Project Details"
        return "Dashboard"
    }
  }

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = [{ label: "Home", href: "/" }]
    
    if (pathname.startsWith("/mode/")) {
      const segment = segments[1]
      const segmentNames: Record<string, string> = {
        seo: "SEO Mode",
        social: "Social Mode", 
        content: "Content Mode",
        ads: "Ads Mode",
        email: "Email Mode",
        web: "Web Mode",
        analytics: "Analytics Mode"
      }
      breadcrumbs.push({ 
        label: segmentNames[segment] || "Mode", 
        href: `/mode/${segment}` 
      })
    } else if (pathname.startsWith("/projects/") && segments.length > 1) {
      breadcrumbs.push({ label: "Projects", href: "/projects" })
      breadcrumbs.push({ label: "Project Details", href: pathname })
    } else if (segments.length > 0) {
      breadcrumbs.push({ 
        label: getPageTitle(), 
        href: pathname 
      })
    }
    
    return breadcrumbs
  }

  return (
    <div className="flex h-screen bg-crm-bg">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Navigation */}
        <header className="bg-crm-card border-b border-crm-border px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Page Title & Breadcrumbs */}
              <div>
                <h1 className="text-2xl font-bold text-crm-text">{getPageTitle()}</h1>
                <div className="flex items-center space-x-2 text-sm text-crm-muted">
                  {getBreadcrumbs().map((crumb, index) => (
                    <span key={index} className="flex items-center">
                      {index > 0 && <span className="mx-2">/</span>}
                      <span className={index === getBreadcrumbs().length - 1 ? "text-crm-text" : ""}>
                        {crumb.label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Global Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crm-muted h-4 w-4" />
                <Input
                  placeholder="Search projects, tasks, clients..."
                  className="pl-10 w-80 bg-crm-hover border-crm-border text-crm-text placeholder:text-crm-muted"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative text-crm-muted border-crm-border hover:bg-crm-hover">
                    <Bell className="h-4 w-4" />
                    {unreadNotifications.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-crm-danger text-white text-xs">
                        {unreadNotifications.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-crm-card border-crm-border">
                  <DropdownMenuLabel className="text-crm-text">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-crm-border" />
                  {unreadNotifications.length === 0 ? (
                    <div className="p-4 text-center text-crm-muted">
                      No new notifications
                    </div>
                  ) : (
                    unreadNotifications.slice(0, 5).map((notification: any, index: number) => (
                      <DropdownMenuItem key={index} className="text-crm-text hover:bg-crm-hover">
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium">{notification.title}</span>
                          <span className="text-sm text-crm-muted">{notification.message}</span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Quick Add */}
              <Button className="bg-crm-primary hover:bg-crm-primary/80 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-crm-primary">
                    <span className="text-white text-sm font-medium">
                      {currentUser?.name?.charAt(0) || "U"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crm-card border-crm-border">
                  <DropdownMenuLabel className="text-crm-text">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{currentUser?.name || "User"}</p>
                      <p className="text-xs text-crm-muted">{currentUser?.email}</p>
                      <Badge variant="secondary" className="w-fit text-xs bg-crm-primary/20 text-crm-primary">
                        {currentUser?.role || "User"}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-crm-border" />
                  <DropdownMenuItem className="text-crm-text hover:bg-crm-hover">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-crm-text hover:bg-crm-hover">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-crm-border" />
                  <DropdownMenuItem 
                    className="text-crm-danger hover:bg-crm-hover cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

