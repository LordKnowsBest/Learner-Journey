import { getDataProvider } from '../data/DataProviderFactory';
import { LearningSignalScore } from '../types';

export class LearningSignalEngine {
    private dataProvider = getDataProvider();

    async calculateLSS(studentId: string): Promise<LearningSignalScore> {
        const student = await this.dataProvider.getStudentGamification(studentId);
        const assessments = await this.dataProvider.getStudentAssessments(studentId);

        // Engagement (40%)
        // MVP: Based on streak and XP history activity
        const recentActivity = student.xpHistory?.filter(
            h => new Date(h.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0;
        const engagement = Math.min(100, (recentActivity / 7) * 100 * (student.currentStreak > 0 ? 1.2 : 1));

        // Accuracy (35%)
        // MVP: Based on quiz performance
        const quizAssessments = assessments.filter(a => a.type === 'quiz');
        const accuracy = quizAssessments.length > 0
            ? (quizAssessments.reduce((sum, a) => sum + a.score, 0) / quizAssessments.length)
            : 50; // Default if no assessments

        // Growth (25%)
        // MVP: Based on level progression and XP trend
        const growth = Math.min(100, (student.level / 12) * 100);

        // Weighted composite
        const composite = Math.round(
            engagement * 0.40 +
            accuracy * 0.35 +
            growth * 0.25
        );

        // Determine status
        const status = this.determineStatus(composite);

        return {
            composite,
            components: { engagement, accuracy, growth },
            status
        };
    }

    private determineStatus(score: number): LearningSignalScore['status'] {
        if (score >= 90) return 'accelerated';
        if (score >= 70) return 'on_track';
        if (score >= 50) return 'needs_attention';
        return 'at_risk';
    }
}
