"use client";

import { BrainCircuit, Target, Network, BarChart3, GraduationCap, Code, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { XpHud } from "@/components/gamification/xp-hud";

export function AppHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/teacher")) {
    return null;
  }

  const navItems = [
    { href: "/problems", label: "Problems", icon: Target },
    { href: "/graph", label: "Concepts", icon: Network },
    { href: "/journey-summary", label: "Progress", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/teacher", label: "Teacher", icon: GraduationCap },
  ];

  return (
    <header className="bg-primary/90 text-primary-foreground backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7" />
          <h1 className="text-xl sm:text-2xl font-bold font-headline">
            KAITE
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <XpHud />
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-foreground/20"
                      : "hover:bg-primary-foreground/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
