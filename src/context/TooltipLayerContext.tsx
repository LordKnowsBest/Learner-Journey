"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { TooltipLayer } from "@/components/ui/educational-tooltip";

interface TooltipLayerContextType {
  // Current visible layers
  visibleLayers: TooltipLayer[];
  // Toggle a specific layer on/off
  toggleLayer: (layer: TooltipLayer) => void;
  // Set all layers at once
  setLayers: (layers: TooltipLayer[]) => void;
  // Check if a layer is visible
  isLayerVisible: (layer: TooltipLayer) => boolean;
  // Academic mode - show all educational layers
  isAcademicMode: boolean;
  toggleAcademicMode: () => void;
  // Preset configurations
  setUserMode: () => void;
  setEducatorMode: () => void;
  setDesignerMode: () => void;
  setFullMode: () => void;
}

const TooltipLayerContext = createContext<TooltipLayerContextType | undefined>(
  undefined
);

interface TooltipLayerProviderProps {
  children: ReactNode;
  // Initial layers (defaults to user only)
  defaultLayers?: TooltipLayer[];
}

export function TooltipLayerProvider({
  children,
  defaultLayers = ["user"],
}: TooltipLayerProviderProps) {
  const [visibleLayers, setVisibleLayers] =
    useState<TooltipLayer[]>(defaultLayers);
  const [isAcademicMode, setIsAcademicMode] = useState(false);

  const toggleLayer = useCallback((layer: TooltipLayer) => {
    setVisibleLayers((prev) =>
      prev.includes(layer)
        ? prev.filter((l) => l !== layer)
        : [...prev, layer]
    );
  }, []);

  const setLayers = useCallback((layers: TooltipLayer[]) => {
    setVisibleLayers(layers);
  }, []);

  const isLayerVisible = useCallback(
    (layer: TooltipLayer) => visibleLayers.includes(layer),
    [visibleLayers]
  );

  const toggleAcademicMode = useCallback(() => {
    setIsAcademicMode((prev) => {
      if (!prev) {
        // Turning on academic mode - show all layers
        setVisibleLayers(["user", "educator", "designer"]);
      } else {
        // Turning off academic mode - back to user only
        setVisibleLayers(["user"]);
      }
      return !prev;
    });
  }, []);

  // Preset modes for quick switching
  const setUserMode = useCallback(() => {
    setVisibleLayers(["user"]);
    setIsAcademicMode(false);
  }, []);

  const setEducatorMode = useCallback(() => {
    setVisibleLayers(["user", "educator"]);
    setIsAcademicMode(false);
  }, []);

  const setDesignerMode = useCallback(() => {
    setVisibleLayers(["user", "designer"]);
    setIsAcademicMode(false);
  }, []);

  const setFullMode = useCallback(() => {
    setVisibleLayers(["user", "educator", "designer", "developer"]);
    setIsAcademicMode(true);
  }, []);

  return (
    <TooltipLayerContext.Provider
      value={{
        visibleLayers,
        toggleLayer,
        setLayers,
        isLayerVisible,
        isAcademicMode,
        toggleAcademicMode,
        setUserMode,
        setEducatorMode,
        setDesignerMode,
        setFullMode,
      }}
    >
      {children}
    </TooltipLayerContext.Provider>
  );
}

export function useTooltipLayers() {
  const context = useContext(TooltipLayerContext);
  if (!context) {
    throw new Error(
      "useTooltipLayers must be used within TooltipLayerProvider"
    );
  }
  return context;
}

// Optional hook that returns default values if provider is not present
export function useTooltipLayersOptional() {
  const context = useContext(TooltipLayerContext);
  if (!context) {
    return {
      visibleLayers: ["user"] as TooltipLayer[],
      toggleLayer: () => {},
      setLayers: () => {},
      isLayerVisible: (layer: TooltipLayer) => layer === "user",
      isAcademicMode: false,
      toggleAcademicMode: () => {},
      setUserMode: () => {},
      setEducatorMode: () => {},
      setDesignerMode: () => {},
      setFullMode: () => {},
    };
  }
  return context;
}
