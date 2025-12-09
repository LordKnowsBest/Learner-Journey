import {
    StudentGamification,
    Badge,
    LeaderboardEntry,
    LeaderboardUpdate,
    QuestProgress,
    QuestProgressUpdate,
    Assessment,
    StreakUpdate
} from '../types';

export interface IGamificationDataProvider {
    // Student Gamification
    getStudentGamification(studentId: string): Promise<StudentGamification>;
    updateStudentXP(studentId: string, xpDelta: number, source: string): Promise<void>;
    updateStudentStreak(studentId: string, streakData: StreakUpdate): Promise<void>;

    // Badges
    getBadgeDefinitions(): Promise<Badge[]>;
    awardBadge(studentId: string, badgeId: string): Promise<void>;
    getStudentBadges(studentId: string): Promise<string[]>;

    // Leaderboard
    getLeaderboard(scope: string, category: string): Promise<LeaderboardEntry[]>;
    updateLeaderboardEntry(studentId: string, data: LeaderboardUpdate): Promise<void>;

    // Quests
    getQuestProgress(studentId: string, questId: string): Promise<QuestProgress>;
    updateQuestProgress(studentId: string, questId: string, progress: QuestProgressUpdate): Promise<void>;

    // Assessments (for LSS calculation)
    getStudentAssessments(studentId: string): Promise<Assessment[]>;

    // Real-time subscriptions (Firebase-only, mock returns static)
    subscribeToGamification(studentId: string, callback: (data: StudentGamification) => void): () => void;
}
