"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EducationalTooltip } from "@/components/ui/educational-tooltip"
import { useTooltipLayersOptional } from "@/context/TooltipLayerContext"
import { getEthicalTooltip } from "@/lib/ethical-design-tooltips"

export function ModeToggle() {
    const { setTheme } = useTheme()
    const { visibleLayers } = useTooltipLayersOptional()
    const themeTooltip = getEthicalTooltip("theme_options")

    return (
        <EducationalTooltip
            content={themeTooltip?.content || "Switch between light and dark modes"}
            ethicalDesign={themeTooltip?.ethicalDesign}
            pedagogy={themeTooltip?.pedagogy}
            visibleLayers={visibleLayers}
            side="bottom"
        >
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </EducationalTooltip>
    )
}
