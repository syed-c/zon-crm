"use client"

import { usePathname } from "next/navigation"
import { SimpleAppShell } from "@/components/simple-app-shell"

interface ConditionalAppShellProps {
  children: React.ReactNode
}

export function ConditionalAppShell({ children }: ConditionalAppShellProps) {
  const pathname = usePathname()
  
  // Don't show AppShell on landing page or auth pages
  const isLandingPage = pathname === "/" || pathname === "/landing"
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  
  if (isLandingPage || isAuthPage) {
    return <>{children}</>
  }
  
  return (
    <SimpleAppShell>
      {children}
    </SimpleAppShell>
  )
}