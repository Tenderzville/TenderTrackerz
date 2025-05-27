import { useQuery } from "@tanstack/react-query";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Target, Lightbulb, BarChart3, AlertCircle } from "lucide-react";
import type { Tender } from "@shared/schema";

export default function AiAnalysis() {
  const { data: tenders, isLoading } = useQuery<Tender[]>({
    queryKey: ["/api/tenders"],
  });

  // Mock AI insights data
  const insights = {
    winRatePrediction: 68,
    optimalBidRange: { min: 15000000, max: 25000000 },
    marketTrends: [
      { category: "Construction", growth: 12, color: "text-green-600" },
      { category: "IT Services", growth: 8, color: "text-blue-600" },
      { category: "Consultancy", growth: -3, color: "text-red-600" },
      { category: "Supplies", growth: 5, color: "text-yellow-600" },
    ],
    recommendations: [
      "Focus on construction tenders between KSh 15M - 25M for highest success rate",
      "Consider forming consortiums for IT service tenders above KSh 30M",
      "Your win rate in consultancy projects is 15% above market average",
      "Deadline urgency correlates with 23% higher win probability in your case",
    ],
    competitorAnalysis: {
      averageCompetitors: 8,
      yourRanking: 3,
      strengthAreas: ["Technical Expertise", "Local Presence", "Price Competitiveness"],
      improvementAreas: ["Portfolio Diversity", "International Experience"],
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
              <Brain className="h-6 w-6 text-purple-500" />
              <h1 className="text-2xl lg:text-3xl font-bold">AI Analysis</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              AI-powered insights to improve your tender success rate
            </p>
          </div>
        </section>

        {/* AI Insights Dashboard */}
        <section className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Predicted
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {insights.winRatePrediction}%
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Win Rate</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Optimal
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(insights.optimalBidRange.min)}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">Min Bid Range</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Ranking
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    #{insights.competitorAnalysis.yourRanking}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Market Position</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Average
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {insights.competitorAnalysis.averageCompetitors}
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Competitors</p>
                </CardContent>
              </Card>
            </div>

            {/* Market Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Market Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.marketTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{trend.category}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Growth this quarter
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${trend.color}`}>
                          {trend.growth > 0 ? '+' : ''}{trend.growth}%
                        </p>
                        <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full ${trend.growth > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.abs(trend.growth) * 2}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Performance Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Win Rate Trend</span>
                        <span className="text-sm text-green-600">+12% this month</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Bid Accuracy</span>
                        <span className="text-sm text-blue-600">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Response Time</span>
                        <span className="text-sm text-purple-600">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span>AI Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competitor Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Competitive Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3 text-green-600">Strength Areas</h3>
                    <div className="space-y-2">
                      {insights.competitorAnalysis.strengthAreas.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 text-orange-600">Improvement Areas</h3>
                    <div className="space-y-2">
                      {insights.competitorAnalysis.improvementAreas.map((area, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <MobileBottomNav />
      </div>
    </div>
  );
}
