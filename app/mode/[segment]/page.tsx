"use client"

import { useParams, useSearchParams } from "next/navigation"
import { ModeWorkspace } from "@/components/mode-workspace"
import { redirect } from "next/navigation"

export default function ModePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  const segment = params.segment as string
  const project = searchParams.get('project') || searchParams.get('projectId')
  const tab = searchParams.get('tab') || 'overview'

  // If query-style with project provided, canonicalize to path /mode/[segment]/[slug]
  if (project) {
    // Keep tab if present
    const suffix = tab ? `?tab=${encodeURIComponent(tab)}` : ''
    redirect(`/mode/${segment}/${project}${suffix}`)
  }

  return (
    <ModeWorkspace 
      segment={segment}
    />
  )
}