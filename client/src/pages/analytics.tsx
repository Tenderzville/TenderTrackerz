import { useQuery } from "@tanstack/react-query";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  Award,
  FileText,
  Clock,
  DollarSign
} from "lucide-react";
import type { Tender } from "@shared/schema";

export default function Analytics() {
  const { data: tenders } = useQuery<Tender[]>({
    queryKey: ["/api/tenders"],
  });

  const { data: savedTenders } = useQuery<any[]>({
    queryKey: ["/api/saved-tenders"],
  });

  // Mock analytics data - in production this would come from real analytics API
  const analytics = {
    overview: {
      totalBids: 24,
      wonTenders: 8,
      pendingBids: 5,
      totalValue: 125000000, // KSh 125M
      winRate: 33.3,
      avgBidValue: 5200000, // KSh 5.2M
    },
    monthlyTrends: [
      { month: "Jan", bids: 3, wins: 1, value: 15000000 },
      { month: "Feb", bids: 4, wins: 2, value: 22000000 },
      { month: "Mar", bids: 5, wins: 1, value: 18000000 },
      { month: "Apr", bids: 6, wins: 2, value: 28000000 },
      { month: "May", bids: 4, wins: 1, value: 16000000 },
      { month: "Jun", bids: 2, wins: 1, value: 26000000 },
    ],
    categoryPerformance: [
      { category: "Construction", bids: 12, wins: 5, winRate: 41.7, avgValue: 8500000 },
      { category: "IT Services", bids: 6, wins: 2, winRate: 33.3, avgValue: 3200000 },
      { category: "Consultancy", bids: 4, wins: 1, winRate: 25.0, avgValue: 2800000 },
      { category: "Supplies", bids: 2, wins: 0, winRate: 0, avgValue: 1500000 },
    ],
    competitorAnalysis: {
      marketPosition: 3,
      totalCompetitors: 45,
      marketShare: 6.8,
      benchmarkWinRate: 28.5,
    },
    recentActivity: [
      { date: "2024-03-10", action: "Bid Submitted", tender: "School Construction Project", status: "pending" },
      { date: "2024-03-08", action: "Tender Won", tender: "IT Infrastructure Upgrade", status: "won" },
      { date: "2024-03-05", action: "Bid Submitted", tender: "Road Maintenance Contract", status: "pending" },
      { date: "2024-03-01", action: "Tender Lost", tender: "Hospital Equipment Supply", status: "lost" },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "lost":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
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
                <BarChart3 className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">Analytics</h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    Track your tender performance and market insights
                  </p>
                </div>
              </div>
              
              <Select defaultValue="6months">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last month</SelectItem>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Overview Metrics */}
        <section className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Performance Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <Badge variant="secondary" className="text-xs">Total</Badge>
                  </div>
                  <p className="text-2xl font-bold">{analytics.overview.totalBids}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Bids</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="h-5 w-5 text-green-500" />
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {analytics.overview.winRate}%
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{analytics.overview.wonTenders}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tenders Won</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <Badge variant="secondary" className="text-xs">Pending</Badge>
                  </div>
                  <p className="text-2xl font-bold">{analytics.overview.pendingBids}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pending Bids</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-purple-500" />
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      12%
                    </Badge>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(analytics.overview.totalValue)}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Contract Value</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Bidding Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.monthlyTrends.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{month.month}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                            <span>{month.bids} bids</span>
                            <span>{month.wins} wins</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(month.value)}</p>
                          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(month.wins / month.bids) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.categoryPerformance.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.category}</span>
                          <span className="text-sm font-semibold">{category.winRate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                          <span>{category.bids} bids • {category.wins} wins</span>
                          <span>{formatCurrency(category.avgValue)} avg</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                            style={{ width: `${category.winRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitive Analysis */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">#{analytics.competitorAnalysis.marketPosition}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Market Ranking</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{analytics.competitorAnalysis.totalCompetitors}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Competitors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{analytics.competitorAnalysis.marketShare}%</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Market Share</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <p className="text-2xl font-bold">{analytics.overview.winRate}%</p>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      vs {analytics.competitorAnalysis.benchmarkWinRate}% benchmark
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{activity.tender}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
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
