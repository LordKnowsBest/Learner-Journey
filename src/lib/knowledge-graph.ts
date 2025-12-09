import {
    KnowledgeNode,
    KnowledgeEdge,
    NodeCategory,
    DifficultyLevel,
    EdgeRelationship
} from './types';

export const MVP_NODES: KnowledgeNode[] = [
    // AI FUNDAMENTALS (Foundation)
    {
        nodeId: "ai_intro_001",
        title: "What is Artificial Intelligence?",
        description: "Introduction to AI concepts and everyday applications",
        category: NodeCategory.AI_FUNDAMENTALS,
        difficulty: DifficultyLevel.BEGINNER,
        gradeLevel: [6, 7, 8],
        prerequisites: [],
        relatedNodes: ["ai_history_001", "ai_applications_001"],
        ethicsConnections: ["ethics_intro_001"],
        estimatedMinutes: 15,
        masteryThreshold: 80,
        relatedScenarioId: "school_ai_tutor",
        relatedPhaseId: "phase_1_understand" // Orientation Phase
    },

    // DATA FUNDAMENTALS
    {
        nodeId: "data_basics_001",
        title: "What is Data?",
        description: "Understanding data types, collection, and representation",
        category: NodeCategory.MACHINE_LEARNING_DATA,
        difficulty: DifficultyLevel.BEGINNER,
        gradeLevel: [6, 7, 8],
        prerequisites: ["ai_intro_001"],
        relatedNodes: ["data_collection_001", "data_types_001"],
        ethicsConnections: ["privacy_intro_001"],
        estimatedMinutes: 20,
        masteryThreshold: 80,
        relatedScenarioId: "school_ai_tutor",
        relatedPhaseId: "phase_2_privacy" // Privacy Phase uses concepts from Data Basics
    },

    // MACHINE LEARNING
    {
        nodeId: "ml_basics_001",
        title: "Introduction to Machine Learning",
        description: "How machines learn from data patterns",
        category: NodeCategory.MACHINE_LEARNING_DATA,
        difficulty: DifficultyLevel.INTERMEDIATE,
        gradeLevel: [7, 8],
        prerequisites: ["ai_intro_001", "data_basics_001"],
        relatedNodes: ["supervised_learning_001", "unsupervised_learning_001"],
        ethicsConnections: ["bias_intro_001"],
        estimatedMinutes: 25,
        masteryThreshold: 80,
        relatedScenarioId: "school_ai_tutor", // ML Concepts are revealed here
        relatedPhaseId: "phase_3_fairness"
    },

    // BIAS & ETHICS (Critical Path)
    {
        nodeId: "bias_intro_001",
        title: "Understanding Bias in AI",
        description: "How bias enters AI systems and why it matters",
        category: NodeCategory.ETHICS_BIAS_SOCIETY,
        difficulty: DifficultyLevel.INTERMEDIATE,
        gradeLevel: [6, 7, 8],
        prerequisites: ["data_basics_001"],
        relatedNodes: ["bias_types_001", "bias_detection_001"],
        ethicsConnections: ["fairness_001", "accountability_001"],
        estimatedMinutes: 25,
        masteryThreshold: 80,
        relatedScenarioId: "school_ai_tutor",
        relatedPhaseId: "phase_3_fairness"
    },

    // ALGORITHMIC THINKING
    {
        nodeId: "algo_thinking_001",
        title: "Algorithmic Thinking",
        description: "Breaking down problems into step-by-step solutions",
        category: NodeCategory.AI_LITERACY_SKILLS,
        difficulty: DifficultyLevel.INTERMEDIATE,
        gradeLevel: [6, 7, 8],
        prerequisites: ["ai_intro_001"],
        relatedNodes: ["problem_decomposition_001", "pattern_recognition_001"],
        ethicsConnections: ["transparency_001"],
        estimatedMinutes: 30,
        masteryThreshold: 75,
        relatedScenarioId: "school_ai_tutor",
        relatedPhaseId: "phase_4_oversight"
    },

    // NEURAL NETWORKS (Advanced)
    {
        nodeId: "neural_networks_001",
        title: "Introduction to Neural Networks",
        description: "How artificial neural networks mimic brain structure",
        category: NodeCategory.MACHINE_LEARNING_DATA,
        difficulty: DifficultyLevel.ADVANCED,
        gradeLevel: [8],
        prerequisites: ["ml_basics_001", "algo_thinking_001"],
        relatedNodes: ["deep_learning_001", "training_data_001"],
        ethicsConnections: ["explainability_001"],
        estimatedMinutes: 35,
        masteryThreshold: 80
    }
];

export const MVP_EDGES: KnowledgeEdge[] = [
    // Prerequisite Chains
    {
        edgeId: "edge_001",
        sourceNodeId: "ai_intro_001",
        targetNodeId: "data_basics_001",
        relationshipType: EdgeRelationship.REQUIRES_UNDERSTANDING_OF,
        weight: 1.0,
        isRequired: true
    },
    {
        edgeId: "edge_002",
        sourceNodeId: "data_basics_001",
        targetNodeId: "ml_basics_001",
        relationshipType: EdgeRelationship.REQUIRES_UNDERSTANDING_OF,
        weight: 1.0,
        isRequired: true
    },
    {
        edgeId: "edge_003",
        sourceNodeId: "ai_intro_001",
        targetNodeId: "ml_basics_001",
        relationshipType: EdgeRelationship.REQUIRES_UNDERSTANDING_OF,
        weight: 1.0,
        isRequired: true
    },
    {
        edgeId: "edge_004",
        sourceNodeId: "ml_basics_001",
        targetNodeId: "neural_networks_001",
        relationshipType: EdgeRelationship.REQUIRES_UNDERSTANDING_OF,
        weight: 1.0,
        isRequired: true
    },
    {
        edgeId: "edge_005",
        sourceNodeId: "algo_thinking_001",
        targetNodeId: "neural_networks_001",
        relationshipType: EdgeRelationship.REQUIRES_UNDERSTANDING_OF,
        weight: 0.8,
        isRequired: true
    },

    // Ethics Bridges
    {
        edgeId: "edge_006",
        sourceNodeId: "data_basics_001",
        targetNodeId: "bias_intro_001",
        relationshipType: EdgeRelationship.HAS_ETHICAL_IMPLICATIONS,
        weight: 0.9,
        isRequired: false
    },
    {
        edgeId: "edge_007",
        sourceNodeId: "ml_basics_001",
        targetNodeId: "bias_intro_001",
        relationshipType: EdgeRelationship.HAS_ETHICAL_IMPLICATIONS,
        weight: 1.0,
        isRequired: false
    }
];
