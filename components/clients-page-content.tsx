"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Building, Globe, Mail, Phone, FolderOpen, BarChart3, Users } from "lucide-react";
import { toast } from "sonner";
import { fetchClients, createClient as createClientSb } from "@/services/clientsService";
import { supabase } from "@/lib/supabaseClient";

export default function ClientsPageContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clients, setClients] = useState<{ id: string; name: string; website?: string | null; email?: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [clientProjects, setClientProjects] = useState<Array<{ id: string; name: string; status?: string | null; due_date?: string | null; slug?: string | null }>>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchClients();
        if (!cancelled) setClients(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load clients");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  // Load projects for selected client
  useEffect(() => {
    if (!selectedClient) {
      setClientProjects([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setProjectsLoading(true);
      // Try with optional columns first; fall back if they don't exist
      let sel = "id,name,status,due_date,slug,client_id";
      let q = await supabase
        .from("projects")
        .select(sel)
        .eq("client_id", selectedClient)
        .order("created_at", { ascending: false });
      let data = q.data;
      let err = q.error;
      if (err && (err.code === "42703" || err.code === "PGRST204")) {
        const retry = await supabase
          .from("projects")
          .select("id,name,client_id")
          .eq("client_id", selectedClient)
          .order("created_at", { ascending: false });
        data = retry.data as any;
        err = retry.error as any;
      }
      if (!cancelled) {
        if (err) {
          // eslint-disable-next-line no-console
          console.error("Failed to load client projects", err);
          setClientProjects([]);
        } else {
          setClientProjects((data as any[]) || []);
        }
        setProjectsLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [selectedClient]);

  const handleCreateClient = async (formData: FormData) => {
    try {
      const name = formData.get("name") as string;
      const website = formData.get("website") as string;
      const contactEmail = formData.get("contactEmail") as string;
      const phone = formData.get("phone") as string;
      const notes = formData.get("notes") as string;

      const newId = await createClientSb({
        name,
        website: website || undefined,
        contactEmail: contactEmail || undefined,
      });

      toast.success("Client created successfully!");
      setIsCreateDialogOpen(false);
      setClients((prev) => [{ id: newId, name, website, email: contactEmail }, ...prev]);
    } catch (error) {
      toast.error("Failed to create client in Supabase");
      console.error(error);
    }
  };

  const handleDeleteClient = async (_clientId: string) => {
    toast.error("Client delete not implemented in Supabase demo yet");
  };

  const selectedClientData = clients?.find(c => c.id === selectedClient);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Management</h1>
          <p className="text-gray-400 mt-2">Manage your clients and their project portfolios</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#2A2A2A] border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Client</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a new client profile
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateClient} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="bg-[#121212] border-gray-600 text-white"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="website" className="text-white">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  className="bg-[#121212] border-gray-600 text-white"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail" className="text-white">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  className="bg-[#121212] border-gray-600 text-white"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="bg-[#121212] border-gray-600 text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-white">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  className="bg-[#121212] border-gray-600 text-white"
                  placeholder="Additional notes about the client"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white">
                Create Client
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients List */}
        <div className="lg:col-span-1">
          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Clients ({clients?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clients?.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedClient === client.id
                        ? "border-[#1DB954] bg-[#1DB954]/10"
                        : "border-gray-700 hover:border-gray-600 hover:bg-[#121212]"
                    }`}
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">{client.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClient(client.id);
                        }}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </Button>
                    </div>
                    {client.website && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Globe className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400 text-sm">{client.website}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400 text-sm">{client.email}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {clients?.length === 0 && (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No clients yet.</p>
                    <p className="text-gray-500 text-sm">Add your first client to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-2">
          {selectedClient && selectedClientData ? (
            <div className="space-y-6">
              {/* Client Info */}
              <Card className="bg-[#2A2A2A] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    {selectedClientData.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Client Information & Contact Details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedClientData.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a
                          href={selectedClientData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {selectedClientData.website}
                        </a>
                      </div>
                    )}
                    {selectedClientData.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a
                          href={`mailto:${selectedClientData.email}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {selectedClientData.email}
                        </a>
                      </div>
                    )}
                    {false && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a
                          href={`tel:`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          
                        </a>
                      </div>
                    )}
                  </div>
                  {false && (
                    <div className="mt-4">
                      <h4 className="text-white font-medium mb-2">Notes</h4>
                      <p className="text-gray-400"></p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Client Stats - optional placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#2A2A2A] border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Total Projects</p>
                        <p className="text-2xl font-bold text-white">{clientProjects.length}</p>
                      </div>
                      <FolderOpen className="w-8 h-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Client Projects */}
              <Card className="bg-[#2A2A2A] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Projects</CardTitle>
                  <CardDescription className="text-gray-400">
                    All projects for {selectedClientData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="text-center py-8 text-gray-400">Loading projects…</div>
                  ) : clientProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <FolderOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No projects for this client yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientProjects.map((p) => (
                        <div key={p.id} className="p-4 rounded-lg border border-gray-700 bg-[#121212]">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{p.name}</span>
                            {p.status && (
                              <Badge className="bg-gray-700 text-white">{p.status}</Badge>
                            )}
                          </div>
                          {(p.due_date || p.slug) && (
                            <div className="text-xs text-gray-500 mt-2">
                              {p.due_date && <span>Due: {new Date(p.due_date as any).toLocaleDateString()}</span>}
                              {p.due_date && p.slug && <span> · </span>}
                              {p.slug && <span>Slug: {p.slug}</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-[#2A2A2A] border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="w-12 h-12 text-gray-500 mb-4" />
                <p className="text-gray-400 text-center">
                  Select a client from the list to view their details and projects.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}