import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle, Users, Brain, Shield, TrendingUp } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Bell,
      title: "Real-time Tender Alerts",
      description: "Get instant notifications for new tenders matching your criteria from all major Kenyan government portals."
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Leverage artificial intelligence to estimate winning bids and assess your probability of success."
    },
    {
      icon: Users,
      title: "Consortium Formation",
      description: "Connect with other suppliers to form powerful consortiums and increase your bidding capacity."
    },
    {
      icon: Shield,
      title: "Verified Service Providers",
      description: "Access a network of trusted professionals for legal, technical, and consulting services."
    },
    {
      icon: TrendingUp,
      title: "Business Analytics",
      description: "Track your performance, win rates, and identify trends to optimize your bidding strategy."
    },
    {
      icon: CheckCircle,
      title: "Comprehensive Coverage",
      description: "Monitor tenders from PPP Portal, MyGov Kenya, and other official sources in one place."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TenderAlert Pro</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kenya's Premier Tender Platform</p>
              </div>
            </div>
            <Button asChild>
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Never Miss a Tender
            <span className="block text-primary">Opportunity Again</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            TenderAlert Pro is Kenya's most comprehensive tender notification and management platform. 
            Get real-time alerts, AI-powered insights, and connect with fellow suppliers to win more contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <a href="/api/login">Get Started Free</a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-slate-600 dark:text-slate-300">Active Tenders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">850+</div>
              <div className="text-slate-600 dark:text-slate-300">Registered Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-slate-600 dark:text-slate-300">Alert Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">KSh 12B+</div>
              <div className="text-slate-600 dark:text-slate-300">Tender Value Tracked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Win More Tenders
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need to stay ahead 
              of the competition and grow your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Tender Strategy?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of successful suppliers who trust TenderAlert Pro to grow their business.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
            <a href="/api/login">Start Your Free Trial</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">TenderAlert Pro</span>
          </div>
          <p className="text-slate-400 mb-4">
            Empowering Kenyan suppliers with technology and insights
          </p>
          <p className="text-sm text-slate-500">
            © 2024 TenderAlert Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
