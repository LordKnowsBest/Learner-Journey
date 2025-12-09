"use client";

import { useGamification, BADGES } from "@/context/GamificationContext";
import { useEffect, useState } from "react";
import { Badge as BadgeIcon, X } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

export function BadgeNotification() {
    const { student, badges } = useGamification();
    const [visibleBadge, setVisibleBadge] = useState<string | null>(null);
    const [prevCount, setPrevCount] = useState(0);

    useEffect(() => {
        if (!student || student.unlockedBadges.length === 0) {
            if (student) setPrevCount(student.unlockedBadges.length);
            return;
        }

        // Check if count increased
        if (student.unlockedBadges.length > prevCount) {
            const latestId = student.unlockedBadges[student.unlockedBadges.length - 1];
            setVisibleBadge(latestId);
            const timer = setTimeout(() => setVisibleBadge(null), 5000);
            setPrevCount(student.unlockedBadges.length);
            return () => clearTimeout(timer);
        }

        // Sync count if looking at generic update
        setPrevCount(student.unlockedBadges.length);

    }, [student.unlockedBadges.length, prevCount, student]);

    if (!visibleBadge) return null;

    // Find badge definition
    // Try to find in the badges list passed from context, or fall back to local lookup if needed
    const badgeDef = badges.find(b => b.id === visibleBadge) || BADGES[visibleBadge];
    if (!badgeDef) return null;

    // Icon might be emoji or url, logic below assumes emoji for now based on BADGES map, but new badges have icons.
    // The previous implementation used badge.icon directly. MOCK_BADGES has iconUrl (emoji).
    const iconToRender = badgeDef.icon || (badgeDef as any).iconUrl;

    if (!visibleBadge) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-4 right-4 z-50 pointer-events-none"
            >
                <Card className="p-4 flex items-center gap-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/50 shadow-lg backdrop-blur-md w-80 pointer-events-auto">
                    <div className="text-4xl">{iconToRender}</div>
                    <div className="flex-1">
                        <h4 className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Badge Unlocked!</h4>
                        <CardTitle className="text-base">{badgeDef.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{badgeDef.description}</CardDescription>
                    </div>
                    <button onClick={() => setVisibleBadge(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                    </button>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
