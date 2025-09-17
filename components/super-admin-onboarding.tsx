
"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Shield, 
  Settings, 
  FolderOpen, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react"
import { toast } from "sonner"

const ROLES = [
  { value: "super_admin", label: "Super Admin", description: "Full system access" },
  { value: "admin", label: "Admin", description: "Administrative access" },
  { value: "project_manager", label: "Project Manager", description: "Manage projects and teams" },
  { value: "seo_specialist", label: "SEO Specialist", description: "SEO-focused work" },
  { value: "content_writer", label: "Content Writer", description: "Content creation and editing" },
  { value: "link_builder", label: "Link Builder", description: "Backlink and outreach work" },
  { value: "auditor", label: "Auditor", description: "Technical audits and analysis" },
  { value: "designer", label: "Designer", description: "Creative and design work" },
  { value: "client", label: "Client", description: "Read-only client access" },
]

const MODULES = [
  { key: "projects", label: "Projects", description: "Project management and oversight" },
  { key: "seo", label: "SEO", description: "Search engine optimization" },
  { key: "content", label: "Content", description: "Content creation and management" },
  { key: "social", label: "Social", description: "Social media management" },
  { key: "reports", label: "Reports", description: "Analytics and reporting" },
  { key: "files", label: "Files", description: "File and asset management" },
  { key: "settings", label: "Settings", description: "System configuration" },
  { key: "clients", label: "Clients", description: "Client management" },
  { key: "tasks", label: "Tasks", description: "Task and workflow management" },
]

const CAPABILITIES = [
  { key: "view", label: "View", description: "Read access" },
  { key: "edit", label: "Edit", description: "Modify content" },
  { key: "approve", label: "Approve", description: "Approve submissions" },
  { key: "export", label: "Export", description: "Export data" },
]

interface OnboardingData {
  name: string
  email: string
  role: string
  permissions: Record<string, string[]>
  projectAccess: string[]
  accessType: "all" | "selected"
}

