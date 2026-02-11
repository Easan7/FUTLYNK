/*
 * Navigation Component - Cyberpunk Athleticism
 * Mobile-first bottom nav with neon accents and smooth transitions
 */

import { Home, Search, PlusCircle, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Discover" },
    { path: "/matchmaking", icon: Search, label: "Match" },
    { path: "/create", icon: PlusCircle, label: "Create" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-neon-green/20">
      <div className="container max-w-lg mx-auto">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-neon-green scale-110"
                    : "text-muted-foreground hover:text-neon-cyan hover:scale-105"
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-all duration-300 ${
                    isActive ? "drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]" : ""
                  }`}
                />
                <span className="text-xs font-medium font-display">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
