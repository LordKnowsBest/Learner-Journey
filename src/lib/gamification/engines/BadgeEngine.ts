import { getDataProvider } from '../data/DataProviderFactory';
import { Badge, StudentGamification, UnlockCriteria, Condition } from '../types';

export class BadgeEngine {
    private dataProvider = getDataProvider();

    async checkAndAwardBadges(studentId: string, activityType: string, metadata?: any): Promise<Badge[]> {
        const badges = await this.dataProvider.getBadgeDefinitions();
        const studentBadges = await this.dataProvider.getStudentBadges(studentId);
        const student = await this.dataProvider.getStudentGamification(studentId);

        const newlyAwarded: Badge[] = [];

        for (const badge of badges) {
            // Skip already earned badges
            if (studentBadges.includes(badge.id)) continue;

            // Check unlock criteria
            const isUnlocked = await this.evaluateCriteria(student, badge.unlockCriteria, metadata);

            if (isUnlocked) {
                await this.dataProvider.awardBadge(studentId, badge.id);

                // Award badge XP bonus
                await this.dataProvider.updateStudentXP(studentId, badge.xpReward, `badge_${badge.id}`);

                newlyAwarded.push(badge);
            }
        }

        return newlyAwarded;
    }

    private async evaluateCriteria(
        student: StudentGamification,
        criteria: UnlockCriteria,
        metadata?: any
    ): Promise<boolean> {
        const results = await Promise.all(
            criteria.conditions.map(c => this.evaluateCondition(student, c, metadata))
        );

        return criteria.requireAll
            ? results.every(r => r === true)
            : results.some(r => r === true);
    }

    private async evaluateCondition(
        student: StudentGamification,
        condition: Condition,
        metadata?: any
    ): Promise<boolean> {
        switch (condition.metric) {
            case 'streak':
                return student.currentStreak >= (condition.threshold || 0);

            case 'questsCompleted':
                return student.completedQuests.length >= (condition.threshold || 0);

            case 'nodesMastered':
                // MVP: Simplified - count from mock/real progress data
                // In production, query actual progress collection
                return this.countMasteredNodes(student, condition.domain) >= (condition.threshold || 0);

            case 'quizScore':
                return (metadata?.score || 0) >= (condition.threshold || 0);

            case 'optionalResourcesViewed':
                // Mock implementation for MVP
                return true;

            default:
                // Handle event-based
                if (condition.event) {
                    // If this check is triggered by the specific event
                    return metadata?.event === condition.event;
                }
                return false;
        }
    }

    private countMasteredNodes(student: StudentGamification, domain?: string): number {
        // MVP: Return simulated count based on XP/level correlation
        // Production: Query actual /students/{id}/progress collection
        return Math.floor(student.level * 2);
    }
}
