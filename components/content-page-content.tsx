


"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function ContentPageContent() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);

  // Queries
  const allContent = useQuery(api.content.listAllContent);
  const draftContent = useQuery(api.content.listContentsByStatus, { status: "draft" });
  const inProgressContent = useQuery(api.content.listContentsByStatus, { status: "in_progress" });
  const readyContent = useQuery(api.content.listContentsByStatus, { status: "ready" });
  const publishedContent = useQuery(api.content.listContentsByStatus, { status: "published" });
  const projects = useQuery(api.projects.listProjects);

  // Mutations
  const createContent = useMutation(api.content.createContent);
  const patchContent = useMutation(api.content.patchContent);
  const deleteContent = useMutation(api.content.deleteContent);
  const submitForReview = useMutation(api.content.submitForReview);
  const editorDecision = useMutation(api.content.editorDecision);
  const managerPublish = useMutation(api.content.managerPublish);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-500", icon: FileText, label: "Draft" },
      in_progress: { color: "bg-yellow-500", icon: Clock, label: "In Progress" },
      ready: { color: "bg-blue-500", icon: CheckCircle, label: "Ready for Review" },
      published: { color: "bg-green-500", icon: CheckCircle, label: "Published" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleCreateContent = async (formData: FormData) => {
    try {
      const title = formData.get("title") as string;
      const url = formData.get("url") as string;
      const targetKeyword = formData.get("targetKeyword") as string;
      const wordCount = parseInt(formData.get("wordCount") as string) || undefined;
      const projectId = formData.get("projectId") as Id<"projects"> | undefined;

      await createContent({
        title,
        url,
        targetKeyword: targetKeyword || undefined,
        wordCount,
        projectId,
        status: "draft",
      });

      toast.success("Content created successfully!");
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create content");
      console.error(error);
    }
  };

  const handleSubmitForReview = async (contentId: Id<"content">) => {
    try {
      await submitForReview({ contentId });
      toast.success("Content submitted for review!");
    } catch (error) {
      toast.error("Failed to submit content");
      console.error(error);
    }
  };

  const handleEditorDecision = async (contentId: Id<"content">, decision: "approve" | "reject", comment?: string) => {
    try {
      await editorDecision({ contentId, decision, comment });
      toast.success(`Content ${decision}d successfully!`);
    } catch (error) {
      toast.error(`Failed to ${decision} content`);
      console.error(error);
    }
  };

  const handlePublish = async (contentId: Id<"content">) => {
    try {
      await managerPublish({ contentId });
      toast.success("Content published successfully!");
    } catch (error) {
      toast.error("Failed to publish content");
      console.error(error);
    }
  };

  const handleDelete = async (contentId: Id<"content">) => {
    try {
      await deleteContent({ contentId });
      toast.success("Content deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete content");
      console.error(error);
    }
  };

  const getContentByTab = () => {
    switch (selectedTab) {
      case "draft": return draftContent || [];
      case "in_progress": return inProgressContent || [];
      case "ready": return readyContent || [];
      case "published": return publishedContent || [];
      default: return allContent || [];
    }
  };

  const contentList = getContentByTab();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Management</h1>
          <p className="text-gray-400 mt-2">Manage your content pipeline with approval workflows</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#2A2A2A] border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Content</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new piece of content to your pipeline
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateContent} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  className="bg-[#121212] border-gray-600 text-white"
                  placeholder="Enter content title"
                />
              </div>
              <div>
                <Label htmlFor="url" className="text-white">URL</Label>
                <Input
                  id="url"
                  name="url"
                  required
                  className="bg-[#121212] border-gray-600 text-white"
                  placeholder="Enter target URL"
                />
              </div>
              <div>
                <Label htmlFor="targetKeyword" className="text-white">Target Keyword</Label>
                <Input
                  id="targetKeyword"
                  name="targetKeyword"
                  className="bg-[#121212] border-gray-600 text-white"
                  placeholder="Enter target keyword"
                />
              </div>
              <div>
                <Label htmlFor="wordCount" className="text-white">Word Count</Label>
                <Input
                  id="wordCount"
                  name="wordCount"
                  type="number"
                  className="bg-[#121212] border-gray-600 text-white"
                  placeholder="Enter word count"
                />
              </div>
              <div>
                <Label htmlFor="projectId" className="text-white">Project</Label>
                <Select name="projectId">
                  <SelectTrigger className="bg-[#121212] border-gray-600 text-white">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-gray-600">
                    {projects?.map((project) => (
                      <SelectItem key={project._id} value={project._id} className="text-white">
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white">
                Create Content
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-[#2A2A2A]">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-[#1DB954]">
            All ({allContent?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="draft" className="text-white data-[state=active]:bg-[#1DB954]">
            Draft ({draftContent?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="text-white data-[state=active]:bg-[#1DB954]">
            In Progress ({inProgressContent?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="ready" className="text-white data-[state=active]:bg-[#1DB954]">
            Ready ({readyContent?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="published" className="text-white data-[state=active]:bg-[#1DB954]">
            Published ({publishedContent?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid gap-4">
            {contentList.map((content) => (
              <Card key={content._id} className="bg-[#2A2A2A] border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{content.title}</CardTitle>
                      <CardDescription className="text-gray-400 mt-1">
                        {content.url}
                      </CardDescription>
                      {content.targetKeyword && (
                        <Badge variant="outline" className="mt-2 text-gray-400 border-gray-600">
                          {content.targetKeyword}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(content.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      {content.wordCount && `${content.wordCount} words`}
                      {content.deadline && (
                        <span className="ml-4">
                          Due: {new Date(content.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {content.status === "draft" && (
                        <Button
                          size="sm"
                          onClick={() => handleSubmitForReview(content._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Submit for Review
                        </Button>
                      )}
                      {content.status === "ready" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleEditorDecision(content._id, "approve")}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEditorDecision(content._id, "reject")}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePublish(content._id)}
                            className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
                          >
                            Publish
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(content._id)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {contentList.length === 0 && (
              <Card className="bg-[#2A2A2A] border-gray-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-gray-500 mb-4" />
                  <p className="text-gray-400 text-center">
                    No content found for this status.
                    <br />
                    Create your first piece of content to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}