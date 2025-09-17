"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Eye
} from "lucide-react"
import Link from "next/link"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { fetchProjectsWithStats, ProjectWithStats, deleteProject } from "@/services/projectsService"

export default function ProjectsListEnhanced() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [projects, setProjects] = useState<ProjectWithStats[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchProjectsWithStats()
        if (!cancelled) setProjects(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load projects")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const handleDeleteProject = async (idOrSlug: string) => {
    const confirmed = window.confirm("Delete this project? This cannot be undone.")
    if (!confirmed) return
    try {
      await deleteProject(idOrSlug)
      setProjects(prev => prev.filter(p => p.id !== idOrSlug && p.slug !== idOrSlug))
    } catch (e: any) {
      alert(e?.message || "Failed to delete project")
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "on-hold": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="h-3 w-3" />
      case "completed": return <CheckCircle className="h-3 w-3" />
      case "on-hold": return <AlertTriangle className="h-3 w-3" />
      case "cancelled": return <AlertTriangle className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  if (loading) {
    return <div className="p-6"><Card className="bg-crm-card border-crm-border"><CardContent>Loading projects...</CardContent></Card></div>
  }

  if (error) {
    return <div className="p-6"><Card className="bg-crm-card border-crm-border"><CardContent className="text-red-400">{error}</CardContent></Card></div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-crm-text">Projects</h1>
          <p className="text-crm-text-secondary">Manage your client projects and campaigns</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crm-text-secondary h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80 bg-crm-surface border-crm-border text-crm-text placeholder:text-crm-text-secondary"
            />
          </div>
          <Button variant="outline" className="border-crm-border text-crm-text hover:bg-crm-hover">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <CreateProjectDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-crm-card border-crm-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-crm-text-secondary">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-crm-text">{projects.length}</div>
            <p className="text-xs text-green-400">+2 this month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-crm-card border-crm-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-crm-text-secondary">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-crm-text">
              {projects.filter(p => p.status === "active").length}
            </div>
            <p className="text-xs text-green-400">Currently running</p>
          </CardContent>
        </Card>
        
        <Card className="bg-crm-card border-crm-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-crm-text-secondary">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-crm-text">
              {projects.filter(p => p.status === "completed").length}
            </div>
            <p className="text-xs text-blue-400">Successfully delivered</p>
          </CardContent>
        </Card>
        
        <Card className="bg-crm-card border-crm-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-crm-text-secondary">On Hold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-crm-text">
              {projects.filter(p => p.status === "on-hold").length}
            </div>
            <p className="text-xs text-yellow-400">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="bg-crm-card border-crm-border hover:border-crm-primary/50 transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-crm-text mb-1">{project.name}</CardTitle>
                  <CardDescription className="text-crm-text-secondary line-clamp-2">
                    {project.description || "No description provided"}
                  </CardDescription>
                </div>
                {/* Removed 3-dots menu per requirements */}
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <Badge variant="outline" className={`text-xs ${getStatusColor(project.status || "active")}`}>
                  {getStatusIcon(project.status || "active")}
                  <span className="ml-1 capitalize">{project.status || "active"}</span>
                </Badge>
                <div className="flex items-center space-x-1">
                  {(project.tags || []).slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-crm-primary/20 text-crm-primary">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags && project.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-crm-surface text-crm-text-secondary">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-crm-text-secondary">Progress</span>
                  <span className="text-crm-text font-medium">
                    {project.progress_pct}%
                  </span>
                </div>
                <Progress value={project.progress_pct} className="h-2" />
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-crm-text-secondary" />
                  <div>
                    <p className="text-crm-text-secondary">Due Date</p>
                    <p className="text-crm-text font-medium">
                      {project.due_date 
                        ? new Date(project.due_date).toLocaleDateString()
                        : "Not set"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-crm-text-secondary" />
                  <div>
                    <p className="text-crm-text-secondary">Tasks</p>
                    <p className="text-crm-text font-medium">
                      {project.task_total} total
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mt-4">
                <Button asChild size="sm" className="flex-1 bg-crm-primary hover:bg-crm-primary/90 text-white">
                  <Link href={`/projects/${project.slug || project.id}`}>
                    View Project
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-crm-border text-crm-text hover:bg-crm-hover">
                  <Link href={`/mode/seo/${project.slug || project.id}`}>
                    Manage
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleDeleteProject(project.slug || project.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="bg-crm-card border-crm-border">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-crm-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-crm-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-crm-text mb-2">
              {searchTerm ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-crm-text-secondary mb-4">
              {searchTerm 
                ? `No projects match "${searchTerm}". Try adjusting your search.`
                : "Get started by creating your first project."
              }
            </p>
            {!searchTerm && (
              <Button className="bg-crm-primary hover:bg-crm-primary/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
