import {
    KnowledgeNode,
    KnowledgeEdge,
    LearningPath,
    EdgeRelationship,
    NodeCategory,
    DifficultyLevel,
    StudentMasteryProfile,
    AssessmentDomain,
} from '../types';
import { MVP_NODES, MVP_EDGES } from '../knowledge-graph';

// ============================================
// DOMAIN-TO-NODE CATEGORY MAPPING
// Maps assessment domains to knowledge graph categories
// ============================================

const DOMAIN_TO_CATEGORY: Partial<Record<AssessmentDomain, NodeCategory[]>> = {
    [AssessmentDomain.AI_FUNDAMENTALS]: [NodeCategory.AI_FUNDAMENTALS],
    [AssessmentDomain.ML_BASICS]: [NodeCategory.MACHINE_LEARNING_DATA],
    [AssessmentDomain.ALGORITHMIC_BIAS]: [NodeCategory.ETHICS_BIAS_SOCIETY],
    [AssessmentDomain.FAIRNESS]: [NodeCategory.ETHICS_BIAS_SOCIETY],
    [AssessmentDomain.TRANSPARENCY]: [NodeCategory.ETHICS_BIAS_SOCIETY],
    [AssessmentDomain.PRIVACY]: [NodeCategory.ETHICS_BIAS_SOCIETY],
    [AssessmentDomain.DATA_COLLECTION]: [NodeCategory.MACHINE_LEARNING_DATA],
    [AssessmentDomain.CONSENT]: [NodeCategory.ETHICS_BIAS_SOCIETY],
    [AssessmentDomain.AI_DECISIONS]: [NodeCategory.AI_SYSTEM_DESIGN],
    [AssessmentDomain.HUMAN_OVERSIGHT]: [NodeCategory.AI_LITERACY_SKILLS],
    [AssessmentDomain.MISINFORMATION]: [NodeCategory.AI_LITERACY_SKILLS],
};

const CATEGORY_TO_DOMAINS: Record<NodeCategory, AssessmentDomain[]> = {
    [NodeCategory.AI_FUNDAMENTALS]: [AssessmentDomain.AI_FUNDAMENTALS],
    [NodeCategory.MACHINE_LEARNING_DATA]: [AssessmentDomain.ML_BASICS, AssessmentDomain.DATA_COLLECTION],
    [NodeCategory.ETHICS_BIAS_SOCIETY]: [
        AssessmentDomain.ALGORITHMIC_BIAS,
        AssessmentDomain.FAIRNESS,
        AssessmentDomain.TRANSPARENCY,
        AssessmentDomain.PRIVACY,
        AssessmentDomain.CONSENT,
    ],
    [NodeCategory.AI_CAREERS_INDUSTRY]: [AssessmentDomain.AI_FUNDAMENTALS],
    [NodeCategory.AI_LITERACY_SKILLS]: [AssessmentDomain.HUMAN_OVERSIGHT, AssessmentDomain.MISINFORMATION],
    [NodeCategory.AI_SYSTEM_DESIGN]: [AssessmentDomain.AI_DECISIONS],
};

// Mastery threshold to consider a node "mastered"
const MASTERY_THRESHOLD = 70;

// Difficulty mapping for path adaptation
const DIFFICULTY_TO_LEVEL: Record<'beginner' | 'intermediate' | 'advanced', DifficultyLevel[]> = {
    beginner: [DifficultyLevel.BEGINNER],
    intermediate: [DifficultyLevel.BEGINNER, DifficultyLevel.INTERMEDIATE],
    advanced: [DifficultyLevel.BEGINNER, DifficultyLevel.INTERMEDIATE, DifficultyLevel.ADVANCED, DifficultyLevel.CHALLENGE],
};

export class PathRouter {
    private nodes: Map<string, KnowledgeNode>;
    private edges: Map<string, KnowledgeEdge[]>;
    private reverseEdges: Map<string, KnowledgeEdge[]>;

    constructor() {
        this.nodes = new Map(MVP_NODES.map(n => [n.nodeId, n]));
        this.edges = this.buildAdjacencyList(MVP_EDGES);
        this.reverseEdges = this.buildReverseAdjacencyList(MVP_EDGES);
    }

    /**
     * Get the mastery level for a node based on the student's domain mastery
     */
    private getNodeMasteryLevel(nodeId: string, profile: StudentMasteryProfile | null): number {
        if (!profile) return 0;

        const node = this.nodes.get(nodeId);
        if (!node) return 0;

        // Get domains associated with this node's category
        const relevantDomains = CATEGORY_TO_DOMAINS[node.category] || [];
        if (relevantDomains.length === 0) return 0;

        // Average mastery across relevant domains
        let totalMastery = 0;
        let count = 0;

        for (const domain of relevantDomains) {
            const domainMastery = profile.domainMastery[domain];
            if (domainMastery) {
                totalMastery += domainMastery.masteryLevel;
                count++;
            }
        }

        return count > 0 ? totalMastery / count : 0;
    }

