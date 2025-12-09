"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDataProvider } from '@/lib/gamification/data/DataProviderFactory';
import { XPEngine } from '@/lib/gamification/engines/XPEngine';
import { BadgeEngine } from '@/lib/gamification/engines/BadgeEngine';
import { StudentGamification, Badge } from '@/lib/gamification/types';
import { MOCK_BADGES } from '@/lib/gamification/data/mockData';

// Re-export Badge type
export type { Badge };

export interface GamificationContextType {
    student: StudentGamification;
    badges: Badge[];
    loading: boolean;
    addXP: (amount: number, reason: string) => void;
    unlockBadge: (badgeId: string) => void;
    incrementStreak: () => void;
    refresh: () => Promise<void>;
}

// Default state for initial render
const defaultStudent: StudentGamification = {
    studentId: 'loading',
    totalXP: 0,
    level: 1,
    levelTitle: 'Novice',
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    streakProtectionTokens: 0,
    unlockedBadges: [],
    badgeProgress: {},
    activeQuests: [],
    completedQuests: [],
    questProgress: {},
    leaderboardOptIn: false,
    displayMode: 'initials',
    xpHistory: []
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Legacy export for compatibility if needed (mapped from new badges)
export const BADGES: Record<string, any> = MOCK_BADGES.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});

export function GamificationProvider({ children }: { children: ReactNode }) {
    const [student, setStudent] = useState<StudentGamification>(defaultStudent);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);

    // Engines
    // Note: In a real app these might be singletons or useDependency Injection
    const dataProvider = getDataProvider();
    const xpEngine = new XPEngine();
    const badgeEngine = new BadgeEngine();

    // MVP: Hardcoded current student
    const CURRENT_STUDENT_ID = 'demo_student_001';

    const refresh = useCallback(async () => {
        try {
            const s = await dataProvider.getStudentGamification(CURRENT_STUDENT_ID);
            const b = await dataProvider.getBadgeDefinitions();
            setStudent(s);
            setBadges(b);
        } catch (error) {
            console.error("Failed to refresh gamification state:", error);
        } finally {
            setLoading(false);
        }
    }, [dataProvider]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addXP = useCallback(async (amount: number, reason: string) => {
        // We use the engine to calculate and award, but for manual override we might call provider directly
        // The Engine supports calculating rules, but here let's assume we just want to ADD raw XP for now
        // or trigger a generic "manual_award" activity.

        // However, the interface expects `amount`. 
        // The XPEngine `calculateAndAwardXP` takes an activity type.
        // Let's bypass engine for raw add if needed, OR add a 'manual' rule.

        // For MVP compatibility with existing calls:
        await dataProvider.updateStudentXP(CURRENT_STUDENT_ID, amount, reason);
        refresh();
    }, [dataProvider, refresh]);

    const unlockBadge = useCallback(async (badgeId: string) => {
        await dataProvider.awardBadge(CURRENT_STUDENT_ID, badgeId);
        refresh();
    }, [dataProvider, refresh]);

    const incrementStreak = useCallback(async () => {
        // MVP: Simple toggle logic or increment data
        // We need to pass a StreakUpdate object
        const current = await dataProvider.getStudentGamification(CURRENT_STUDENT_ID);
        await dataProvider.updateStudentStreak(CURRENT_STUDENT_ID, {
            currentStreak: current.currentStreak + 1,
            lastActiveDate: new Date().toISOString()
        });
        refresh();
    }, [dataProvider, refresh]);

    return (
        <GamificationContext.Provider value={{
            student,
            badges,
            loading,
            addXP,
            unlockBadge,
            incrementStreak,
            refresh
        }}>
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
}
