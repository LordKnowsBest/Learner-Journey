"use client";

import { useGamification, BADGES } from "@/context/GamificationContext";
import { useEffect, useState, useCallback } from "react";
import { X, Sparkles, Star, Trophy } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/lib/gamification/types";
import { triggerSmallConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

// Tier-based styling
const tierStyles = {
    bronze: {
        gradient: "from-amber-600/20 via-amber-500/10 to-yellow-600/20",
        border: "border-amber-500/50",
        glow: "shadow-amber-500/30",
        text: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-gradient-to-br from-amber-600 to-yellow-600",
    },
    silver: {
        gradient: "from-slate-400/20 via-slate-300/10 to-gray-400/20",
        border: "border-slate-400/50",
        glow: "shadow-slate-400/30",
        text: "text-slate-600 dark:text-slate-400",
        iconBg: "bg-gradient-to-br from-slate-400 to-gray-400",
    },
    gold: {
        gradient: "from-yellow-500/20 via-amber-400/10 to-orange-500/20",
        border: "border-yellow-500/50",
        glow: "shadow-yellow-500/30",
        text: "text-yellow-600 dark:text-yellow-400",
        iconBg: "bg-gradient-to-br from-yellow-500 to-orange-500",
    },
};

// Floating particles animation
const FloatingParticles = ({ tier }: { tier: Badge["tier"] }) => {
    const colors = {
        bronze: ["#B45309", "#D97706", "#F59E0B"],
        silver: ["#64748B", "#94A3B8", "#CBD5E1"],
        gold: ["#CA8A04", "#EAB308", "#FACC15"],
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                        backgroundColor: colors[tier][i % 3],
                        left: `${Math.random() * 100}%`,
                        bottom: "-10%",
                    }}
                    animate={{
                        y: [0, -200],
                        x: [0, (Math.random() - 0.5) * 50],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.5],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeOut",
                    }}
                />
            ))}
        </div>
    );
};

// Sparkle burst animation
const SparkleBurst = () => (
    <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
                key={i}
                className="absolute left-1/2 top-1/2"
                initial={{ scale: 0, x: "-50%", y: "-50%" }}
                animate={{
                    scale: [0, 1, 0],
                    x: `calc(-50% + ${Math.cos((i * 45 * Math.PI) / 180) * 80}px)`,
                    y: `calc(-50% + ${Math.sin((i * 45 * Math.PI) / 180) * 80}px)`,
                    opacity: [1, 1, 0],
                }}
                transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    ease: "easeOut",
                }}
            >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </motion.div>
        ))}
    </div>
);

// Shine animation overlay
const ShineOverlay = () => (
    <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
        }}
    />
);

// Pulsing glow ring
const GlowRing = ({ tier }: { tier: Badge["tier"] }) => {
    const glowColors = {
        bronze: "ring-amber-500",
        silver: "ring-slate-400",
        gold: "ring-yellow-400",
    };

    return (
        <motion.div
            className={cn(
                "absolute inset-0 rounded-xl ring-2",
                glowColors[tier]
            )}
            animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.02, 1],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
            }}
        />
    );
};

