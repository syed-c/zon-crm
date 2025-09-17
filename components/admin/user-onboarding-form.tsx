
"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Shield, 
  Settings, 
  FolderOpen, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import { ROLES, MODULES, CAPABILITIES } from "@/convex/rbac";

interface UserFormData {
  // Step 1: Basics
  name: string;
  email: string;
  status: "active" | "inactive";
  
  // Step 2: Role
  role: string;
  
  // Step 3: Feature Permissions
  permissions: Record<string, string[]>;
  
  // Step 4: Project Access
  projectAccess: string[];
  allProjects: boolean;
}

const STEPS = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Role", icon: Shield },
  { id: 3, title: "Permissions", icon: Settings },
  { id: 4, title: "Projects", icon: FolderOpen },
  { id: 5, title: "Review", icon: Check },
];

const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: "Admin", description: "Full system access except user management" },
  { value: ROLES.PROJECT_MANAGER, label: "Project Manager", description: "Manage projects and team workflows" },
  { value: ROLES.SEO_SPECIALIST, label: "SEO Specialist", description: "Focus on SEO tasks and optimization" },
  { value: ROLES.CONTENT_WRITER, label: "Content Writer", description: "Create and edit content" },
  { value: ROLES.LINK_BUILDER, label: "Link Builder", description: "Manage backlinks and outreach" },
  { value: ROLES.AUDITOR, label: "Auditor", description: "Perform technical SEO audits" },
  { value: ROLES.DESIGNER, label: "Designer", description: "Handle visual content and assets" },
  { value: ROLES.CLIENT, label: "Client", description: "Read-only access to assigned projects" },
];

