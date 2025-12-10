"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/lib/gamification/types";
import { Lock, Sparkles, Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
    badge: Badge;
    isUnlocked: boolean;
    progress?: number; // 0-100
    onReveal?: () => void;
    showRevealAnimation?: boolean;
    size?: "sm" | "md" | "lg";
}

// Tier-based color schemes
const tierStyles = {
    bronze: {
        gradient: "from-amber-600 via-amber-500 to-yellow-600",
        glow: "shadow-amber-500/50",
        border: "border-amber-400",
        bg: "bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10",
        text: "text-amber-700 dark:text-amber-300",
        ring: "ring-amber-400/50",
    },
    silver: {
        gradient: "from-slate-400 via-slate-300 to-gray-400",
        glow: "shadow-slate-400/50",
        border: "border-slate-300",
        bg: "bg-gradient-to-br from-slate-100 to-gray-50 dark:from-slate-800/20 dark:to-gray-700/10",
        text: "text-slate-700 dark:text-slate-300",
        ring: "ring-slate-400/50",
    },
    gold: {
        gradient: "from-yellow-500 via-amber-400 to-orange-500",
        glow: "shadow-yellow-500/50",
        border: "border-yellow-400",
        bg: "bg-gradient-to-br from-yellow-100 to-amber-50 dark:from-yellow-900/20 dark:to-amber-800/10",
        text: "text-yellow-700 dark:text-yellow-300",
        ring: "ring-yellow-400/50",
    },
};

const sizeStyles = {
    sm: {
        container: "w-20 h-24",
        icon: "text-2xl",
        iconWrapper: "w-12 h-12",
        name: "text-[10px]",
        xp: "text-[8px]",
    },
    md: {
        container: "w-28 h-32",
        icon: "text-3xl",
        iconWrapper: "w-16 h-16",
        name: "text-xs",
        xp: "text-[10px]",
    },
    lg: {
        container: "w-36 h-40",
        icon: "text-4xl",
        iconWrapper: "w-20 h-20",
        name: "text-sm",
        xp: "text-xs",
    },
};

// Shimmer animation for locked badges
const ShimmerOverlay = () => (
    <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
            x: ["-100%", "100%"],
        }}
        transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
        }}
    />
);

// Particle burst animation for unlocking
const ParticleBurst = ({ tier }: { tier: Badge["tier"] }) => {
    const particles = Array.from({ length: 12 });
    const colors = {
        bronze: ["#B45309", "#D97706", "#F59E0B"],
        silver: ["#64748B", "#94A3B8", "#CBD5E1"],
        gold: ["#CA8A04", "#EAB308", "#FACC15"],
    };

    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: colors[tier][i % 3],
                        left: "50%",
                        top: "50%",
                    }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((i * 30 * Math.PI) / 180) * 60,
                        y: Math.sin((i * 30 * Math.PI) / 180) * 60,
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: i * 0.02,
                    }}
                />
            ))}
        </div>
    );
};

// Spinning stars for gold badges
const SpinningStars = () => (
    <div className="absolute inset-0 pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
            <motion.div
                key={i}
                className="absolute"
                style={{
                    left: `${20 + i * 20}%`,
                    top: `${10 + (i % 2) * 70}%`,
                }}
                animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" },
                }}
            >
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            </motion.div>
        ))}
    </div>
);

// Glow pulse animation
const GlowPulse = ({ tier }: { tier: Badge["tier"] }) => {
    const glowColors = {
        bronze: "bg-amber-500",
        silver: "bg-slate-400",
        gold: "bg-yellow-400",
    };

    return (
        <motion.div
            className={cn(
                "absolute inset-0 rounded-xl blur-xl opacity-0",
                glowColors[tier]
            )}
            animate={{
                opacity: [0, 0.3, 0],
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
            }}
        />
    );
};

