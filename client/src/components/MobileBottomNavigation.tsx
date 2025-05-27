import { Link, useLocation } from "wouter";
import { Home, Search, Heart, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/tenders", icon: Search },
  { name: "Saved", href: "/saved", icon: Heart },
  { name: "Teams", href: "/consortiums", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

export function MobileBottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 z-50">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-slate-400 dark:text-slate-500"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
