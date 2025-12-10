"use client";

import { useMemo } from "react";
import { useTooltipLayersOptional } from "@/context/TooltipLayerContext";
import {
  getEthicalTooltip,
  getTooltipsByCategory,
  getCategoryStats,
  type EthicalTooltipDefinition,
} from "@/lib/ethical-design-tooltips";
import type { EthicalCategory, TooltipLayer } from "@/components/ui/educational-tooltip";

/**
 * Hook for accessing educational tooltip definitions with layer context
 *
 * @example
 * const { getTooltip, visibleLayers } = useEducationalTooltips();
 * const xpTooltip = getTooltip("xp_system");
 *
 * <EducationalTooltip
 *   content={xpTooltip?.content}
 *   ethicalDesign={xpTooltip?.ethicalDesign}
 *   visibleLayers={visibleLayers}
 * >
 *   <Button>Earn XP</Button>
 * </EducationalTooltip>
 */
export function useEducationalTooltips() {
  const { visibleLayers, isAcademicMode } = useTooltipLayersOptional();

  const getTooltip = (id: string): EthicalTooltipDefinition | undefined => {
    return getEthicalTooltip(id);
  };

  const getTooltipsForCategory = (category: EthicalCategory) => {
    return getTooltipsByCategory(category);
  };

  const stats = useMemo(() => getCategoryStats(), []);

  return {
    visibleLayers,
    isAcademicMode,
    getTooltip,
    getTooltipsForCategory,
    stats,
  };
}

/**
 * Hook for getting multiple tooltips at once
 *
 * @example
 * const tooltips = useTooltipBatch(["xp_system", "streak_system", "badge_achievement"]);
 */
export function useTooltipBatch(tooltipIds: string[]) {
  const { visibleLayers } = useTooltipLayersOptional();

  const tooltips = useMemo(() => {
    return tooltipIds.reduce((acc, id) => {
      const tooltip = getEthicalTooltip(id);
      if (tooltip) {
        acc[id] = tooltip;
      }
      return acc;
    }, {} as Record<string, EthicalTooltipDefinition>);
  }, [tooltipIds]);

  return {
    tooltips,
    visibleLayers,
  };
}

/**
 * Props helper for EducationalTooltip component
 * Returns properly typed props from a tooltip definition
 */
export function getTooltipProps(
  tooltipId: string,
  visibleLayers: TooltipLayer[]
) {
  const tooltip = getEthicalTooltip(tooltipId);

  if (!tooltip) {
    return null;
  }

  return {
    content: tooltip.content,
    ethicalDesign: tooltip.ethicalDesign,
    pedagogy: tooltip.pedagogy,
    technical: tooltip.technical,
    visibleLayers,
  };
}
