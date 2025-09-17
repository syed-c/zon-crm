"use client"

import { useState } from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { createProject as createProjectSupabase } from "@/services/projectsService"
import { fetchClients } from "@/services/clientsService"
import { Id } from "@/convex/_generated/dataModel"

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientId: "",
    status: "active",
    tags: ""
  })

  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const data = await fetchClients()
      if (!cancelled) setClients(data)
    })()
    return () => { cancelled = true }
  }, [])
  // Legacy Convex create disabled; use Supabase service

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.clientId) return

    setIsLoading(true)
    try {
      const base = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const slug = base || `project-${Date.now()}`
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []

      await createProjectSupabase({
        name: formData.name,
        description: formData.description || undefined,
        clientId: formData.clientId,
        status: formData.status as any,
        dueDate: (formData as any).dueDate || undefined,
        tags: tags.length ? tags : undefined,
        slug,
      })

      setFormData({ name: "", description: "", clientId: "", status: "active", tags: "" } as any)
      setOpen(false)
    } catch (error) {
      console.error("Failed to create project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-crm-primary hover:bg-crm-primary/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-crm-card border-crm-border">
        <DialogHeader>
          <DialogTitle className="text-crm-text">Create New Project</DialogTitle>
          <DialogDescription className="text-crm-text-secondary">
            Add a new project to track campaigns and deliverables.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-crm-text">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name"
              className="bg-crm-surface border-crm-border text-crm-text placeholder:text-crm-text-secondary focus-visible:ring-crm-primary focus-visible:ring-1 focus-visible:ring-offset-0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client" className="text-crm-text">Client</Label>
            <Select value={formData.clientId} onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}>
              <SelectTrigger className="bg-crm-surface border-crm-border text-crm-text focus-visible:ring-crm-primary focus-visible:ring-1 focus-visible:ring-offset-0">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent className="bg-crm-card border-crm-border">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id} className="text-crm-text">
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-crm-text">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description..."
              className="bg-crm-surface border-crm-border text-crm-text placeholder:text-crm-text-secondary focus-visible:ring-crm-primary focus-visible:ring-1 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-crm-text">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="SEO, Content, Social Media"
              className="bg-crm-surface border-crm-border text-crm-text placeholder:text-crm-text-secondary focus-visible:ring-crm-primary focus-visible:ring-1 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-crm-text">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              onChange={(e) => setFormData(prev => ({ ...(prev as any), dueDate: e.target.value }))}
              className="bg-crm-surface border-crm-border text-crm-text placeholder:text-crm-text-secondary focus-visible:ring-crm-primary focus-visible:ring-1 focus-visible:ring-offset-0"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-crm-border text-crm-text">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name || !formData.clientId} className="bg-crm-primary hover:bg-crm-primary/90 text-white">
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}