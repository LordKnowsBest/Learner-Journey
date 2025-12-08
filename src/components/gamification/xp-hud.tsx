"use client";

import { useGamification } from "@/context/GamificationContext";
import { Progress } from "@/components/ui/progress";
import { Zap, Trophy } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function XpHud() {
    const { state } = useGamification();

    // Example level logic: Level X starts at (X-1)*100 XP
    // Progress to next level = (XP % 100)
    const progressToNextLevel = state.xp % 100;

    return (
        <div className="flex items-center gap-4 bg-background/80 backdrop-blur-sm p-2 rounded-full border shadow-sm">

            {/* Level Indicator */}
            <div className="flex items-center gap-2 pl-2">
                <div className="relative">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-background">
                        {state.level}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold leading-none">Lvl {state.level}</span>
                    <span className="text-[10px] text-muted-foreground leading-none">{state.xp} XP</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-24">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Progress value={progressToNextLevel} className="h-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">{100 - progressToNextLevel} XP to Level {state.level + 1}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 pr-3 border-l pl-3">
                <Zap className={`w-4 h-4 ${state.currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-muted-foreground'}`} />
                <span className="text-xs font-bold">{state.currentStreak}</span>
            </div>
        </div>
    );
}
