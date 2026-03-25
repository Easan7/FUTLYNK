import { House, MagnifyingGlass, UsersThree, User } from "@phosphor-icons/react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: House, label: "My Games" },
    { path: "/matchmaking", icon: MagnifyingGlass, label: "Search" },
    { path: "/groups", icon: UsersThree, label: "Groups" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1f2620] bg-[#0a0e0b]">
      <div className="mx-auto flex w-full max-w-lg items-center justify-around px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-w-[72px] flex-col items-center gap-1 rounded-md px-2 py-2 transition-colors duration-200 ${
                isActive ? "text-[#9dff3f]" : "text-[#77857b]"
              }`}
            >
              <Icon size={19} weight={isActive ? "fill" : "regular"} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