export function BadgeCard({
    badge,
    isUnlocked,
    progress = 0,
    onReveal,
    showRevealAnimation = false,
    size = "md",
}: BadgeCardProps) {
    const [isRevealing, setIsRevealing] = useState(showRevealAnimation);
    const [isHovered, setIsHovered] = useState(false);
    const styles = tierStyles[badge.tier];
    const sizeStyle = sizeStyles[size];

    useEffect(() => {
        if (showRevealAnimation) {
            setIsRevealing(true);
            const timer = setTimeout(() => {
                setIsRevealing(false);
                onReveal?.();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [showRevealAnimation, onReveal]);

    const iconToRender = badge.icon || badge.iconUrl;

    return (
        <motion.div
            className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                sizeStyle.container,
                isUnlocked
                    ? cn(styles.bg, styles.border, "hover:shadow-lg", styles.glow)
                    : "bg-muted/50 border-muted-foreground/20 grayscale"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={showRevealAnimation ? { scale: 0, rotate: -180 } : { scale: 1 }}
            animate={
                showRevealAnimation
                    ? {
                          scale: 1,
                          rotate: 0,
                      }
                    : { scale: 1 }
            }
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
            }}
        >
            {/* Glow effect for unlocked badges */}
            {isUnlocked && badge.tier === "gold" && <GlowPulse tier={badge.tier} />}

            {/* Particle burst on reveal */}
            <AnimatePresence>
                {isRevealing && <ParticleBurst tier={badge.tier} />}
            </AnimatePresence>

            {/* Spinning stars for gold badges */}
            {isUnlocked && badge.tier === "gold" && isHovered && <SpinningStars />}

            {/* Badge Icon Container */}
            <motion.div
                className={cn(
                    "relative flex items-center justify-center rounded-full mb-2",
                    sizeStyle.iconWrapper,
                    isUnlocked
                        ? cn("bg-gradient-to-br", styles.gradient, "shadow-lg")
                        : "bg-muted"
                )}
                animate={
                    isUnlocked && isHovered
                        ? {
                              rotate: [0, -5, 5, 0],
                              scale: [1, 1.1, 1],
                          }
                        : {}
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {/* Shimmer effect for locked badges */}
                {!isUnlocked && <ShimmerOverlay />}

                {isUnlocked ? (
                    <motion.span
                        className={sizeStyle.icon}
                        animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {iconToRender}
                    </motion.span>
                ) : badge.isSecret ? (
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                    >
                        <Sparkles className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                )}

                {/* Unlock checkmark */}
                {isUnlocked && (
                    <motion.div
                        className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        <Check className="w-3 h-3 text-white" />
                    </motion.div>
                )}
            </motion.div>

            {/* Badge Name */}
            <motion.p
                className={cn(
                    "font-semibold text-center leading-tight line-clamp-2",
                    sizeStyle.name,
                    isUnlocked ? styles.text : "text-muted-foreground"
                )}
            >
                {badge.isSecret && !isUnlocked ? "???" : badge.name}
            </motion.p>

            {/* XP Reward */}
            {isUnlocked && (
                <motion.div
                    className={cn(
                        "flex items-center gap-0.5 mt-1",
                        sizeStyle.xp,
                        styles.text
                    )}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Sparkles className="w-3 h-3" />
                    <span>+{badge.xpReward} XP</span>
                </motion.div>
            )}

            {/* Progress bar for locked badges */}
            {!isUnlocked && progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <motion.div
                        className={cn("h-full bg-gradient-to-r", styles.gradient)}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            )}

            {/* Tier indicator */}
            <div
                className={cn(
                    "absolute top-1 right-1 w-2 h-2 rounded-full",
                    badge.tier === "gold" && "bg-yellow-400",
                    badge.tier === "silver" && "bg-slate-400",
                    badge.tier === "bronze" && "bg-amber-600"
                )}
            />
        </motion.div>
    );
}

// Badge Card with full details (for modals/expanded views)
export function BadgeCardExpanded({
    badge,
    isUnlocked,
    progress = 0,
}: BadgeCardProps) {
    const styles = tierStyles[badge.tier];
    const iconToRender = badge.icon || badge.iconUrl;

    return (
        <motion.div
            className={cn(
                "relative flex flex-col items-center p-6 rounded-2xl border-2",
                isUnlocked
                    ? cn(styles.bg, styles.border, "shadow-lg", styles.glow)
                    : "bg-muted/30 border-muted-foreground/20"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
        >
            {/* Glow effect */}
            {isUnlocked && <GlowPulse tier={badge.tier} />}

            {/* Icon */}
            <motion.div
                className={cn(
                    "relative flex items-center justify-center w-24 h-24 rounded-full mb-4",
                    isUnlocked
                        ? cn("bg-gradient-to-br", styles.gradient, "shadow-xl")
                        : "bg-muted"
                )}
                animate={isUnlocked ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                {isUnlocked ? (
                    <span className="text-5xl">{iconToRender}</span>
                ) : badge.isSecret ? (
                    <Sparkles className="w-10 h-10 text-muted-foreground" />
                ) : (
                    <Lock className="w-10 h-10 text-muted-foreground" />
                )}
            </motion.div>

            {/* Name */}
            <h3
                className={cn(
                    "text-xl font-bold mb-2",
                    isUnlocked ? styles.text : "text-muted-foreground"
                )}
            >
                {badge.isSecret && !isUnlocked ? "Secret Badge" : badge.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
                {badge.isSecret && !isUnlocked
                    ? "Keep exploring to discover this secret badge!"
                    : badge.description}
            </p>

            {/* Tier & XP */}
            <div className="flex items-center gap-4">
                <span
                    className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold uppercase",
                        styles.bg,
                        styles.text
                    )}
                >
                    {badge.tier}
                </span>
                <span className="flex items-center gap-1 text-sm">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    {badge.xpReward} XP
                </span>
            </div>

            {/* Progress */}
            {!isUnlocked && progress > 0 && (
                <div className="w-full mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className={cn("h-full bg-gradient-to-r", styles.gradient)}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                </div>
            )}

            {/* Unlocked indicator */}
            {isUnlocked && (
                <motion.div
                    className="absolute top-4 right-4 bg-green-500 rounded-full p-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                >
                    <Check className="w-4 h-4 text-white" />
                </motion.div>
            )}
        </motion.div>
    );
}
