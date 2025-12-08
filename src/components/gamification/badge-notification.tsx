"use client";

import { useGamification, BADGES } from "@/context/GamificationContext";
import { useEffect, useState } from "react";
import { Badge as BadgeIcon, X } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

export function BadgeNotification() {
    const { state } = useGamification();
    const [visibleBadge, setVisibleBadge] = useState<string | null>(null);

    // Monitor for new badges
    // In a real app, we'd might use an event emitter or a "newlyUnlocked" state queue.
    // For this MVP, we'll just check if the latest badge was unlocked recently (within 5 seconds).

    useEffect(() => {
        if (state.achievements.length === 0) return;

        const latest = state.achievements[state.achievements.length - 1];
        const now = new Date();
        const timeDiff = now.getTime() - new Date(latest.unlockedAt).getTime();

        if (timeDiff < 5000) {
            setVisibleBadge(latest.badgeId);
            const timer = setTimeout(() => setVisibleBadge(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [state.achievements.length]); // Only run when count changes

    if (!visibleBadge) return null;

    const badge = BADGES[visibleBadge];
    if (!badge) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-4 right-4 z-50 pointer-events-none"
            >
                <Card className="p-4 flex items-center gap-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/50 shadow-lg backdrop-blur-md w-80 pointer-events-auto">
                    <div className="text-4xl">{badge.icon}</div>
                    <div className="flex-1">
                        <h4 className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Badge Unlocked!</h4>
                        <CardTitle className="text-base">{badge.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{badge.description}</CardDescription>
                    </div>
                    <button onClick={() => setVisibleBadge(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                    </button>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
