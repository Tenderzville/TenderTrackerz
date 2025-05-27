import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TenderCard } from "@/components/TenderCard";
import { ServiceProviderCard } from "@/components/ServiceProviderCard";
import { useAuth } from "@/hooks/useAuth";
import { 
  FileText, 
  Heart, 
  Users, 
  Trophy, 
  Plus, 
  Search, 
  Filter,
  Brain,
  TrendingUp
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ['/api/analytics/stats'],
  });

  // Fetch recent tenders
  const { data: tendersData, isLoading: tendersLoading } = useQuery({
    queryKey: ['/api/tenders'],
  });

  // Fetch featured service providers
  const { data: providersData } = useQuery({
    queryKey: ['/api/service-providers'],
  });

  const statCards = [
    {
      title: "Active Tenders",
      value: stats?.activeTenders || 247,
      icon: FileText,
      change: "+12%",
      changeType: "positive" as const,
      color: "text-primary",
    },
    {
      title: "Saved Tenders",
      value: stats?.savedTenders || 12,
      icon: Heart,
      badge: stats?.savedTenders || 12,
      color: "text-destructive",
    },
    {
      title: "Consortiums",
      value: stats?.consortiums || 3,
      icon: Users,
      badge: stats?.consortiums || 3,
      color: "text-success-500",
    },
    {
      title: "Win Rate",
      value: `${stats?.winRate || 68}%`,
      icon: Trophy,
      change: "+5%",
      changeType: "positive" as const,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-800 dark:to-slate-700 p-6 lg:p-8 rounded-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || "Professional"}! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Discover new tender opportunities and grow your business
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Alert</span>
            </Button>
            <Button variant="outline" className="space-x-2">
              <Users className="h-4 w-4" />
              <span>Join Consortium</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="bg-white dark:bg-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  {stat.change && (
                    <Badge variant="secondary" className="text-xs bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400">
                      {stat.change}
                    </Badge>
                  )}
                  {stat.badge && (
                    <Badge variant="default" className="text-xs">
                      {stat.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Search and Filters */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tenders by title, category, or organization..."
              className="pl-12"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="it">IT Services</SelectItem>
                <SelectItem value="consultancy">Consultancy</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="nairobi">Nairobi</SelectItem>
                <SelectItem value="mombasa">Mombasa</SelectItem>
                <SelectItem value="kisumu">Kisumu</SelectItem>
                <SelectItem value="eldoret">Eldoret</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="space-x-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {/* AI Insights Banner */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                  AI-Powered Tender Analysis
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                  Based on historical data, you have a 78% chance of winning construction tenders between KSh 5M - 15M
                </p>
                <Button variant="link" className="p-0 h-auto text-purple-600 dark:text-purple-400">
                  View Detailed Analysis →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tender Listings */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest Tenders</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {tendersData?.total || 0} results
            </span>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Latest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="deadline">Deadline Soon</SelectItem>
                <SelectItem value="value">Highest Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {tendersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tendersData?.tenders?.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Button variant="outline">Load More Tenders</Button>
        </div>
      </section>

      {/* Service Providers Section */}
      <section className="bg-slate-50 dark:bg-slate-800/50 p-6 lg:p-8 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Service Providers</h2>
          <Button variant="link">View All →</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providersData?.providers?.slice(0, 3).map((provider) => (
            <ServiceProviderCard key={provider.id} provider={provider} />
          )) || [1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
