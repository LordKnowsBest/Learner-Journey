export interface StudentGamification {
    studentId: string;
    totalXP: number;
    level: number;
    levelTitle: string;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;

    // New/Updated properties based on spec
    streakProtectionTokens: number;
    unlockedBadges: string[];
    badgeProgress: Record<string, number>;
    activeQuests: string[];
    completedQuests: string[];
    questProgress: Record<string, QuestProgress>;
    leaderboardOptIn: boolean;
    displayMode: 'initials' | 'full_name' | 'anonymous';
    xpHistory: XPHistoryEntry[];
}

export interface XPHistoryEntry {
    date: string;
    xpEarned: number;
    source: string;
}

export interface StreakUpdate {
    currentStreak: number;
    lastActiveDate: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    category: 'mastery' | 'streak' | 'exploration' | 'ethics' | 'collaboration' | 'engagement' | 'explorer'; // Added explorer to match existing
    tier: 'bronze' | 'silver' | 'gold';
    iconUrl: string; // Or icon string/name
    unlockCriteria: UnlockCriteria;
    xpReward: number;
    isSecret: boolean;
    // Optional for backward compat if needed
    icon?: string;
}

export interface UnlockCriteria {
    type: 'compound' | 'threshold' | 'streak' | 'event';
    conditions: Condition[];
    requireAll: boolean;
}

export interface Condition {
    metric?: string;
    event?: string;
    domain?: string;
    nodeId?: string;
    task?: string;
    topic?: string;
    threshold?: number;
    count?: number;
}

export interface LeaderboardEntry {
    rank: number;
    studentId: string;
    displayName?: string;
    xp: number;
    level: number;
    streak: number;
    isAnonymous: boolean;
}

export interface LeaderboardUpdate {
    displayName?: string;
    xp?: number;
    level?: number;
    streak?: number;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    type: 'main' | 'side';
    chapters: Chapter[];
    rewards: QuestReward;
    prerequisites: string[];
}

export interface Chapter {
    id: string;
    title: string;
    narrative: string;
    objectives: QuestObjective[];
    xpReward: number;
}

export interface QuestObjective {
    type: 'complete_node' | 'pass_quiz' | 'submit_reflection' | 'solve_problem';
    target: string;
    label: string;
    threshold?: number;
}

export interface QuestReward {
    xp: number;
    badge: string;
    certificateId: string;
}

export interface QuestProgress {
    questId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    currentChapter: number;
    chapterProgress: Record<string, ChapterProgress>;
    startedAt: string | null; // ISO Date string
    completedAt: string | null;
}

export interface ChapterProgress {
    objectives: Record<string, boolean>;
    completedAt: string | null;
}

export interface QuestProgressUpdate {
    status?: 'not_started' | 'in_progress' | 'completed';
    currentChapter?: number;
    chapterProgress?: Record<string, ChapterProgress>;
    startedAt?: string | null;
    completedAt?: string | null;
}

export interface Assessment {
    assessmentId: string;
    studentId: string;
    type: 'quiz' | 'reflection' | 'problem';
    score: number;
    submittedAt: string;
    // ... other fields
}

export interface LearningSignalScore {
    composite: number;
    components: {
        engagement: number;
        accuracy: number;
        growth: number;
    };
    status: 'on_track' | 'needs_attention' | 'at_risk' | 'accelerated';
}
