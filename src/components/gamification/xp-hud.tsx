"use client";

import { useState } from "react";
import { useGamification } from "@/context/GamificationContext";
import { useBadgeProgress } from "@/hooks/useBadgeProgress";
import { Progress } from "@/components/ui/progress";
import { Zap, Trophy, Award, ChevronRight, Sparkles } from "lucide-react";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { useTooltipLayersOptional } from "@/context/TooltipLayerContext";
import { getEthicalTooltip } from "@/lib/ethical-design-tooltips";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { BadgeStrip } from "./badge-showcase";

export function XpHud() {
    const { student, loading, badges } = useGamification();
    const { nearlyUnlockedBadges, totalUnlocked, totalBadges, badgeProgressMap } = useBadgeProgress();
    const { visibleLayers } = useTooltipLayersOptional();
    const [showBadgePanel, setShowBadgePanel] = useState(false);

    // Get tooltip definitions
    const xpTooltip = getEthicalTooltip("xp_system");
    const streakTooltip = getEthicalTooltip("streak_system");
    const levelTooltip = getEthicalTooltip("level_progression");

    if (loading) return null;

    // MVP: Simplistic visualization logic matching the mock provider's general scaling
    const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000];
    const currentThreshold = thresholds[student.level - 1] || 0;
    const nextThreshold = thresholds[student.level] || (currentThreshold + 1000);

    const xpInLevel = student.totalXP - currentThreshold;
    const xpForLevel = nextThreshold - currentThreshold;
    const progressPercent = Math.min(100, Math.max(0, (xpInLevel / xpForLevel) * 100));

    return (
        <motion.div
            className="flex items-center gap-3 bg-background/80 backdrop-blur-sm p-2 rounded-full border shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Level Indicator */}
            <EducationalTooltip
                content={levelTooltip?.content || `Level ${student.level}: ${student.levelTitle}`}
                ethicalDesign={levelTooltip?.ethicalDesign}
                pedagogy={levelTooltip?.pedagogy}
                visibleLayers={visibleLayers}
                side="bottom"
            >
                <div className="flex items-center gap-2 pl-2 cursor-help">
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <motion.span
                            className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-background"
                            key={student.level}
                            initial={{ scale: 1.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                        >
                            {student.level}
                        </motion.span>
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold leading-none">{student.levelTitle}</span>
                        <span className="text-[10px] text-muted-foreground leading-none">{student.totalXP} XP</span>
                    </div>
                </div>
            </EducationalTooltip>

            {/* Progress Bar with animation */}
            <EducationalTooltip
                content={`${Math.round(nextThreshold - student.totalXP)} XP to Level ${student.level + 1}`}
                ethicalDesign={xpTooltip?.ethicalDesign}
                pedagogy={xpTooltip?.pedagogy}
                visibleLayers={visibleLayers}
                side="bottom"
            >
                <div className="w-24 cursor-help relative">
                    <Progress value={progressPercent} className="h-2" />
                    {/* Animated sparkle at progress point */}
                    {progressPercent > 10 && (
                        <motion.div
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${progressPercent}%` }}
                            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="w-2 h-2 text-primary" />
                        </motion.div>
                    )}
                </div>
            </EducationalTooltip>

            {/* Streak with fire animation */}
            <EducationalTooltip
                content={streakTooltip?.content || `${student.currentStreak} day streak`}
                ethicalDesign={streakTooltip?.ethicalDesign}
                pedagogy={streakTooltip?.pedagogy}
                visibleLayers={visibleLayers}
                side="bottom"
            >
                <div className="flex items-center gap-1 border-l pl-3 cursor-help">
                    <motion.div
                        animate={student.currentStreak > 0 ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, -5, 5, 0],
                        } : {}}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                    >
                        <Zap className={cn(
                            "w-4 h-4 transition-colors",
                            student.currentStreak > 0
                                ? 'text-orange-500 fill-orange-500'
                                : 'text-muted-foreground'
                        )} />
                    </motion.div>
                    <span className="text-xs font-bold">{student.currentStreak}</span>
                </div>
            </EducationalTooltip>

            {/* Badge Section */}
            <Popover open={showBadgePanel} onOpenChange={setShowBadgePanel}>
                <PopoverTrigger asChild>
                    <motion.button
                        className="flex items-center gap-2 border-l pl-3 pr-2 cursor-pointer hover:bg-muted/50 rounded-r-full transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Award className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-semibold">
                            {totalUnlocked}/{totalBadges}
                        </span>
                        {nearlyUnlockedBadges.length > 0 && (
                            <motion.span
                                className="flex items-center justify-center w-4 h-4 bg-amber-500 text-white text-[10px] rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                            >
                                !
                            </motion.span>
                        )}
                        <ChevronRight className={cn(
                            "w-3 h-3 text-muted-foreground transition-transform",
                            showBadgePanel && "rotate-90"
                        )} />
                    </motion.button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-80 p-4"
                    align="end"
                    sideOffset={8}
                >
                    <BadgeProgressPanel
                        nearlyUnlockedBadges={nearlyUnlockedBadges}
                        badges={badges}
                        student={student}
                        badgeProgressMap={badgeProgressMap}
                    />
                </PopoverContent>
            </Popover>
        </motion.div>
    );
}

// Badge Progress Panel Component
function BadgeProgressPanel({
    nearlyUnlockedBadges,
    badges,
    student,
    badgeProgressMap,
}: {
    nearlyUnlockedBadges: any[];
    badges: any[];
    student: any;
    badgeProgressMap: Record<string, any>;
}) {
    // Get recently unlocked badges
    const recentlyUnlocked = badges.filter(b =>
        student.unlockedBadges.includes(b.id)
    ).slice(-3);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    Badge Progress
                </h4>
                <span className="text-xs text-muted-foreground">
                    {student.unlockedBadges.length} unlocked
                </span>
            </div>

            {/* Nearly Unlocked Badges */}
            {nearlyUnlockedBadges.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Almost there!
                    </p>
                    {nearlyUnlockedBadges.slice(0, 3).map(badge => {
                        const progress = badgeProgressMap[badge.id]?.progress || 0;
                        const iconToRender = badge.icon || badge.iconUrl;
                        return (
                            <motion.div
                                key={badge.id}
                                className="flex items-center gap-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <span className="text-xl">{iconToRender}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{badge.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Progress value={progress * 100} className="h-1.5 flex-1" />
                                        <span className="text-xs text-muted-foreground">
                                            {Math.round(progress * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Recent Badges */}
            {recentlyUnlocked.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Recently Earned</p>
                    <div className="flex flex-wrap gap-2">
                        {recentlyUnlocked.map(badge => {
                            const iconToRender = badge.icon || badge.iconUrl;
                            return (
                                <motion.div
                                    key={badge.id}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
                                    whileHover={{ scale: 1.05 }}
                                    title={badge.description}
                                >
                                    <span className="text-sm">{iconToRender}</span>
                                    <span className="text-xs font-medium">{badge.name}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* View All Link */}
            <motion.a
                href="/journey-summary"
                className="flex items-center justify-center gap-1 text-xs text-primary hover:underline pt-2 border-t"
                whileHover={{ x: 2 }}
            >
                View All Badges
                <ChevronRight className="w-3 h-3" />
            </motion.a>
        </div>
    );
}
