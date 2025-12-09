import { getDataProvider } from '../data/DataProviderFactory';
import { MVP_QUEST } from '../quests/biasQuest';
import { Chapter, Quest, QuestProgress, QuestReward } from '../types';

export class QuestEngine {
    private dataProvider = getDataProvider();

    async checkObjectiveCompletion(
        studentId: string,
        objectiveType: string,
        targetId: string,
        score?: number
    ): Promise<{ chapterCompleted: boolean; questCompleted: boolean; rewards?: QuestReward }> {
        const quest = MVP_QUEST; // MVP: Single quest
        const progress = await this.dataProvider.getQuestProgress(studentId, quest.id);

        // Find which chapter contains this objective
        for (const chapter of quest.chapters) {
            for (const objective of chapter.objectives) {
                if (objective.type === objectiveType && objective.target === targetId) {
                    // Check if threshold met (for quiz-type objectives)
                    if (objective.threshold && (!score || score < objective.threshold)) {
                        return { chapterCompleted: false, questCompleted: false };
                    }

                    // Mark objective complete
                    const updatedProgress = this.markObjectiveComplete(progress, chapter.id, targetId);

                    // Check if chapter is now complete
                    const chapterComplete = this.isChapterComplete(chapter, updatedProgress);
                    if (chapterComplete && !updatedProgress.chapterProgress[chapter.id]?.completedAt) {

                        // Mark chapter as complete in progress object
                        if (!updatedProgress.chapterProgress[chapter.id]) {
                            updatedProgress.chapterProgress[chapter.id] = { objectives: {}, completedAt: null };
                        }
                        updatedProgress.chapterProgress[chapter.id].completedAt = new Date().toISOString();

                        // Award chapter XP
                        await this.dataProvider.updateStudentXP(studentId, chapter.xpReward, `quest_chapter_${chapter.id}`);
                    }

                    // Check if quest is now complete
                    const questComplete = this.isQuestComplete(quest, updatedProgress);
                    if (questComplete && updatedProgress.status !== 'completed') {
                        updatedProgress.status = 'completed';
                        updatedProgress.completedAt = new Date().toISOString();

                        // Award quest completion rewards
                        await this.dataProvider.updateStudentXP(studentId, quest.rewards.xp, `quest_complete_${quest.id}`);
                        await this.dataProvider.awardBadge(studentId, quest.rewards.badge);
                    }

                    // Save progress
                    await this.dataProvider.updateQuestProgress(studentId, quest.id, updatedProgress);

                    return {
                        chapterCompleted: chapterComplete,
                        questCompleted: questComplete,
                        rewards: questComplete ? quest.rewards : undefined
                    };
                }
            }
        }

        return { chapterCompleted: false, questCompleted: false };
    }

    private markObjectiveComplete(progress: QuestProgress, chapterId: string, targetId: string): QuestProgress {
        if (!progress.chapterProgress[chapterId]) {
            progress.chapterProgress[chapterId] = { objectives: {}, completedAt: null };
        }
        progress.chapterProgress[chapterId].objectives[targetId] = true;
        return progress;
    }

    private isChapterComplete(chapter: Chapter, progress: QuestProgress): boolean {
        const chapterProgress = progress.chapterProgress[chapter.id];
        if (!chapterProgress) return false;

        return chapter.objectives.every(obj => chapterProgress.objectives[obj.target] === true);
    }

    private isQuestComplete(quest: Quest, progress: QuestProgress): boolean {
        return quest.chapters.every(chapter => this.isChapterComplete(chapter, progress));
    }
}
