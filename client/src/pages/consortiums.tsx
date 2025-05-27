import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Calendar, MapPin, Building, UserPlus, Crown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Consortium } from "@shared/schema";

interface CreateConsortiumForm {
  name: string;
  description: string;
  requiredSkills: string;
  maxMembers: number;
}

export default function Consortiums() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateConsortiumForm>({
    name: "",
    description: "",
    requiredSkills: "",
    maxMembers: 10,
  });

  const { data: consortiums, isLoading } = useQuery<Consortium[]>({
    queryKey: ["/api/consortiums"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateConsortiumForm) => {
      return await apiRequest("POST", "/api/consortiums", {
        ...data,
        requiredSkills: data.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consortiums"] });
      setCreateDialogOpen(false);
      setFormData({ name: "", description: "", requiredSkills: "", maxMembers: 10 });
      toast({
        title: "Consortium created",
        description: "Your consortium has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create consortium.",
        variant: "destructive",
      });
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (consortiumId: number) => {
      return await apiRequest("POST", `/api/consortiums/${consortiumId}/join`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consortiums"] });
      toast({
        title: "Joined consortium",
        description: "You have successfully joined the consortium.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join consortium.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleJoin = (consortiumId: number) => {
    joinMutation.mutate(consortiumId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "submitted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <DesktopSidebar />
      
      <div className="flex-1 overflow-auto">
        <MobileHeader />
        
        {/* Header */}
        <section className="p-6 lg:p-8 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">Consortiums</h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    Join forces with other suppliers to win bigger contracts
                  </p>
                </div>
              </div>
              
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Consortium</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Consortium</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Consortium Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Construction Alliance Kenya"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the purpose and goals of this consortium..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        value={formData.requiredSkills}
                        onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                        placeholder="e.g., Construction, Engineering, Project Management"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="maxMembers">Maximum Members</Label>
                      <Input
                        id="maxMembers"
                        type="number"
                        min="2"
                        max="50"
                        value={formData.maxMembers}
                        onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Creating..." : "Create Consortium"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : consortiums && consortiums.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consortiums.map((consortium) => (
                  <Card key={consortium.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{consortium.name}</CardTitle>
                          <Badge className={getStatusColor(consortium.status)}>
                            {consortium.status}
                          </Badge>
                        </div>
                        <Crown className="h-5 w-5 text-yellow-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                        {consortium.description || "No description provided"}
                      </p>
                      
                      {consortium.requiredSkills && consortium.requiredSkills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Required Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {consortium.requiredSkills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {consortium.requiredSkills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{consortium.requiredSkills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>Max {consortium.maxMembers} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(consortium.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {consortium.status === "active" && (
                          <Button 
                            size="sm"
                            onClick={() => handleJoin(consortium.id)}
                            disabled={joinMutation.isPending}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No consortiums yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Create your first consortium to start collaborating with other suppliers.
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Consortium
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <MobileBottomNav />
      </div>
    </div>
  );
}
