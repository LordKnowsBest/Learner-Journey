"use client";

import { useTooltipLayers } from "@/context/TooltipLayerContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Layers,
  User,
  GraduationCap,
  Palette,
  Code,
  Sparkles,
} from "lucide-react";
import type { TooltipLayer } from "@/components/ui/educational-tooltip";

const layerConfig: Record<
  TooltipLayer,
  {
    icon: typeof User;
    label: string;
    description: string;
    color: string;
  }
> = {
  user: {
    icon: User,
    label: "User Tips",
    description: "Basic usage explanations",
    color: "text-blue-500",
  },
  educator: {
    icon: GraduationCap,
    label: "Pedagogical",
    description: "Teaching rationale & learning theory",
    color: "text-purple-500",
  },
  designer: {
    icon: Palette,
    label: "Ethical Design",
    description: "Design principles & ethics",
    color: "text-pink-500",
  },
  developer: {
    icon: Code,
    label: "Technical",
    description: "Implementation details",
    color: "text-green-500",
  },
};

export function TooltipLayerToggle() {
  const {
    visibleLayers,
    toggleLayer,
    isLayerVisible,
    isAcademicMode,
    toggleAcademicMode,
  } = useTooltipLayers();

  const activeCount = visibleLayers.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          aria-label="Toggle tooltip information layers"
        >
          <Layers className="h-4 w-4" />
          {activeCount > 1 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Tooltip Information Layers
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Choose what information to show on hover
            </p>
          </div>

          {/* Academic Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="academic-mode" className="text-sm font-medium">
                  Academic Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Show all educational layers
                </p>
              </div>
            </div>
            <Switch
              id="academic-mode"
              checked={isAcademicMode}
              onCheckedChange={toggleAcademicMode}
            />
          </div>

          <Separator />

          {/* Individual Layer Toggles */}
          <div className="space-y-3">
            {(
              Object.entries(layerConfig) as [
                TooltipLayer,
                (typeof layerConfig)[TooltipLayer]
              ][]
            ).map(([layer, config]) => {
              const Icon = config.icon;
              const isActive = isLayerVisible(layer);

              return (
                <div
                  key={layer}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? config.color : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <Label
                        htmlFor={layer}
                        className={`text-sm font-medium ${
                          isActive ? "" : "text-muted-foreground"
                        }`}
                      >
                        {config.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {config.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={layer}
                    checked={isActive}
                    onCheckedChange={() => toggleLayer(layer)}
                  />
                </div>
              );
            })}
          </div>

          {/* Active Layers Summary */}
          {activeCount > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-1">
                {visibleLayers.map((layer) => (
                  <Badge
                    key={layer}
                    variant="secondary"
                    className="text-xs"
                  >
                    {layerConfig[layer].label}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Compact version for header
export function TooltipLayerToggleCompact() {
  const { isAcademicMode, toggleAcademicMode, visibleLayers } = useTooltipLayers();

  return (
    <Button
      variant={isAcademicMode ? "default" : "outline"}
      size="sm"
      onClick={toggleAcademicMode}
      className="gap-2 h-8"
      aria-label={isAcademicMode ? "Disable academic mode" : "Enable academic mode"}
    >
      <GraduationCap className="h-3.5 w-3.5" />
      <span className="hidden sm:inline text-xs">
        {isAcademicMode ? "Academic" : "Standard"}
      </span>
      {visibleLayers.length > 1 && (
        <Badge variant="secondary" className="h-4 px-1 text-[10px]">
          {visibleLayers.length}
        </Badge>
      )}
    </Button>
  );
}