    /**
     * Check if a node is considered "mastered" based on the profile
     */
    private isNodeMastered(nodeId: string, profile: StudentMasteryProfile | null): boolean {
        const masteryLevel = this.getNodeMasteryLevel(nodeId, profile);
        return masteryLevel >= MASTERY_THRESHOLD;
    }

    /**
     * Get mastered node IDs from the mastery profile
     */
    private getMasteredNodes(profile: StudentMasteryProfile | null): Set<string> {
        const mastered = new Set<string>();
        if (!profile) return mastered;

        for (const node of MVP_NODES) {
            if (this.isNodeMastered(node.nodeId, profile)) {
                mastered.add(node.nodeId);
            }
        }

        return mastered;
    }

    /**
     * Get recommended difficulty from profile
     */
    private getRecommendedDifficultyLevels(profile: StudentMasteryProfile | null): DifficultyLevel[] {
        if (!profile) return DIFFICULTY_TO_LEVEL.beginner;

        // Use ability estimate to determine difficulty
        if (profile.abilityEstimate >= 70) {
            return DIFFICULTY_TO_LEVEL.advanced;
        } else if (profile.abilityEstimate >= 40) {
            return DIFFICULTY_TO_LEVEL.intermediate;
        }
        return DIFFICULTY_TO_LEVEL.beginner;
    }

    /**
     * Score a node for path prioritization based on mastery profile
     */
    private scoreNodePriority(nodeId: string, profile: StudentMasteryProfile | null): number {
        const node = this.nodes.get(nodeId);
        if (!node) return 0;

        let score = 100;

        // Factor 1: Growth area bonus (prioritize weak domains)
        if (profile?.growthDomains) {
            const nodeDomainsSet = new Set(CATEGORY_TO_DOMAINS[node.category] || []);
            const isGrowthArea = profile.growthDomains.some(d => nodeDomainsSet.has(d));
            if (isGrowthArea) {
                score += 30; // Prioritize growth areas
            }
        }

        // Factor 2: Difficulty alignment with ability
        const recommendedLevels = this.getRecommendedDifficultyLevels(profile);
        if (recommendedLevels.includes(node.difficulty)) {
            score += 20; // Bonus for matching difficulty
        } else {
            score -= 10; // Penalty for mismatched difficulty
        }

        // Factor 3: Near-mastery bonus (nodes close to mastery get priority)
        const currentMastery = this.getNodeMasteryLevel(nodeId, profile);
        if (currentMastery >= 50 && currentMastery < MASTERY_THRESHOLD) {
            score += 15; // Bonus for near-mastery nodes
        }

        // Factor 4: Prerequisite satisfaction score
        const prereqMastery = this.getPrerequisiteMastery(nodeId, profile);
        score += prereqMastery * 0.2; // Bonus for well-prepared nodes

        return score;
    }

    /**
     * Get average mastery of prerequisites for a node
     */
    private getPrerequisiteMastery(nodeId: string, profile: StudentMasteryProfile | null): number {
        const node = this.nodes.get(nodeId);
        if (!node || node.prerequisites.length === 0) return 100;

        let totalMastery = 0;
        for (const prereqId of node.prerequisites) {
            totalMastery += this.getNodeMasteryLevel(prereqId, profile);
        }

        return totalMastery / node.prerequisites.length;
    }

    private buildAdjacencyList(edges: KnowledgeEdge[]): Map<string, KnowledgeEdge[]> {
        const adjacency = new Map<string, KnowledgeEdge[]>();
        for (const edge of edges) {
            if (!adjacency.has(edge.sourceNodeId)) {
                adjacency.set(edge.sourceNodeId, []);
            }
            adjacency.get(edge.sourceNodeId)!.push(edge);
        }
        return adjacency;
    }

    private buildReverseAdjacencyList(edges: KnowledgeEdge[]): Map<string, KnowledgeEdge[]> {
        const adjacency = new Map<string, KnowledgeEdge[]>();
        for (const edge of edges) {
            if (!adjacency.has(edge.targetNodeId)) {
                adjacency.set(edge.targetNodeId, []);
            }
            adjacency.get(edge.targetNodeId)!.push(edge);
        }
        return adjacency;
    }

