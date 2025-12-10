"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "@/context/GamificationContext";
import { Badge } from "@/lib/gamification/types";
import { BadgeCard, BadgeCardExpanded } from "./badge-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    Trophy,
    Target,
    Compass,
    Scale,
    Users,
    Zap,
    Sparkles,
    Lock,
    Filter,
    Grid3X3,
    List,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Category configuration
const categories = {
    all: { label: "All", icon: Grid3X3, color: "text-foreground" },
    mastery: { label: "Mastery", icon: Trophy, color: "text-amber-500" },
    exploration: { label: "Exploration", icon: Compass, color: "text-blue-500" },
    ethics: { label: "Ethics", icon: Scale, color: "text-purple-500" },
    engagement: { label: "Engagement", icon: Zap, color: "text-orange-500" },
    collaboration: { label: "Collaboration", icon: Users, color: "text-green-500" },
};

type CategoryKey = keyof typeof categories;

// Tier order for sorting
const tierOrder = { gold: 0, silver: 1, bronze: 2 };

interface BadgeShowcaseProps {
    showHeader?: boolean;
    compact?: boolean;
    maxBadges?: number;
    showCategories?: boolean;
    showProgress?: boolean;
}

export function BadgeShowcase({
    showHeader = true,
    compact = false,
    maxBadges,
    showCategories = true,
    showProgress = true,
}: BadgeShowcaseProps) {
    const { student, badges } = useGamification();
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    // Calculate stats
    const stats = useMemo(() => {
        const unlocked = student.unlockedBadges.length;
        const total = badges.filter(b => !b.isSecret).length;
        const secretUnlocked = badges.filter(
            b => b.isSecret && student.unlockedBadges.includes(b.id)
        ).length;
        const totalSecret = badges.filter(b => b.isSecret).length;

        return {
            unlocked,
            total,
            secretUnlocked,
            totalSecret,
            percentage: Math.round((unlocked / total) * 100) || 0,
        };
    }, [badges, student.unlockedBadges]);

    // Filter and sort badges
    const filteredBadges = useMemo(() => {
        let filtered = badges;

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(b => b.category === selectedCategory);
        }

        // Filter by unlocked status
        if (showUnlockedOnly) {
            filtered = filtered.filter(b => student.unlockedBadges.includes(b.id));
        }

        // Sort: unlocked first, then by tier
        filtered = [...filtered].sort((a, b) => {
            const aUnlocked = student.unlockedBadges.includes(a.id);
            const bUnlocked = student.unlockedBadges.includes(b.id);

            if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1;
            return tierOrder[a.tier] - tierOrder[b.tier];
        });

        // Limit if specified
        if (maxBadges) {
            filtered = filtered.slice(0, maxBadges);
        }

        return filtered;
    }, [badges, selectedCategory, showUnlockedOnly, student.unlockedBadges, maxBadges]);

    // Get progress for a badge (based on badge progress tracking)
    const getBadgeProgress = (badge: Badge): number => {
        return student.badgeProgress[badge.id] || 0;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 200,
                damping: 20,
            },
        },
    };

    return (
        <Card className={cn("overflow-hidden", compact && "border-0 shadow-none bg-transparent")}>
            {showHeader && (
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Badge Collection
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                                className={cn(showUnlockedOnly && "bg-muted")}
                            >
                                <Filter className="w-4 h-4 mr-1" />
                                {showUnlockedOnly ? "Unlocked" : "All"}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                            >
                                {viewMode === "grid" ? (
                                    <List className="w-4 h-4" />
                                ) : (
                                    <Grid3X3 className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Progress Overview */}
                    {showProgress && (
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Collection Progress</span>
                                <span className="font-semibold">
                                    {stats.unlocked} / {stats.total} ({stats.percentage}%)
                                </span>
                            </div>
                            <Progress value={stats.percentage} className="h-2" />
                            {stats.secretUnlocked > 0 && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-purple-500" />
                                    {stats.secretUnlocked} secret badge{stats.secretUnlocked > 1 ? "s" : ""} discovered!
                                </p>
                            )}
                        </div>
                    )}
                </CardHeader>
            )}

            <CardContent className={cn(compact && "p-0")}>
                {/* Category Tabs */}
                {showCategories && (
                    <Tabs
                        value={selectedCategory}
                        onValueChange={(v) => setSelectedCategory(v as CategoryKey)}
                        className="mb-4"
                    >
                        <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto gap-1">
                            {Object.entries(categories).map(([key, { label, icon: Icon, color }]) => (
                                <TabsTrigger
                                    key={key}
                                    value={key}
                                    className="flex items-center gap-1 text-xs px-2 py-1.5"
                                >
                                    <Icon className={cn("w-3 h-3", color)} />
                                    <span className="hidden sm:inline">{label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                )}

                {/* Badge Grid/List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                        viewMode === "grid"
                            ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
                            : "flex flex-col gap-2"
                    )}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredBadges.map((badge) => {
                            const isUnlocked = student.unlockedBadges.includes(badge.id);
                            const progress = getBadgeProgress(badge);

                            return (
                                <motion.div
                                    key={badge.id}
                                    variants={itemVariants}
                                    layout
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            {viewMode === "grid" ? (
                                                <div onClick={() => setSelectedBadge(badge)}>
                                                    <BadgeCard
                                                        badge={badge}
                                                        isUnlocked={isUnlocked}
                                                        progress={progress * 100}
                                                        size={compact ? "sm" : "md"}
                                                    />
                                                </div>
                                            ) : (
                                                <BadgeListItem
                                                    badge={badge}
                                                    isUnlocked={isUnlocked}
                                                    progress={progress * 100}
                                                    onClick={() => setSelectedBadge(badge)}
                                                />
                                            )}
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0">
                                            <DialogTitle className="sr-only">{badge.name} Badge Details</DialogTitle>
                                            <BadgeCardExpanded
                                                badge={badge}
                                                isUnlocked={isUnlocked}
                                                progress={progress * 100}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredBadges.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            {showUnlockedOnly
                                ? "No badges unlocked in this category yet"
                                : "No badges available in this category"}
                        </p>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}

// Badge List Item Component
interface BadgeListItemProps {
    badge: Badge;
    isUnlocked: boolean;
    progress: number;
    onClick: () => void;
}

function BadgeListItem({ badge, isUnlocked, progress, onClick }: BadgeListItemProps) {
    const iconToRender = badge.icon || badge.iconUrl;

    const tierColors = {
        bronze: "border-amber-400 bg-amber-50 dark:bg-amber-900/20",
        silver: "border-slate-400 bg-slate-50 dark:bg-slate-800/20",
        gold: "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    };

    return (
        <motion.button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-4 p-3 rounded-lg border-2 transition-all",
                isUnlocked
                    ? tierColors[badge.tier]
                    : "border-muted bg-muted/30 grayscale",
                "hover:shadow-md hover:scale-[1.01]"
            )}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Icon */}
            <div
                className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full text-2xl",
                    isUnlocked
                        ? "bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800"
                        : "bg-muted"
                )}
            >
                {isUnlocked ? (
                    iconToRender
                ) : badge.isSecret ? (
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
                <h4 className={cn(
                    "font-semibold",
                    !isUnlocked && "text-muted-foreground"
                )}>
                    {badge.isSecret && !isUnlocked ? "???" : badge.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                    {badge.isSecret && !isUnlocked
                        ? "Secret badge"
                        : badge.description}
                </p>
            </div>

            {/* Progress/XP */}
            <div className="text-right">
                {isUnlocked ? (
                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                        <Sparkles className="w-4 h-4" />
                        +{badge.xpReward} XP
                    </div>
                ) : progress > 0 ? (
                    <div className="w-20">
                        <div className="text-xs text-muted-foreground mb-1 text-right">
                            {Math.round(progress)}%
                        </div>
                        <Progress value={progress} className="h-1.5" />
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground capitalize">
                        {badge.tier}
                    </span>
                )}
            </div>
        </motion.button>
    );
}

// Compact Badge Strip for sidebars/headers
export function BadgeStrip({
    maxDisplay = 5,
    showProgress = false,
}: {
    maxDisplay?: number;
    showProgress?: boolean;
}) {
    const { student, badges } = useGamification();

    // Get recently unlocked or in-progress badges
    const displayBadges = useMemo(() => {
        const unlocked = badges.filter(b => student.unlockedBadges.includes(b.id));
        const inProgress = badges
            .filter(b => !student.unlockedBadges.includes(b.id) && student.badgeProgress[b.id] > 0)
            .sort((a, b) => (student.badgeProgress[b.id] || 0) - (student.badgeProgress[a.id] || 0));

        return [...unlocked.slice(-3), ...inProgress.slice(0, 2)].slice(0, maxDisplay);
    }, [badges, student.unlockedBadges, student.badgeProgress, maxDisplay]);

    return (
        <div className="flex items-center gap-1">
            {displayBadges.map((badge) => {
                const isUnlocked = student.unlockedBadges.includes(badge.id);
                return (
                    <motion.div
                        key={badge.id}
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        title={badge.name}
                    >
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                                isUnlocked
                                    ? "bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-300"
                                    : "bg-muted border border-muted-foreground/20"
                            )}
                        >
                            {isUnlocked ? (
                                badge.icon || badge.iconUrl
                            ) : (
                                <Lock className="w-3 h-3 text-muted-foreground" />
                            )}
                        </div>
                        {!isUnlocked && showProgress && student.badgeProgress[badge.id] > 0 && (
                            <div
                                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-muted rounded-full overflow-hidden"
                            >
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${student.badgeProgress[badge.id] * 100}%` }}
                                />
                            </div>
                        )}
                    </motion.div>
                );
            })}
            {badges.length > maxDisplay && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                    +{badges.length - maxDisplay}
                </div>
            )}
        </div>
    );
}
