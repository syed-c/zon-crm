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
import { Plus, ExternalLink, Link as LinkIcon, TrendingUp, Target, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function BacklinksPageContent() {
  const [selectedProject, setSelectedProject] = useState<Id<"projects"> | null>(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Queries
  const projects = useQuery(api.projects.listProjects);
  const allBacklinks = selectedProject ? useQuery(api.backlinks.listBacklinksByProject, { projectId: selectedProject }) : null;
  const liveBacklinks = selectedProject ? useQuery(api.backlinks.listBacklinksByStatus, { projectId: selectedProject, status: "live" }) : null;
  const pendingBacklinks = selectedProject ? useQuery(api.backlinks.listBacklinksByStatus, { projectId: selectedProject, status: "pending" }) : null;
  const lostBacklinks = selectedProject ? useQuery(api.backlinks.listBacklinksByStatus, { projectId: selectedProject, status: "lost" }) : null;
  const backlinkStats = selectedProject ? useQuery(api.backlinks.getBacklinkStats, { projectId: selectedProject }) : null;
  const topDomains = selectedProject ? useQuery(api.backlinks.getTopDomains, { projectId: selectedProject }) : null;

  // Mutations
  const createBacklink = useMutation(api.backlinks.createBacklink);
  const updateBacklink = useMutation(api.backlinks.updateBacklink);
  const deleteBacklink = useMutation(api.backlinks.deleteBacklink);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      live: { color: "bg-green-500", label: "Live" },
      pending: { color: "bg-yellow-500", label: "Pending" },
      lost: { color: "bg-red-500", label: "Lost" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getAuthorityBadge = (authority: number | null | undefined) => {
    if (!authority) return null;
    
    let color = "bg-gray-500";
    if (authority >= 70) color = "bg-green-500";
    else if (authority >= 50) color = "bg-yellow-500";
    else if (authority >= 30) color = "bg-orange-500";
    else color = "bg-red-500";
    
    return (
      <Badge className={`${color} text-white`}>
        DA {authority}
      </Badge>
    );
  };

  const handleCreateBacklink = async (formData: FormData) => {
    if (!selectedProject) return;

    try {
      const sourceUrl = formData.get("sourceUrl") as string;
      const sourceDomain = new URL(sourceUrl).hostname;
      const anchorText = formData.get("anchorText") as string;
      const authority = parseInt(formData.get("authority") as string) || undefined;
      const notes = formData.get("notes") as string;

      await createBacklink({
        projectId: selectedProject,
        sourceUrl,
        sourceDomain,
        anchorText: anchorText || undefined,
        authority,
        notes: notes || undefined,
        status: "pending",
      });

      toast.success("Backlink added successfully!");
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add backlink");
      console.error(error);
    }
  };

  const handleUpdateStatus = async (backlinkId: Id<"backlinks">, status: string) => {
    try {
      await updateBacklink({ backlinkId, status });
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const getBacklinksByTab = () => {
    switch (selectedTab) {
      case "live": return liveBacklinks || [];
      case "pending": return pendingBacklinks || [];
      case "lost": return lostBacklinks || [];
      default: return allBacklinks || [];
    }
  };

  const backlinkList = getBacklinksByTab();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Backlinks Management</h1>
          <p className="text-gray-400 mt-2">Track and manage your backlink building campaigns</p>
        </div>
        
        {selectedProject && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Backlink
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2A2A2A] border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Backlink</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Track a new backlink for your project
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateBacklink} className="space-y-4">
                <div>
                  <Label htmlFor="sourceUrl" className="text-white">Source URL</Label>
                  <Input
                    id="sourceUrl"
                    name="sourceUrl"
                    type="url"
                    required
                    className="bg-[#121212] border-gray-600 text-white"
                    placeholder="https://example.com/page"
                  />
                </div>
                <div>
                  <Label htmlFor="anchorText" className="text-white">Anchor Text</Label>
                  <Input
                    id="anchorText"
                    name="anchorText"
                    className="bg-[#121212] border-gray-600 text-white"
                    placeholder="Link anchor text"
                  />
                </div>
                <div>
                  <Label htmlFor="authority" className="text-white">Domain Authority</Label>
                  <Input
                    id="authority"
                    name="authority"
                    type="number"
                    min="0"
                    max="100"
                    className="bg-[#121212] border-gray-600 text-white"
                    placeholder="Domain authority score (0-100)"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-white">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    className="bg-[#121212] border-gray-600 text-white"
                    placeholder="Additional notes about this backlink"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white">
                  Add Backlink
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Project Selection */}
      <Card className="bg-[#2A2A2A] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Select Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject || ""} onValueChange={(value) => setSelectedProject(value as Id<"projects">)}>
            <SelectTrigger className="bg-[#121212] border-gray-600 text-white">
              <SelectValue placeholder="Choose a project to manage backlinks" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A] border-gray-600">
              {projects?.map((project) => (
                <SelectItem key={project._id} value={project._id} className="text-white">
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedProject && backlinkStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Backlinks</p>
                  <p className="text-2xl font-bold text-white">{backlinkStats.total}</p>
                </div>
                <LinkIcon className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Live Links</p>
                  <p className="text-2xl font-bold text-green-500">{backlinkStats.live}</p>
                </div>
                <ExternalLink className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500">{backlinkStats.pending}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Avg. Authority</p>
                  <p className="text-2xl font-bold text-blue-500">{backlinkStats.averageAuthority}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-[#2A2A2A]">
                <TabsTrigger value="all" className="text-white data-[state=active]:bg-[#1DB954]">
                  All ({allBacklinks?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="live" className="text-white data-[state=active]:bg-[#1DB954]">
                  Live ({liveBacklinks?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-white data-[state=active]:bg-[#1DB954]">
                  Pending ({pendingBacklinks?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="lost" className="text-white data-[state=active]:bg-[#1DB954]">
                  Lost ({lostBacklinks?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                <div className="space-y-4">
                  {backlinkList.map((backlink) => (
                    <Card key={backlink._id} className="bg-[#2A2A2A] border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-white font-medium">{backlink.sourceDomain}</h3>
                              {getAuthorityBadge(backlink.authority)}
                              {getStatusBadge(backlink.status || "pending")}
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{backlink.sourceUrl}</p>
                            {backlink.anchorText && (
                              <p className="text-blue-400 text-sm mb-2">"{backlink.anchorText}"</p>
                            )}
                            {backlink.notes && (
                              <p className="text-gray-500 text-sm">{backlink.notes}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-2">
                              Added: {new Date(backlink.discoveredAt || 0).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(backlink.sourceUrl, '_blank')}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Select
                              value={backlink.status || "pending"}
                              onValueChange={(status) => handleUpdateStatus(backlink._id, status)}
                            >
                              <SelectTrigger className="w-24 bg-[#121212] border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#2A2A2A] border-gray-600">
                                <SelectItem value="pending" className="text-white">Pending</SelectItem>
                                <SelectItem value="live" className="text-white">Live</SelectItem>
                                <SelectItem value="lost" className="text-white">Lost</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {backlinkList.length === 0 && (
                    <Card className="bg-[#2A2A2A] border-gray-700">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <LinkIcon className="w-12 h-12 text-gray-500 mb-4" />
                        <p className="text-gray-400 text-center">
                          No backlinks found for this status.
                          <br />
                          Add your first backlink to get started.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            {topDomains && topDomains.length > 0 && (
              <Card className="bg-[#2A2A2A] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Top Domains</CardTitle>
                  <CardDescription className="text-gray-400">
                    Highest authority linking domains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topDomains.slice(0, 10).map((domain: any, index) => (
                      <div key={domain.domain} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-sm w-4">#{index + 1}</span>
                          <span className="text-white text-sm">{domain.domain}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                            {domain.count} links
                          </Badge>
                          {getAuthorityBadge(domain.authority)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {!selectedProject && (
        <Card className="bg-[#2A2A2A] border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">
              Select a project above to start managing backlinks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}