export default function UserOnboardingForm({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    status: "active",
    role: "",
    permissions: {},
    projectAccess: [],
    allProjects: false,
  });

  // Queries
  const projects = useQuery(api.projects.listProjects);
  
  // Mutations
  const createUser = useMutation(api.rbac.createUserWithRole);

  const updateFormData = (updates: Partial<UserFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await createUser({
        email: formData.email,
        name: formData.name,
        role: formData.role,
        projectAccess: formData.allProjects ? undefined : formData.projectAccess.map(id => id as any),
      });

      toast.success("User created successfully! Invitation email sent.");
      onComplete?.();
    } catch (error) {
      toast.error("Failed to create user");
      console.error(error);
    }
  };

  const getStepProgress = () => ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-crm-text">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                className="bg-crm-bg border-crm-border text-crm-text"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-crm-text">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                className="bg-crm-bg border-crm-border text-crm-text"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-crm-text">Status</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "inactive") => updateFormData({ status: value })}>
                <SelectTrigger className="bg-crm-bg border-crm-border text-crm-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crm-surface border-crm-border">
                  <SelectItem value="active" className="text-crm-text">Active</SelectItem>
                  <SelectItem value="inactive" className="text-crm-text">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-crm-text text-lg font-medium">Select Role</Label>
              <p className="text-crm-muted text-sm mb-4">Choose the primary role for this user</p>
            </div>
            <div className="grid gap-3">
              {ROLE_OPTIONS.map((role) => (
                <div
                  key={role.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.role === role.value
                      ? "border-crm-primary bg-crm-primary/10"
                      : "border-crm-border hover:border-crm-primary/50"
                  }`}
                  onClick={() => updateFormData({ role: role.value })}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-crm-text font-medium">{role.label}</h3>
                      <p className="text-crm-muted text-sm mt-1">{role.description}</p>
                    </div>
                    {formData.role === role.value && (
                      <Check className="w-5 h-5 text-crm-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-crm-text text-lg font-medium">Feature Permissions</Label>
              <p className="text-crm-muted text-sm">Customize permissions for each module</p>
            </div>
            
            <div className="grid gap-4">
              {Object.values(MODULES).map((module) => (
                <Card key={module} className="bg-crm-bg border-crm-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-crm-text text-base capitalize">{module}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(CAPABILITIES).map((capability) => (
                        <div key={capability} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${module}-${capability}`}
                            checked={formData.permissions[module]?.includes(capability) || false}
                            onCheckedChange={(checked) => {
                              const modulePerms = formData.permissions[module] || [];
                              const newPerms = checked
                                ? [...modulePerms, capability]
                                : modulePerms.filter(p => p !== capability);
                              
                              updateFormData({
                                permissions: {
                                  ...formData.permissions,
                                  [module]: newPerms,
                                }
                              });
                            }}
                          />
                          <Label 
                            htmlFor={`${module}-${capability}`}
                            className="text-crm-text text-sm capitalize cursor-pointer"
                          >
                            {capability}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-crm-text text-lg font-medium">Project Access</Label>
              <p className="text-crm-muted text-sm">Select which projects this user can access</p>
            </div>
            
            <div className="flex items-center space-x-2 p-4 bg-crm-bg rounded-lg border border-crm-border">
              <Checkbox
                id="all-projects"
                checked={formData.allProjects}
                onCheckedChange={(checked) => updateFormData({ allProjects: !!checked })}
              />
              <Label htmlFor="all-projects" className="text-crm-text cursor-pointer">
                Access to all current and future projects
              </Label>
            </div>

            {!formData.allProjects && (
              <div className="space-y-2">
                <Label className="text-crm-text">Select Specific Projects</Label>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {projects?.map((project) => (
                    <div key={project._id} className="flex items-center space-x-2 p-2 hover:bg-crm-hover rounded">
                      <Checkbox
                        id={project._id}
                        checked={formData.projectAccess.includes(project._id)}
                        onCheckedChange={(checked) => {
                          const newAccess = checked
                            ? [...formData.projectAccess, project._id]
                            : formData.projectAccess.filter(id => id !== project._id);
                          updateFormData({ projectAccess: newAccess });
                        }}
                      />
                      <Label htmlFor={project._id} className="text-crm-text cursor-pointer flex-1">
                        {project.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-crm-text text-lg font-medium">Review & Confirm</Label>
              <p className="text-crm-muted text-sm">Please review the user details before creating</p>
            </div>

            <div className="space-y-4">
              <Card className="bg-crm-bg border-crm-border">
                <CardHeader>
                  <CardTitle className="text-crm-text text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-crm-muted">Name:</span>
                    <span className="text-crm-text">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crm-muted">Email:</span>
                    <span className="text-crm-text">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crm-muted">Status:</span>
                    <Badge className={formData.status === "active" ? "bg-crm-success" : "bg-gray-500"}>
                      {formData.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-crm-bg border-crm-border">
                <CardHeader>
                  <CardTitle className="text-crm-text text-base">Role & Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-crm-muted">Role:</span>
                    <Badge className="bg-crm-primary">
                      {ROLE_OPTIONS.find(r => r.value === formData.role)?.label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crm-muted">Project Access:</span>
                    <span className="text-crm-text">
                      {formData.allProjects ? "All Projects" : `${formData.projectAccess.length} Selected`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.role;
      case 3:
        return true; // Permissions are optional
      case 4:
        return formData.allProjects || formData.projectAccess.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-crm-text">Add Team Member</h1>
          <div className="text-sm text-crm-muted">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>
        
        <Progress value={getStepProgress()} className="w-full" />
        
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isCompleted 
                    ? "bg-crm-success border-crm-success text-white"
                    : isActive
                    ? "border-crm-primary text-crm-primary"
                    : "border-crm-border text-crm-muted"
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`ml-2 text-sm ${
                  isActive ? "text-crm-text font-medium" : "text-crm-muted"
                }`}>
                  {step.title}
                </span>
                {index < STEPS.length - 1 && (
                  <div className="w-8 h-px bg-crm-border mx-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="bg-crm-card border-crm-border">
        <CardHeader>
          <CardTitle className="text-crm-text">
            {STEPS.find(s => s.id === currentStep)?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-crm-border text-crm-text hover:bg-crm-hover"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentStep < STEPS.length ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-crm-primary hover:bg-crm-primary/80 text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="bg-crm-success hover:bg-crm-success/80 text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Create & Send Invite
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