export function SuperAdminOnboarding() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    name: "",
    email: "",
    role: "",
    permissions: {},
    projectAccess: [],
    accessType: "all",
  })

  const projects = useQuery(api.projects.listProjects)
  const createUser = useMutation(api.rbac.createUserWithRole)

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePermissionChange = (module: string, capability: string, checked: boolean) => {
    setData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: checked 
          ? [...(prev.permissions[module] || []), capability]
          : (prev.permissions[module] || []).filter(c => c !== capability)
      }
    }))
  }

  const handleProjectAccessChange = (projectId: string, checked: boolean) => {
    setData(prev => ({
      ...prev,
      projectAccess: checked
        ? [...prev.projectAccess, projectId]
        : prev.projectAccess.filter(id => id !== projectId)
    }))
  }

  const handleSubmit = async () => {
    try {
      await createUser({
        name: data.name,
        email: data.email,
        role: data.role,
        projectAccess: data.accessType === "all" ? undefined : data.projectAccess as any,
      })
      
      toast.success("User created successfully!")
      
      // Reset form
      setData({
        name: "",
        email: "",
        role: "",
        permissions: {},
        projectAccess: [],
        accessType: "all",
      })
      setStep(1)
    } catch (error) {
      toast.error("Failed to create user")
      console.error(error)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1: return data.name && data.email
      case 2: return data.role
      case 3: return Object.keys(data.permissions).length > 0
      case 4: return data.accessType === "all" || data.projectAccess.length > 0
      default: return true
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-crm-card border-crm-border">
        <CardHeader>
          <CardTitle className="flex items-center text-crm-text">
            <User className="h-6 w-6 mr-2" />
            Add Team Member
          </CardTitle>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-4">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= stepNum 
                    ? 'bg-crm-primary text-white' 
                    : 'bg-crm-hover text-crm-muted'
                  }
                `}>
                  {step > stepNum ? <CheckCircle className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 5 && (
                  <div className={`w-12 h-0.5 ${step > stepNum ? 'bg-crm-primary' : 'bg-crm-hover'}`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-crm-text">Basic Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-crm-text">Full Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-crm-hover border-crm-border text-crm-text"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-crm-text">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-crm-hover border-crm-border text-crm-text"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-crm-text">Select Role</h3>
              
              <div className="grid gap-3 md:grid-cols-2">
                {ROLES.map((role) => (
                  <Card 
                    key={role.value}
                    className={`cursor-pointer transition-colors ${
                      data.role === role.value 
                        ? 'border-crm-primary bg-crm-primary/10' 
                        : 'border-crm-border hover:border-crm-primary/50'
                    }`}
                    onClick={() => setData(prev => ({ ...prev, role: role.value }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-crm-primary" />
                        <div>
                          <h4 className="font-medium text-crm-text">{role.label}</h4>
                          <p className="text-sm text-crm-muted">{role.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Feature Permissions */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-crm-text">Feature Permissions</h3>
              
              <div className="space-y-4">
                {MODULES.map((module) => (
                  <Card key={module.key} className="bg-crm-hover border-crm-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-crm-text">{module.label}</h4>
                          <p className="text-sm text-crm-muted">{module.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {CAPABILITIES.map((capability) => (
                          <div key={capability.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${module.key}-${capability.key}`}
                              checked={(data.permissions[module.key] || []).includes(capability.key)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(module.key, capability.key, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={`${module.key}-${capability.key}`}
                              className="text-sm text-crm-text cursor-pointer"
                            >
                              {capability.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Project Access */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-crm-text">Project Access</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="access-all"
                      checked={data.accessType === "all"}
                      onCheckedChange={() => setData(prev => ({ ...prev, accessType: "all" }))}
                    />
                    <Label htmlFor="access-all" className="text-crm-text">
                      All current and future projects
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="access-selected"
                      checked={data.accessType === "selected"}
                      onCheckedChange={() => setData(prev => ({ ...prev, accessType: "selected" }))}
                    />
                    <Label htmlFor="access-selected" className="text-crm-text">
                      Selected projects only
                    </Label>
                  </div>
                </div>

                {data.accessType === "selected" && (
                  <div className="grid gap-3 md:grid-cols-2">
                    {projects?.map((project) => (
                      <Card 
                        key={project._id}
                        className={`cursor-pointer transition-colors ${
                          data.projectAccess.includes(project._id) 
                            ? 'border-crm-primary bg-crm-primary/10' 
                            : 'border-crm-border hover:border-crm-primary/50'
                        }`}
                        onClick={() => handleProjectAccessChange(
                          project._id, 
                          !data.projectAccess.includes(project._id)
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <FolderOpen className="h-5 w-5 text-crm-primary" />
                            <div>
                              <h4 className="font-medium text-crm-text">{project.name}</h4>
                              <p className="text-sm text-crm-muted">{project.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review & Invite */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-crm-text">Review & Invite</h3>
              
              <div className="space-y-4">
                <Card className="bg-crm-hover border-crm-border">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-crm-text mb-2">User Details</h4>
                    <p className="text-crm-muted">Name: {data.name}</p>
                    <p className="text-crm-muted">Email: {data.email}</p>
                    <p className="text-crm-muted">
                      Role: {ROLES.find(r => r.value === data.role)?.label}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-crm-hover border-crm-border">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-crm-text mb-2">Permissions Summary</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(data.permissions).map(([module, capabilities]) => (
                        <Badge key={module} variant="secondary" className="bg-crm-primary/20 text-crm-primary">
                          {module}: {capabilities.join(", ")}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-crm-hover border-crm-border">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-crm-text mb-2">Project Access</h4>
                    <p className="text-crm-muted">
                      {data.accessType === "all" 
                        ? "All current and future projects" 
                        : `${data.projectAccess.length} selected projects`
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <Separator className="bg-crm-border" />
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
              className="border-crm-border text-crm-muted hover:bg-crm-hover"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-crm-primary hover:bg-crm-primary/80 text-white"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-crm-success hover:bg-crm-success/80 text-white"
              >
                Create User & Send Invite
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
