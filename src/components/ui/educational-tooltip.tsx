"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  Brain,
  Heart,
  Accessibility,
  Sparkles,
  Info,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Ethical design category types
export type EthicalCategory =
  | "transparency"
  | "autonomy"
  | "privacy"
  | "fairness"
  | "engagement"
  | "accessibility";

export type TooltipLayer =
  | "user" // End-user explanation (default)
  | "educator" // Pedagogical rationale
  | "designer" // Ethical design explanation
  | "developer"; // Technical implementation notes

export interface EthicalDesignInfo {
  principle: string;
  rationale: string;
  category: EthicalCategory;
  references?: string[]; // Academic references
}

import type { EthicalTooltipDefinition } from "@/lib/ethical-design-tooltips";

interface EducationalTooltipProps {
  children: React.ReactNode;
  // Option 1: Pass a complete definition object
  definition?: EthicalTooltipDefinition;

  // Option 2: Pass individual props (overrides definition if both present)
  content?: string;
  ethicalDesign?: EthicalDesignInfo;
  pedagogy?: string;
  technical?: string;

  // Configuration
  visibleLayers?: TooltipLayer[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  disabled?: boolean;
}

const categoryConfig: Record<
  EthicalCategory,
  {
    icon: typeof Shield;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  transparency: {
    icon: Eye,
    label: "Transparency",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  autonomy: {
    icon: Brain,
    label: "Learner Autonomy",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  privacy: {
    icon: Shield,
    label: "Privacy",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    borderColor: "border-green-200 dark:border-green-800",
  },
  fairness: {
    icon: Heart,
    label: "Fairness",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/50",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  engagement: {
    icon: Sparkles,
    label: "Ethical Engagement",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  accessibility: {
    icon: Accessibility,
    label: "Accessibility",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
};

export function EducationalTooltip({
  children,
  definition,
  content: propContent,
  ethicalDesign: propEthicalDesign,
  pedagogy: propPedagogy,
  technical: propTechnical,
  visibleLayers = ["user"],
  side = "top",
  align = "center",
  sideOffset = 4,
  className,
  disabled = false,
}: EducationalTooltipProps) {
  // Resolve props from definition or direct props (direct props take precedence)
  const content = propContent || definition?.content || "";
  const ethicalDesign = propEthicalDesign || definition?.ethicalDesign;
  const pedagogy = propPedagogy || definition?.pedagogy;
  const technical = propTechnical || definition?.technical;

  if (disabled) {
    return <>{children}</>;
  }

  const showUser = visibleLayers.includes("user");
  const showEducator = visibleLayers.includes("educator") && pedagogy;
  const showDesigner = visibleLayers.includes("designer") && ethicalDesign;
  const showDeveloper = visibleLayers.includes("developer") && technical;

  const hasMultipleLayers = [showEducator, showDesigner, showDeveloper].filter(Boolean).length > 0;

  const categoryInfo = ethicalDesign
    ? categoryConfig[ethicalDesign.category]
    : null;
  const CategoryIcon = categoryInfo?.icon || Info;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "max-w-sm",
          hasMultipleLayers && "p-0 overflow-hidden",
          className
        )}
      >
        {/* User Layer - Always visible when enabled */}
        {showUser && (
          <div className={cn(hasMultipleLayers ? "p-3" : "")}>
            <p className="text-sm">{content}</p>
          </div>
        )}

        {/* Educator Layer - Pedagogical Purpose */}
        {showEducator && (
          <div className="border-t border-dashed p-3 bg-muted/30">
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                Pedagogical Purpose
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {pedagogy}
            </p>
          </div>
        )}

        {/* Designer Layer - Ethical Design */}
        {showDesigner && categoryInfo && ethicalDesign && (
          <div
            className={cn(
              "border-t p-3",
              categoryInfo.bgColor,
              categoryInfo.borderColor
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <CategoryIcon className={cn("w-4 h-4", categoryInfo.color)} />
              <Badge
                variant="outline"
                className={cn("text-xs", categoryInfo.color, categoryInfo.borderColor)}
              >
                {categoryInfo.label}
              </Badge>
            </div>
            <p className={cn("text-xs font-semibold mb-1", categoryInfo.color)}>
              {ethicalDesign.principle}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {ethicalDesign.rationale}
            </p>
            {ethicalDesign.references && ethicalDesign.references.length > 0 && (
              <div className="mt-2 pt-2 border-t border-dashed opacity-70">
                <p className="text-[10px] text-muted-foreground italic">
                  Refs: {ethicalDesign.references.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Developer Layer - Technical Notes */}
        {showDeveloper && (
          <div className="border-t border-dashed p-3 bg-slate-50 dark:bg-slate-950/50">
            <div className="flex items-center gap-2 mb-1.5">
              <Info className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Technical Notes
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
              {technical}
            </p>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

// Convenience wrapper for simple tooltips with just user content
export function SimpleTooltip({
  children,
  content,
  side = "top",
  className,
}: {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}) {
  return (
    <EducationalTooltip
      content={content}
      side={side}
      className={className}
      visibleLayers={["user"]}
    >
      {children}
    </EducationalTooltip>
  );
}
