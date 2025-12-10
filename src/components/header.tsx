"use client";

import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { XpHud } from "@/components/gamification/xp-hud";
import { ModeToggle } from "@/components/mode-toggle";
import { TooltipLayerToggle } from "@/components/ui/tooltip-layer-toggle";

export function AppHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/teacher")) {
    return null;
  }

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-40 border-b-2 border-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="h-7 w-7" />
            <h1 className="text-xl sm:text-2xl font-bold font-headline">
              KAITE
            </h1>
          </Link>
        </div>

        {/* Center: XP HUD */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <XpHud />
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <TooltipLayerToggle />
          <ModeToggle />
          {/* XP Hud moved to center for desktop, could offer mobile version here if needed */}
          <div className="md:hidden">
            <XpHud />
          </div>
        </div>
      </div>
    </header>
  );
}
