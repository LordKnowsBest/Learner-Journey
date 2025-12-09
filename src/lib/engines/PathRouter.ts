import {
    KnowledgeNode,
    KnowledgeEdge,
    LearningPath,
    EdgeRelationship,
    NodeCategory
} from '../types';
import { MVP_NODES, MVP_EDGES } from '../knowledge-graph';

// Mock Data Provider access for MVP - in real app would inject
import { getStudentProgress } from '../data';

export class PathRouter {
    private nodes: Map<string, KnowledgeNode>;
    private edges: Map<string, KnowledgeEdge[]>;

    constructor() {
        this.nodes = new Map(MVP_NODES.map(n => [n.nodeId, n]));
        this.edges = this.buildAdjacencyList(MVP_EDGES);
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

    /**
     * Computes the optimal learning path for a student based on graph topology
     * and current mastery.
     */
    async computeOptimalPath(studentId: string): Promise<LearningPath> {
        // 1. Get current mastery state
        // In a real implementation, this would be await dataProvider.getStudentProgress(studentId)
        // For MVP, we assume empty progress if not found, or fetch mock
        const masteredNodes = new Set<string>(); // Mock: Start fresh

        // 2. Topological Sort / Traversal
        const pathNodes: string[] = [];
        const visited = new Set<string>();
        const queue: string[] = [];

        // Find start nodes (no un-mastered prerequisites)
        for (const node of MVP_NODES) {
            if (this.arePrerequisitesMet(node.nodeId, masteredNodes)) {
                queue.push(node.nodeId);
            }
        }

        // Sort start nodes by difficulty/importance
        this.sortQueue(queue);

        while (queue.length > 0) {
            const nodeId = queue.shift()!;
            if (visited.has(nodeId) || masteredNodes.has(nodeId)) continue;

            visited.add(nodeId);
            pathNodes.push(nodeId);

            // Add children if their prerequisites are now met (considering current path as 'met')
            const children = this.edges.get(nodeId) || [];
            for (const edge of children) {
                if (edge.relationshipType === EdgeRelationship.REQUIRES_UNDERSTANDING_OF) {
                    const childId = edge.targetNodeId;
                    // Check if ALL prereqs of child are met by (mastered + visited)
                    if (this.arePrerequisitesMet(childId, new Set([...masteredNodes, ...visited]))) {
                        queue.push(childId);
                    }
                }
            }
            this.sortQueue(queue);
        }

        // 3. Construct LearningPath object
        return {
            pathId: `path_${studentId}_${Date.now()}`,
            studentId,
            nodeSequence: pathNodes,
            currentPosition: 0,
            completedNodes: [],
            skippedNodes: [],
            injectedRemedialNodes: [],
            pathEfficiency: 100,
            createdAt: new Date(),
            lastModified: new Date()
        };
    }

    private arePrerequisitesMet(nodeId: string, masteredOrVisited: Set<string>): boolean {
        const node = this.nodes.get(nodeId);
        if (!node) return false;
        return node.prerequisites.every(prereqId => masteredOrVisited.has(prereqId));
    }

    private sortQueue(queue: string[]) {
        // Sort by difficulty (Beginner first)
        const difficultyWeight = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3,
            'challenge': 4
        };

        queue.sort((a, b) => {
            const nodeA = this.nodes.get(a)!;
            const nodeB = this.nodes.get(b)!;
            // Primary Sort: Difficulty
            const diffA = difficultyWeight[nodeA.difficulty];
            const diffB = difficultyWeight[nodeB.difficulty];
            if (diffA !== diffB) return diffA - diffB;

            // Secondary: Estimate Time (Shorter first for momentum)
            return nodeA.estimatedMinutes - nodeB.estimatedMinutes;
        });
    }

    getNextNode(path: LearningPath): KnowledgeNode | null {
        if (path.currentPosition >= path.nodeSequence.length) return null;
        const nodeId = path.nodeSequence[path.currentPosition];
        return this.nodes.get(nodeId) || null;
    }
}