    /**
     * Computes the optimal learning path for a student based on graph topology
     * and current mastery from the adaptive assessment system.
     *
     * @param studentId - The student's ID
     * @param masteryProfile - Optional mastery profile from the assessment system
     */
    async computeOptimalPath(
        studentId: string,
        masteryProfile?: StudentMasteryProfile | null
    ): Promise<LearningPath> {
        const profile = masteryProfile || null;

        // 1. Get mastered nodes from the mastery profile
        const masteredNodes = this.getMasteredNodes(profile);
        const recommendedLevels = this.getRecommendedDifficultyLevels(profile);

        // 2. Topological Sort / Traversal with mastery-aware prioritization
        const pathNodes: string[] = [];
        const skippedNodes: string[] = [];
        const visited = new Set<string>();
        const queue: string[] = [];

        // Find start nodes (no un-mastered prerequisites)
        for (const node of MVP_NODES) {
            if (this.arePrerequisitesMet(node.nodeId, masteredNodes)) {
                // If node is already mastered, track it as skipped
                if (masteredNodes.has(node.nodeId)) {
                    skippedNodes.push(node.nodeId);
                } else {
                    queue.push(node.nodeId);
                }
            }
        }

        // Sort start nodes by mastery-aware priority
        this.sortQueueByPriority(queue, profile);

        while (queue.length > 0) {
            const nodeId = queue.shift()!;
            if (visited.has(nodeId) || masteredNodes.has(nodeId)) continue;

            const node = this.nodes.get(nodeId);

            // Skip nodes that are too difficult for current ability (soft skip)
            if (node && !recommendedLevels.includes(node.difficulty)) {
                // Don't hard skip, but deprioritize significantly
                // Still include in path but at lower priority
            }

            visited.add(nodeId);
            pathNodes.push(nodeId);

            // Add children if their prerequisites are now met
            const children = this.edges.get(nodeId) || [];
            for (const edge of children) {
                if (edge.relationshipType === EdgeRelationship.REQUIRES_UNDERSTANDING_OF) {
                    const childId = edge.targetNodeId;
                    // Check if ALL prereqs of child are met by (mastered + visited)
                    if (this.arePrerequisitesMet(childId, new Set([...masteredNodes, ...visited]))) {
                        if (masteredNodes.has(childId)) {
                            if (!skippedNodes.includes(childId)) {
                                skippedNodes.push(childId);
                            }
                        } else {
                            queue.push(childId);
                        }
                    }
                }
            }
            this.sortQueueByPriority(queue, profile);
        }

        // 3. Calculate path efficiency based on how many nodes were skipped
        const totalNodes = MVP_NODES.length;
        const pathEfficiency = Math.round(
            ((pathNodes.length + skippedNodes.length) / totalNodes) * 100
        );

        // 4. Construct LearningPath object
        return {
            pathId: `path_${studentId}_${Date.now()}`,
            studentId,
            nodeSequence: pathNodes,
            currentPosition: 0,
            completedNodes: Array.from(masteredNodes),
            skippedNodes,
            injectedRemedialNodes: [],
            pathEfficiency,
            createdAt: new Date(),
            lastModified: new Date()
        };
    }

    /**
     * Computes recommended nodes based on current mastery without creating a full path.
     * Useful for soft recommendations on the problems page.
     */
    getRecommendedNodes(
        profile: StudentMasteryProfile | null,
        count: number = 3
    ): { node: KnowledgeNode; reason: string; priority: number }[] {
        const masteredNodes = this.getMasteredNodes(profile);
        const recommendations: { node: KnowledgeNode; reason: string; priority: number }[] = [];

        for (const node of MVP_NODES) {
            // Skip already mastered nodes
            if (masteredNodes.has(node.nodeId)) continue;

            // Check if prerequisites are met
            if (!this.arePrerequisitesMet(node.nodeId, masteredNodes)) continue;

            const priority = this.scoreNodePriority(node.nodeId, profile);
            const reason = this.getRecommendationReason(node, profile);

            recommendations.push({ node, reason, priority });
        }

        // Sort by priority and return top N
        return recommendations
            .sort((a, b) => b.priority - a.priority)
            .slice(0, count);
    }

    /**
     * Generate a human-readable reason for recommending a node
     */
    private getRecommendationReason(node: KnowledgeNode, profile: StudentMasteryProfile | null): string {
        if (!profile) {
            return 'Great starting point for your learning journey';
        }

        const nodeDomains = CATEGORY_TO_DOMAINS[node.category] || [];
        const isGrowthArea = nodeDomains.some(d => profile.growthDomains?.includes(d));
        const currentMastery = this.getNodeMasteryLevel(node.nodeId, profile);

        if (isGrowthArea) {
            return 'Recommended to strengthen your understanding in this area';
        }

        if (currentMastery >= 50) {
            return 'You\'re making good progress here - keep going!';
        }

        const recommendedLevels = this.getRecommendedDifficultyLevels(profile);
        if (recommendedLevels.includes(node.difficulty)) {
            return `Well-suited to your current skill level`;
        }

        return 'Next step in your personalized learning path';
    }

