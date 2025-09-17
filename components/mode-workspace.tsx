"use client"

import ModeWorkspaceEnhanced from "./mode-workspace-enhanced"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { fetchProjectBySlug } from "@/services/projectsService"

interface ModeWorkspaceProps {
  segment: string
}

export function ModeWorkspace({ segment }: ModeWorkspaceProps) {
  const searchParams = useSearchParams()
  const projectParam = searchParams.get("project") || searchParams.get("projectId")
  const [resolvedId, setResolvedId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!projectParam) { setResolvedId(null); return }
      // Try to resolve as slug first
      const proj = await fetchProjectBySlug(projectParam)
      if (!cancelled) setResolvedId(proj?.id || projectParam)
    })()
    return () => { cancelled = true }
  }, [projectParam])

  return <ModeWorkspaceEnhanced segment={segment} />
}
