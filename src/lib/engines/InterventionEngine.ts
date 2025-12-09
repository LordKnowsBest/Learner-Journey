import { KnowledgeNode, LearningPath } from '../types';

export enum InterventionType {
    HINT_PROMPT = 'hint_prompt',
    RESOURCE_RECOMMENDATION = 'resource_recommendation',
    REMEDIAL_NODE = 'remedial_node',
    TEACHER_ALERT = 'teacher_alert'
}

export type Intervention = {
    id: string;
    type: InterventionType;
    studentId: string;
    triggeredByNodeId?: string;
    reason: string;
    createdAt: Date;
};

export class InterventionEngine {

    /**
     * Analyzes student struggle metrics to determine if an intervention is needed.
     * This would typically be called after a failed mastery attempt or high 'stuck' count.
     */
    static analyzeStruggle(
        studentId: string,
        currentNode: KnowledgeNode,
        failureCount: number,
        timeSpentSeconds: number
    ): Intervention | null {

        // 1. Check for significant failure (Remediation)
        if (failureCount >= 2) {
            return {
                id: `int_${Date.now()}`,
                type: InterventionType.REMEDIAL_NODE,
                studentId,
                triggeredByNodeId: currentNode.nodeId,
                reason: 'Multiple failures on mastery check',
                createdAt: new Date()
            };
        }

        // 2. Check for "spinning wheels" (Time spent without progress)
        if (timeSpentSeconds > currentNode.estimatedMinutes * 60 * 2) {
            return {
                id: `int_${Date.now()}`,
                type: InterventionType.TEACHER_ALERT,
                studentId,
                triggeredByNodeId: currentNode.nodeId,
                reason: 'Excessive time spent',
                createdAt: new Date()
            };
        }

        return null;
    }
}
