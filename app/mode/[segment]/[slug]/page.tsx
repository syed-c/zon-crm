import { ModeWorkspace } from "@/components/mode-workspace"
import { fetchProjectBySlug } from "@/services/projectsService"

interface PageProps {
  params: Promise<{ segment: string; slug: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function ModeSegmentSlugPage({ params, searchParams }: PageProps) {
  const { segment, slug } = await params
  const sp = await searchParams
  const tab = sp?.tab || "overview"

  // Resolve slug to id server-side if possible (optional for now)
  const proj = await fetchProjectBySlug(slug)
  const resolvedId = proj?.id || slug

  return <ModeWorkspace segment={segment} />
}


