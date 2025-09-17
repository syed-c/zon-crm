




"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  FileText, 
  Search, 
  Link as LinkIcon, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Megaphone,
  Target,
  Mail,
  Globe
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Tasks", href: "/tasks", icon: Users },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Content", href: "/content", icon: FileText },
  { name: "SEO", href: "/seo", icon: Search },
  { name: "Backlinks", href: "/backlinks", icon: LinkIcon },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Audit Report", href: "/audit-report", icon: Settings },
  { name: "Admin", href: "/admin/users/new", icon: Settings },
  { name: "Client Portal", href: "/client-portal", icon: Users },
]

const modeNavigation = [
  { name: "SEO Mode", href: "/mode/seo", icon: Search },
  { name: "Social Mode", href: "/mode/social", icon: Megaphone },
  { name: "Content Mode", href: "/mode/content", icon: FileText },
  { name: "Ads Mode", href: "/mode/ads", icon: Target },
  { name: "Email Mode", href: "/mode/email", icon: Mail },
  { name: "Web Mode", href: "/mode/web", icon: Globe },
  { name: "Analytics Mode", href: "/mode/analytics", icon: BarChart3 },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col h-screen bg-crm-card border-r border-crm-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-crm-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-crm-text">SEO CRM</h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-crm-text-secondary hover:text-crm-text hover:bg-crm-hover"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Add Button */}
      <div className="p-4">
        <Button 
          className="w-full bg-crm-primary hover:bg-crm-primary/80 text-white"
          size={collapsed ? "sm" : "default"}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Quick Add</span>}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        {!collapsed && <div className="px-3 pb-2 text-xs uppercase tracking-wide text-crm-text-secondary">Main Navigation</div>}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-crm-primary text-white"
                    : "text-crm-text-secondary hover:text-crm-text hover:bg-crm-hover",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Mode Navigation */}
      <ScrollArea className="flex-1 px-3">
        <CollapsibleSection title="Modes" collapsed={collapsed}>
          {modeNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-crm-primary text-white"
                    : "text-crm-text-secondary hover:text-crm-text hover:bg-crm-hover",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </CollapsibleSection>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-crm-border">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "space-x-3"
        )}>
          <div className="w-8 h-8 bg-crm-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-crm-text truncate">User</p>
              <p className="text-xs text-crm-text-secondary truncate">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CollapsibleSection({ title, children, collapsed }: { title: string; children: React.ReactNode; collapsed: boolean }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      {!collapsed && (
        <button
          className="w-full flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wide text-crm-text-secondary hover:text-crm-text"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{title}</span>
          {open ? <ChevronLeft className="h-3 w-3 rotate-90" /> : <ChevronRight className="h-3 w-3 -rotate-90" />}
        </button>
      )}
      <nav className={cn("space-y-1 transition-all", open ? "max-h-[1000px]" : "max-h-0 overflow-hidden")}>{children}</nav>
    </div>
  )
}
