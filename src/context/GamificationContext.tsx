"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// ============================================
// TYPES
// ============================================

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name or emoji
    category: 'mastery' | 'streak' | 'explorer';
}

export interface Achievement {
    id: string;
    badgeId: string;
    unlockedAt: Date;
}

export interface GamificationState {
    xp: number;
    level: number;
    currentStreak: number;
    lastActivityDate: Date | null;
    achievements: Achievement[];
}

export interface GamificationContextType {
    state: GamificationState;
    addXP: (amount: number, reason: string) => void;
    unlockBadge: (badgeId: string) => void;
    incrementStreak: () => void;
}

// ============================================
// INITIAL STATE & DATA
// ============================================

export const BADGES: Record<string, Badge> = {
    'first_step': { id: 'first_step', name: 'First Step', description: 'Complete your first investigation phase.', icon: '👣', category: 'explorer' },
    'on_fire': { id: 'on_fire', name: 'On Fire', description: 'Maintain a 3-day streak.', icon: '🔥', category: 'streak' },
    'ethics_scholar': { id: 'ethics_scholar', name: 'Ethics Scholar', description: 'Discover 5 concepts.', icon: '🎓', category: 'mastery' },
    'privacy_guardian': { id: 'privacy_guardian', name: 'Privacy Guardian', description: 'demonstrate mastery in Privacy.', icon: '🛡️', category: 'mastery' },
};

const initialState: GamificationState = {
    xp: 0,
    level: 1,
    currentStreak: 0,
    lastActivityDate: null,
    achievements: [],
};

// ============================================
// CONTEXT
// ============================================

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<GamificationState>(initialState);

    const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;

    const addXP = useCallback((amount: number, reason: string) => {
        setState(prev => {
            const newXP = prev.xp + amount;
            const newLevel = calculateLevel(newXP);

            // TODO: logic to trigger level up notification could go here

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
                lastActivityDate: new Date(),
            };
        });
        console.log(`[Gamification] +${amount} XP: ${reason}`);
    }, []);

    const unlockBadge = useCallback((badgeId: string) => {
        setState(prev => {
            if (prev.achievements.some(a => a.badgeId === badgeId)) return prev;

            return {
                ...prev,
                achievements: [...prev.achievements, { id: crypto.randomUUID(), badgeId, unlockedAt: new Date() }]
            };
        });
    }, []);

    const incrementStreak = useCallback(() => {
        // Simple streak logic (in a real app, compare dates properly)
        setState(prev => ({
            ...prev,
            currentStreak: prev.currentStreak + 1
        }));
    }, []);

    return (
        <GamificationContext.Provider value={{ state, addXP, unlockBadge, incrementStreak }}>
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
