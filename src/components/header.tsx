"use client";

import { BrainCircuit, Target, Network, BarChart3, GraduationCap, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { XpHud } from "@/components/gamification/xp-hud";
import { ModeToggle } from "@/components/mode-toggle";
import { TooltipLayerToggle } from "@/components/ui/tooltip-layer-toggle";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { useTooltipLayers } from "@/context/TooltipLayerContext";
import { getEthicalTooltip } from "@/lib/ethical-design-tooltips";

export function AppHeader() {
  const pathname = usePathname();
  const { visibleLayers } = useTooltipLayers();

  if (pathname?.startsWith("/teacher")) {
    return null;
  }

  const navItems = [
    { href: "/problems", label: "Problems", icon: Target, tooltipId: "nav_problems" },
    { href: "/graph", label: "Concepts", icon: Network, tooltipId: "nav_concepts" },
    { href: "/journey-summary", label: "Progress", icon: BarChart3, tooltipId: "nav_progress" },
    { href: "/settings", label: "Settings", icon: Settings, tooltipId: "nav_settings" },
    { href: "/teacher", label: "Teacher", icon: GraduationCap, tooltipId: "teacher_view" },
  ];

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-40 border-b-2 border-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7" />
          <h1 className="text-xl sm:text-2xl font-bold font-headline">
            KAITE
          </h1>
        </Link>

        {/* Center: Navigation - Hidden on small screens, centered on large */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const tooltipDef = getEthicalTooltip(item.tooltipId);

            const linkElement = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-foreground/20"
                    : "hover:bg-primary-foreground/10"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );

            if (tooltipDef) {
              return (
                <EducationalTooltip
                  key={item.href}
                  content={tooltipDef.content}
                  ethicalDesign={tooltipDef.ethicalDesign}
                  pedagogy={tooltipDef.pedagogy}
                  visibleLayers={visibleLayers}
                  side="bottom"
                >
                  {linkElement}
                </EducationalTooltip>
              );
            }
            return linkElement;
          })}
        </nav>

        {/* Right: Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <TooltipLayerToggle />
          <ModeToggle />
          <XpHud />
        </div>
      </div>
    </header>
  );
}
