import { IGamificationDataProvider } from './DataProvider.interface';
import { MOCK_STUDENTS, MOCK_BADGES, MOCK_LEADERBOARD, MOCK_ASSESSMENTS } from './mockData';
import {
    StudentGamification,
    Badge,
    LeaderboardEntry,
    LeaderboardUpdate,
    QuestProgress,
    QuestProgressUpdate,
    Assessment,
    StreakUpdate // Import this type
} from '../types';

export class MockDataProvider implements IGamificationDataProvider {
    private students: Map<string, StudentGamification>;
    private badges: Badge[];
    private leaderboard: LeaderboardEntry[];

    constructor() {
        // Initialize with pre-seeded mock data
        this.students = new Map(MOCK_STUDENTS.map(s => [s.studentId, s]));
        this.badges = MOCK_BADGES;
        this.leaderboard = MOCK_LEADERBOARD;

        console.log('📦 MockDataProvider initialized with sample data');
    }

    async getStudentGamification(studentId: string): Promise<StudentGamification> {
        // Return mock student or generate default
        return this.students.get(studentId) || this.generateDefaultStudent(studentId);
    }

    async updateStudentXP(studentId: string, xpDelta: number, source: string): Promise<void> {
        const student = await this.getStudentGamification(studentId);
        student.totalXP += xpDelta;
        student.level = this.calculateLevel(student.totalXP);
        student.xpHistory.push({
            date: new Date().toISOString(),
            xpEarned: xpDelta,
            source
        });
        this.students.set(studentId, student);

        console.log(`🎮 [MOCK] Awarded ${xpDelta} XP to ${studentId} (Total: ${student.totalXP})`);
    }

    async updateStudentStreak(studentId: string, streakData: StreakUpdate): Promise<void> {
        const student = await this.getStudentGamification(studentId);
        student.currentStreak = streakData.currentStreak;
        student.longestStreak = Math.max(student.longestStreak, streakData.currentStreak);
        student.lastActiveDate = streakData.lastActiveDate;
        this.students.set(studentId, student);

        console.log(`🔥 [MOCK] Updated streak for ${studentId}: ${student.currentStreak} days`);
    }

    async getBadgeDefinitions(): Promise<Badge[]> {
        return this.badges;
    }

    async awardBadge(studentId: string, badgeId: string): Promise<void> {
        const student = await this.getStudentGamification(studentId);
        if (!student.unlockedBadges.includes(badgeId)) {
            student.unlockedBadges.push(badgeId);
            this.students.set(studentId, student);
            console.log(`🏆 [MOCK] Awarded badge '${badgeId}' to ${studentId}`);
        }
    }

    async getStudentBadges(studentId: string): Promise<string[]> {
        const student = await this.getStudentGamification(studentId);
        return student.unlockedBadges;
    }

    async getLeaderboard(scope: string, category: string): Promise<LeaderboardEntry[]> {
        // Return sorted mock leaderboard
        return [...this.leaderboard].sort((a, b) => b.xp - a.xp);
    }

    async updateLeaderboardEntry(studentId: string, data: LeaderboardUpdate): Promise<void> {
        const existingIndex = this.leaderboard.findIndex(e => e.studentId === studentId);
        if (existingIndex >= 0) {
            this.leaderboard[existingIndex] = { ...this.leaderboard[existingIndex], ...data };
        } else {
            this.leaderboard.push({
                rank: this.leaderboard.length + 1,
                studentId,
                xp: data.xp || 0,
                level: data.level || 1,
                streak: data.streak || 0,
                isAnonymous: false, // Default
                displayName: data.displayName || 'Unknown'
            } as LeaderboardEntry);
        }
        // Re-sort and update ranks
        this.leaderboard.sort((a, b) => b.xp - a.xp);
        this.leaderboard.forEach((entry, idx) => entry.rank = idx + 1);
    }

    async getQuestProgress(studentId: string, questId: string): Promise<QuestProgress> {
        const student = await this.getStudentGamification(studentId);
        return student.questProgress[questId] || this.generateDefaultQuestProgress(questId);
    }

    async updateQuestProgress(studentId: string, questId: string, progress: QuestProgressUpdate): Promise<void> {
        const student = await this.getStudentGamification(studentId);
        const currentProgress = student.questProgress[questId] || this.generateDefaultQuestProgress(questId);

        student.questProgress[questId] = {
            ...currentProgress,
            ...progress
        };
        this.students.set(studentId, student);
        console.log(`📜 [MOCK] Updated quest '${questId}' progress for ${studentId}`);
    }

    async getStudentAssessments(studentId: string): Promise<Assessment[]> {
        // Return mock assessment history
        return MOCK_ASSESSMENTS.filter(a => a.studentId === studentId);
    }

    // Mock subscriptions return static data (no real-time updates)
    subscribeToGamification(studentId: string, callback: (data: StudentGamification) => void): () => void {
        this.getStudentGamification(studentId).then(callback);
        // Return no-op unsubscribe
        return () => { };
    }

    // Helper methods
    private generateDefaultStudent(studentId: string): StudentGamification {
        return {
            studentId,
            totalXP: 0,
            level: 1,
            levelTitle: 'AI Novice',
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: new Date().toISOString().split('T')[0],
            streakProtectionTokens: 0,
            unlockedBadges: [],
            badgeProgress: {},
            activeQuests: ['bias_mystery'],
            completedQuests: [],
            questProgress: {},
            leaderboardOptIn: true,
            displayMode: 'initials',
            xpHistory: []
        };
    }

    private calculateLevel(xp: number): number {
        const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000];
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (xp >= thresholds[i]) return i + 1;
        }
        return 1;
    }

    private generateDefaultQuestProgress(questId: string): QuestProgress {
        return {
            questId,
            status: 'not_started',
            currentChapter: 0,
            chapterProgress: {},
            startedAt: null,
            completedAt: null
        };
    }
}