    /**
     * Get concepts that need review based on spaced repetition
     */
    getConceptsForReview(profile: StudentMasteryProfile | null): KnowledgeNode[] {
        if (!profile) return [];

        const now = new Date();
        const reviewNodes: KnowledgeNode[] = [];

        for (const node of MVP_NODES) {
            const nodeDomains = CATEGORY_TO_DOMAINS[node.category] || [];

            for (const domain of nodeDomains) {
                const domainMastery = profile.domainMastery[domain];
                if (domainMastery?.nextReviewAt && new Date(domainMastery.nextReviewAt) <= now) {
                    reviewNodes.push(node);
                    break;
                }
            }
        }

        return reviewNodes;
    }

    /**
     * Get a summary of the student's progress through the knowledge graph
     */
    getProgressSummary(profile: StudentMasteryProfile | null): {
        totalNodes: number;
        masteredNodes: number;
        inProgressNodes: number;
        notStartedNodes: number;
        overallProgress: number;
        strongestAreas: string[];
        areasForGrowth: string[];
    } {
        const totalNodes = MVP_NODES.length;
        const masteredSet = this.getMasteredNodes(profile);
        let inProgressCount = 0;

        for (const node of MVP_NODES) {
            if (!masteredSet.has(node.nodeId)) {
                const mastery = this.getNodeMasteryLevel(node.nodeId, profile);
                if (mastery > 0 && mastery < MASTERY_THRESHOLD) {
                    inProgressCount++;
                }
            }
        }

        const strongestAreas = profile?.strongDomains?.map(d => d.replace(/_/g, ' ')) || [];
        const areasForGrowth = profile?.growthDomains?.map(d => d.replace(/_/g, ' ')) || [];

        return {
            totalNodes,
            masteredNodes: masteredSet.size,
            inProgressNodes: inProgressCount,
            notStartedNodes: totalNodes - masteredSet.size - inProgressCount,
            overallProgress: Math.round((masteredSet.size / totalNodes) * 100),
            strongestAreas,
            areasForGrowth,
        };
    }

    private arePrerequisitesMet(nodeId: string, masteredOrVisited: Set<string>): boolean {
        const node = this.nodes.get(nodeId);
        if (!node) return false;
        return node.prerequisites.every(prereqId => masteredOrVisited.has(prereqId));
    }

    /**
     * Sort queue by mastery-aware priority scores
     */
    private sortQueueByPriority(queue: string[], profile: StudentMasteryProfile | null) {
        const difficultyWeight: Record<DifficultyLevel, number> = {
            [DifficultyLevel.BEGINNER]: 1,
            [DifficultyLevel.INTERMEDIATE]: 2,
            [DifficultyLevel.ADVANCED]: 3,
            [DifficultyLevel.CHALLENGE]: 4,
        };

        queue.sort((a, b) => {
            const nodeA = this.nodes.get(a)!;
            const nodeB = this.nodes.get(b)!;

            // Primary Sort: Priority score (higher is better)
            const priorityA = this.scoreNodePriority(a, profile);
            const priorityB = this.scoreNodePriority(b, profile);
            if (priorityA !== priorityB) return priorityB - priorityA;

            // Secondary: Difficulty (easier first for momentum)
            const diffA = difficultyWeight[nodeA.difficulty];
            const diffB = difficultyWeight[nodeB.difficulty];
            if (diffA !== diffB) return diffA - diffB;

            // Tertiary: Estimate Time (Shorter first)
            return nodeA.estimatedMinutes - nodeB.estimatedMinutes;
        });
    }

    /**
     * Legacy sort method for backward compatibility (no mastery profile)
     */
    private sortQueue(queue: string[]) {
        this.sortQueueByPriority(queue, null);
    }

    getNextNode(path: LearningPath): KnowledgeNode | null {
        if (path.currentPosition >= path.nodeSequence.length) return null;
        const nodeId = path.nodeSequence[path.currentPosition];
        return this.nodes.get(nodeId) || null;
    }

    /**
     * Get a specific node by ID
     */
    getNode(nodeId: string): KnowledgeNode | null {
        return this.nodes.get(nodeId) || null;
    }

    /**
     * Get all nodes in the knowledge graph
     */
    getAllNodes(): KnowledgeNode[] {
        return MVP_NODES;
    }
}
