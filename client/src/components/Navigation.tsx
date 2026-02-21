/*
 * Navigation Component - Cyberpunk Athleticism
 * Mobile-first bottom nav with neon accents and smooth transitions
 */

import { House, MagnifyingGlass, PlusCircle, User } from "@phosphor-icons/react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: House, label: "Home" },
    { path: "/matchmaking", icon: MagnifyingGlass, label: "Search" },
    { path: "/groups", icon: PlusCircle, label: "Groups" },
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
                  size={24}
                  weight={isActive ? "fill" : "regular"}
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
