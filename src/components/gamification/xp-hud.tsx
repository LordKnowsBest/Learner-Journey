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
    const { student, loading } = useGamification();

    if (loading) return null;

    // MVP: Simplistic visualization logic matching the mock provider's general scaling
    // Ideally this logic lives in a shared helper
    const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000];
    const nextLevelIndex = student.level; // Levels are 1-based, array is 0-based. next level is index 'level'
    const currentThreshold = thresholds[student.level - 1] || 0;
    const nextThreshold = thresholds[student.level] || (currentThreshold + 1000);

    const xpInLevel = student.totalXP - currentThreshold;
    const xpForLevel = nextThreshold - currentThreshold;
    const progressPercent = Math.min(100, Math.max(0, (xpInLevel / xpForLevel) * 100));

    return (
        <div className="flex items-center gap-4 bg-background/80 backdrop-blur-sm p-2 rounded-full border shadow-sm">

            {/* Level Indicator */}
            <div className="flex items-center gap-2 pl-2">
                <div className="relative">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-background">
                        {student.level}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold leading-none">{student.levelTitle}</span>
                    <span className="text-[10px] text-muted-foreground leading-none">{student.totalXP} XP</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-24">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Progress value={progressPercent} className="h-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">{Math.round(nextThreshold - student.totalXP)} XP to Level {student.level + 1}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 pr-3 border-l pl-3">
                <Zap className={`w-4 h-4 ${student.currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-muted-foreground'}`} />
                <span className="text-xs font-bold">{student.currentStreak}</span>
            </div>
        </div>
    );
}
