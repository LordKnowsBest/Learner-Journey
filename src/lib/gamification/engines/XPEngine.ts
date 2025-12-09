import { getDataProvider } from '../data/DataProviderFactory';
import { StudentGamification } from '../types';

// MVP: Simplified XP rules (full complexity deferred)
const MVP_XP_RULES: Record<string, { base: number }> = {
    node_completion: { base: 25 },
    quiz_passed: { base: 50 },
    quiz_perfect: { base: 75 },
    reflection_submitted: { base: 30 },
    problem_solving: { base: 40 },
    daily_login: { base: 10 },
    quest_chapter: { base: 100 },
    quest_complete: { base: 500 } // Added to match QuestEngine
};

const MVP_DIFFICULTY_MULTIPLIERS: Record<string, number> = {
    beginner: 1.0,
    intermediate: 1.5,
    advanced: 2.0
};

const MVP_STREAK_MULTIPLIERS = [
    { minDays: 0, multiplier: 1.0 },
    { minDays: 3, multiplier: 1.1 },
    { minDays: 7, multiplier: 1.25 },
    { minDays: 14, multiplier: 1.4 }
];

export class XPEngine {
    private dataProvider = getDataProvider();

    async calculateAndAwardXP(
        studentId: string,
        activityType: string,
        metadata: { nodeId?: string; difficulty?: string; score?: number }
    ): Promise<number> {
        const rule = MVP_XP_RULES[activityType];
        const baseXP = rule ? rule.base : 10; // Default fallback

        // Apply difficulty multiplier if node-based activity
        const difficultyMult = metadata.difficulty
            ? MVP_DIFFICULTY_MULTIPLIERS[metadata.difficulty] || 1.0
            : 1.0;

        // Apply streak multiplier
        const student = await this.dataProvider.getStudentGamification(studentId);
        const streakMult = this.getStreakMultiplier(student.currentStreak);

        // Calculate final XP
        const totalXP = Math.floor(baseXP * difficultyMult * streakMult);

        // Award XP
        await this.dataProvider.updateStudentXP(studentId, totalXP, activityType);

        return totalXP;
    }

    private getStreakMultiplier(streakDays: number): number {
        for (let i = MVP_STREAK_MULTIPLIERS.length - 1; i >= 0; i--) {
            if (streakDays >= MVP_STREAK_MULTIPLIERS[i].minDays) {
                return MVP_STREAK_MULTIPLIERS[i].multiplier;
            }
        }
        return 1.0;
    }
}