export function BadgeNotification() {
    const { student, badges } = useGamification();
    const [visibleBadge, setVisibleBadge] = useState<string | null>(null);
    const [prevCount, setPrevCount] = useState(0);
    const [showBurst, setShowBurst] = useState(false);

    const triggerCelebration = useCallback((tier: Badge["tier"]) => {
        setShowBurst(true);
        // Trigger confetti for gold badges
        if (tier === "gold") {
            triggerSmallConfetti();
            setTimeout(() => triggerSmallConfetti(), 300);
        } else if (tier === "silver") {
            triggerSmallConfetti();
        }
        setTimeout(() => setShowBurst(false), 1000);
    }, []);

    useEffect(() => {
        if (!student || student.unlockedBadges.length === 0) {
            if (student) setPrevCount(student.unlockedBadges.length);
            return;
        }

        // Check if count increased
        if (student.unlockedBadges.length > prevCount) {
            const latestId = student.unlockedBadges[student.unlockedBadges.length - 1];
            const badgeDef = badges.find(b => b.id === latestId) || BADGES[latestId];

            setVisibleBadge(latestId);

            // Trigger celebration based on tier
            if (badgeDef) {
                triggerCelebration(badgeDef.tier);
            }

            const timer = setTimeout(() => setVisibleBadge(null), 6000);
            setPrevCount(student.unlockedBadges.length);
            return () => clearTimeout(timer);
        }

        // Sync count if looking at generic update
        setPrevCount(student.unlockedBadges.length);

    }, [student?.unlockedBadges?.length, prevCount, student, badges, triggerCelebration]);

    if (!visibleBadge) return null;

    // Find badge definition
    const badgeDef = badges.find(b => b.id === visibleBadge) || BADGES[visibleBadge];
    if (!badgeDef) return null;

    const iconToRender = badgeDef.icon || (badgeDef as any).iconUrl;
    const tier = (badgeDef.tier || 'bronze') as keyof typeof tierStyles;
    const styles = tierStyles[tier];

    return (
        <AnimatePresence>
            <motion.div
                key={visibleBadge}
                initial={{ opacity: 0, y: 100, scale: 0.5, rotate: -10 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: 20,
                    transition: { duration: 0.3 }
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Card className={cn(
                    "relative p-5 flex items-center gap-4 backdrop-blur-xl w-96 overflow-hidden",
                    "bg-gradient-to-r border-2 shadow-2xl",
                    styles.gradient,
                    styles.border,
                    styles.glow
                )}>
                    {/* Background effects */}
                    <FloatingParticles tier={badgeDef.tier} />
                    <GlowRing tier={badgeDef.tier} />

                    {/* Sparkle burst on appear */}
                    {showBurst && <SparkleBurst />}

                    {/* Badge Icon */}
                    <motion.div
                        className={cn(
                            "relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg",
                            styles.iconBg
                        )}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{
                            scale: 1,
                            rotate: 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2,
                        }}
                    >
                        <ShineOverlay />
                        <motion.span
                            className="text-4xl z-10"
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatDelay: 2,
                            }}
                        >
                            {iconToRender}
                        </motion.span>

                        {/* Tier indicator */}
                        <motion.div
                            className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                        >
                            {badgeDef.tier === "gold" ? (
                                <Trophy className="w-4 h-4 text-yellow-500" />
                            ) : badgeDef.tier === "silver" ? (
                                <Star className="w-4 h-4 text-slate-400 fill-slate-400" />
                            ) : (
                                <Star className="w-4 h-4 text-amber-600" />
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Badge Info */}
                    <div className="flex-1 z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className={cn("w-4 h-4", styles.text)} />
                                <h4 className={cn(
                                    "text-xs font-bold uppercase tracking-wider",
                                    styles.text
                                )}>
                                    Badge Unlocked!
                                </h4>
                            </div>
                            <CardTitle className="text-lg font-bold mb-1">
                                {badgeDef.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                                {badgeDef.description}
                            </CardDescription>
                        </motion.div>

                        {/* XP Reward */}
                        <motion.div
                            className={cn(
                                "flex items-center gap-1 mt-2 text-sm font-semibold",
                                styles.text
                            )}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 0.5, delay: 0.7, ease: "easeInOut" }}
                            >
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                            <span>+{badgeDef.xpReward} XP Earned!</span>
                        </motion.div>
                    </div>

                    {/* Close button */}
                    <motion.button
                        onClick={() => setVisibleBadge(null)}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors z-20 p-1 rounded-full hover:bg-white/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-4 h-4" />
                    </motion.button>

                    {/* Progress bar (auto-dismiss indicator) */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 6, ease: "linear" }}
                    />
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
