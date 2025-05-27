import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Tender } from "@shared/schema";

interface TenderCardProps {
  tender: Tender;
}

export function TenderCard({ tender }: TenderCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if tender is saved
  const { data: saveStatus } = useQuery({
    queryKey: ['/api/saved-tenders', tender.id, 'status'],
    enabled: isAuthenticated,
  });

  const isSaved = saveStatus?.isSaved || false;

  // Save/unsave tender mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        await apiRequest('DELETE', `/api/saved-tenders/${tender.id}`);
      } else {
        await apiRequest('POST', `/api/saved-tenders/${tender.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-tenders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-tenders', tender.id, 'status'] });
      toast({
        title: isSaved ? "Tender unsaved" : "Tender saved",
        description: isSaved ? "Tender removed from your saved list" : "Tender added to your saved list",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tender save status",
        variant: "destructive",
      });
    },
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Construction: "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400",
      "IT Services": "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
      Consultancy: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
      Supplies: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    };
    return colors[category] || "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400",
      closed: "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400",
      pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
    };
    return colors[status] || colors.active;
  };

  const getDaysLeft = (deadline: Date) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "Amount TBA";
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `KSh ${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `KSh ${(num / 1000).toFixed(0)}K`;
    }
    return `KSh ${num.toLocaleString()}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 mb-4 lg:mb-0 lg:pr-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2 mb-2 flex-wrap gap-2">
                <Badge className={cn("text-xs", getCategoryColor(tender.category))}>
                  {tender.category}
                </Badge>
                <Badge className={cn("text-xs", getStatusColor(tender.status || "active"))}>
                  {tender.status || "Active"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getDaysLeft(tender.deadline)}
                </Badge>
              </div>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="text-slate-400 hover:text-destructive transition-colors p-1 h-auto"
                >
                  <Heart className={cn("h-4 w-4", isSaved && "fill-current text-destructive")} />
                </Button>
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer line-clamp-2">
              {tender.title}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
              {tender.organization} | {tender.location}
            </p>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">
              {tender.description}
            </p>
            
            {/* AI Analysis */}
            {tender.aiAnalysis && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-center space-x-2 mb-1">
                  <Brain className="h-3 w-3 text-purple-500" />
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">AI Estimate</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Estimated winning bid: <span className="font-semibold">KSh 45M - 52M</span> • 
                  Win probability: <span className="font-semibold">72%</span>
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col lg:items-end space-y-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(tender.budgetEstimate)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Budget Estimate</p>
            </div>
            
            <div className="text-right text-sm">
              <p className="text-slate-600 dark:text-slate-300">Deadline:</p>
              <p className="font-medium">
                {new Date(tender.deadline).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <Button size="sm">
                View Details
              </Button>
              <Button size="sm" variant="outline" className="bg-success-500 hover:bg-success-600 text-white border-success-500">
                <Users className="h-4 w-4 mr-1" />
                Join Consortium
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
