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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2c3650] bg-[#0b111b]/94 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-lg items-center justify-around px-2 py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex min-w-[72px] flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all ${
                isActive
                  ? "text-[#a8ff3f]"
                  : "text-[#8f9fb7] hover:text-[#cce8ff]"
              }`}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
