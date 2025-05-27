import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { TenderCard } from "@/components/tender/tender-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, FileText, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SavedTender {
  id: number;
  userId: string;
  tenderId: number;
  createdAt: string;
  tender: any; // Full tender object
}

export default function SavedTenders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: savedTenders, isLoading } = useQuery<SavedTender[]>({
    queryKey: ["/api/saved-tenders"],
  });

  const unsaveMutation = useMutation({
    mutationFn: async (tenderId: number) => {
      await apiRequest("DELETE", `/api/saved-tenders/${tenderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-tenders"] });
      toast({
        title: "Tender removed",
        description: "Tender has been removed from your saved list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove tender from saved list.",
        variant: "destructive",
      });
    },
  });

  const handleUnsave = (tenderId: number) => {
    unsaveMutation.mutate(tenderId);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <DesktopSidebar />
      
      <div className="flex-1 overflow-auto">
        <MobileHeader />
        
        {/* Header */}
        <section className="p-6 lg:p-8 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl lg:text-3xl font-bold">Saved Tenders</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Your bookmarked tender opportunities
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : savedTenders && savedTenders.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {savedTenders.length} saved {savedTenders.length === 1 ? 'tender' : 'tenders'}
                  </span>
                </div>
                
                {savedTenders.map((savedTender) => (
                  <div key={savedTender.id} className="relative">
                    <TenderCard 
                      tender={savedTender.tender} 
                      showSaveButton={false}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleUnsave(savedTender.tenderId)}
                      disabled={unsaveMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved tenders</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    You haven't saved any tenders yet. Start browsing to find opportunities that interest you.
                  </p>
                  <Button asChild>
                    <a href="/browse">
                      <FileText className="mr-2 h-4 w-4" />
                      Browse Tenders
                    </a>
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
