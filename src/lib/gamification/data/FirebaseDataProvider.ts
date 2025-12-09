import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    increment,
    arrayUnion,
    Timestamp,
    getDocs,
    Firestore
} from 'firebase/firestore';
import { IGamificationDataProvider } from './DataProvider.interface';
import { ENV_CONFIG } from '../../../config/environment';
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

export class FirebaseDataProvider implements IGamificationDataProvider {
    private db: Firestore;

    constructor() {
        // Note: This relies on valid configs being present. 
        // In a real MVP, validation should occur here.
        const app = initializeApp(ENV_CONFIG.FIREBASE_CONFIG as any);
        this.db = getFirestore(app);
        console.log('🔥 FirebaseDataProvider initialized');
    }

    async getStudentGamification(studentId: string): Promise<StudentGamification> {
        const docRef = doc(this.db, 'students', studentId, 'gamification', 'main');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as StudentGamification;
        } else {
            // Create default document for new student
            const defaultData = this.generateDefaultStudent(studentId);
            await setDoc(docRef, defaultData);
            return defaultData;
        }
    }

    async updateStudentXP(studentId: string, xpDelta: number, source: string): Promise<void> {
        const docRef = doc(this.db, 'students', studentId, 'gamification', 'main');

        await updateDoc(docRef, {
            totalXP: increment(xpDelta),
            xpHistory: arrayUnion({
                date: new Date().toISOString(),
                xpEarned: xpDelta,
                source
            })
        });

        // Recalculate level after XP update
        const updated = await this.getStudentGamification(studentId);
        const newLevel = this.calculateLevel(updated.totalXP);
        if (newLevel !== updated.level) {
            await updateDoc(docRef, {
                level: newLevel,
                levelTitle: this.getLevelTitle(newLevel),
                lastLevelUp: Timestamp.now()
            });
        }
    }

    async updateStudentStreak(studentId: string, streakData: StreakUpdate): Promise<void> {
        const docRef = doc(this.db, 'students', studentId, 'gamification', 'main');
        const current = await this.getStudentGamification(studentId);

        await updateDoc(docRef, {
            currentStreak: streakData.currentStreak,
            longestStreak: Math.max(current.longestStreak, streakData.currentStreak),
            lastActiveDate: streakData.lastActiveDate
        });
    }

    async getBadgeDefinitions(): Promise<Badge[]> {
        const badgesRef = collection(this.db, 'achievements');
        const q = query(badgesRef, orderBy('category'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge));
    }

    async awardBadge(studentId: string, badgeId: string): Promise<void> {
        const docRef = doc(this.db, 'students', studentId, 'gamification', 'main');

        await updateDoc(docRef, {
            unlockedBadges: arrayUnion(badgeId),
            lastBadgeUnlock: Timestamp.now()
        });

        // Increment global unlock counter on badge
        const badgeRef = doc(this.db, 'achievements', badgeId);
        await updateDoc(badgeRef, {
            totalUnlocks: increment(1)
        });
    }

    async getStudentBadges(studentId: string): Promise<string[]> {
        const student = await this.getStudentGamification(studentId);
        return student.unlockedBadges;
    }

    async getLeaderboard(scope: string, category: string): Promise<LeaderboardEntry[]> {
        const leaderboardRef = doc(this.db, 'leaderboards', `${scope}_${category}_weekly`);
        const docSnap = await getDoc(leaderboardRef);

        if (docSnap.exists()) {
            return docSnap.data().entries as LeaderboardEntry[];
        }
        return [];
    }

    async updateLeaderboardEntry(studentId: string, data: LeaderboardUpdate): Promise<void> {
        // MVP: Simple approach - full rewrite of class leaderboard
        // Production: Use Cloud Functions for efficient incremental updates
        const leaderboardRef = doc(this.db, 'leaderboards', `class_weekly`);
        const docSnap = await getDoc(leaderboardRef);

        let entries: LeaderboardEntry[] = docSnap.exists() ? docSnap.data().entries : [];

        const existingIndex = entries.findIndex(e => e.studentId === studentId);
        if (existingIndex >= 0) {
            entries[existingIndex] = { ...entries[existingIndex], ...data };
        } else {
            entries.push({ studentId, ...data } as unknown as LeaderboardEntry);
        }

        // Sort and assign ranks
        entries.sort((a, b) => b.xp - a.xp);
        entries.forEach((entry, idx) => entry.rank = idx + 1);

        await setDoc(leaderboardRef, {
            entries,
            lastUpdated: Timestamp.now(),
            totalParticipants: entries.length
        });
    }

    async getQuestProgress(studentId: string, questId: string): Promise<QuestProgress> {
        const student = await this.getStudentGamification(studentId);
        return student.questProgress[questId] || this.generateDefaultQuestProgress(questId);
    }

    async updateQuestProgress(studentId: string, questId: string, progress: QuestProgressUpdate): Promise<void> {
        const docRef = doc(this.db, 'students', studentId, 'gamification', 'main');

        await updateDoc(docRef, {
            [`questProgress.${questId}`]: progress
        });
    }

    async getStudentAssessments(studentId: string): Promise<Assessment[]> {
        const assessmentsRef = collection(this.db, 'students', studentId, 'assessments');
        const q = query(assessmentsRef, orderBy('submittedAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Assessment);
    }

    // Real-time subscription for live updates
    subscribeToGamification(studentId: string, callback: (data: StudentGamification) => void): () => void {
        const docRef = doc(this.db, 'students', studentId, 'gamification', 'main');

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data() as StudentGamification);
            }
        });

        return unsubscribe;
    }

    // Helper methods (same as MockDataProvider)
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

    private getLevelTitle(level: number): string {
        const titles = ['AI Novice', 'Data Explorer', 'Pattern Finder', 'Algorithm Apprentice',
            'Neural Navigator', 'Ethics Guardian', 'AI Explorer', 'Machine Mentor',
            'Bias Buster', 'AI Architect', 'Knowledge Master', 'AI Literacy Champion'];
        return titles[level - 1] || 'AI Novice';
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
