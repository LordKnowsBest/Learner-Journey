import { StudentGamification, LeaderboardEntry, Badge, Assessment } from '../types';

export const MOCK_STUDENTS: StudentGamification[] = [
    {
        studentId: 'demo_student_001',
        totalXP: 2450,
        level: 7,
        levelTitle: 'AI Explorer',
        currentStreak: 7,
        longestStreak: 14,
        lastActiveDate: new Date().toISOString().split('T')[0],
        streakProtectionTokens: 1,
        unlockedBadges: ['neural_navigator', 'data_explorer', 'ethics_starter', 'first_quest'],
        badgeProgress: {
            'bias_detective': 0.65,
            'collaboration_star': 0.30
        },
        activeQuests: ['bias_mystery'],
        completedQuests: ['ai_fundamentals_quest'],
        questProgress: {
            'bias_mystery': {
                questId: 'bias_mystery',
                status: 'in_progress',
                currentChapter: 3,
                chapterProgress: {
                    'ch1_discovery': { objectives: { 'data_bias_intro': true, 'types_of_bias': true }, completedAt: '2025-12-01' },
                    'ch2_investigation': { objectives: { 'bias_types_quiz': true, 'bias_personal_impact': true }, completedAt: '2025-12-05' },
                    'ch3_solution': { objectives: { 'bias_detection_tool': false, 'fairness_solutions_quiz': false }, completedAt: null }
                },
                startedAt: '2025-11-28',
                completedAt: null
            }
        },
        leaderboardOptIn: true,
        displayMode: 'initials',
        xpHistory: [
            { date: '2025-12-07', xpEarned: 150, source: 'quest_chapter_complete' },
            { date: '2025-12-06', xpEarned: 75, source: 'quiz_perfect' },
            { date: '2025-12-05', xpEarned: 50, source: 'node_completion' }
        ]
    },
    {
        studentId: 'demo_student_002',
        totalXP: 3120,
        level: 8,
        levelTitle: 'Machine Mentor',
        currentStreak: 12,
        longestStreak: 12,
        lastActiveDate: new Date().toISOString().split('T')[0],
        streakProtectionTokens: 2,
        unlockedBadges: ['neural_navigator', 'data_explorer', 'ethics_starter', 'first_quest', 'bias_detective', 'streak_warrior'],
        badgeProgress: {},
        activeQuests: [],
        completedQuests: ['ai_fundamentals_quest', 'bias_mystery'],
        questProgress: {},
        leaderboardOptIn: true,
        displayMode: 'full_name',
        xpHistory: []
    },
    {
        studentId: 'demo_student_003',
        totalXP: 890,
        level: 4,
        levelTitle: 'Algorithm Apprentice',
        currentStreak: 2,
        longestStreak: 5,
        lastActiveDate: '2025-12-07',
        streakProtectionTokens: 0,
        unlockedBadges: ['data_explorer'],
        badgeProgress: {
            'neural_navigator': 0.40
        },
        activeQuests: ['ai_fundamentals_quest'],
        completedQuests: [],
        questProgress: {},
        leaderboardOptIn: true,
        displayMode: 'anonymous',
        xpHistory: []
    }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, studentId: 'demo_student_002', displayName: 'Emma S.', xp: 3120, level: 8, streak: 12, isAnonymous: false },
    { rank: 2, studentId: 'demo_student_004', displayName: 'Marcus T.', xp: 2890, level: 7, streak: 9, isAnonymous: false },
    { rank: 3, studentId: 'demo_student_005', displayName: 'Sophia L.', xp: 2750, level: 7, streak: 6, isAnonymous: false },
    { rank: 4, studentId: 'demo_student_001', displayName: 'Demo User', xp: 2450, level: 7, streak: 7, isAnonymous: false },
    { rank: 5, studentId: 'demo_student_006', displayName: 'Anonymous #1', xp: 2100, level: 6, streak: 4, isAnonymous: true },
    { rank: 6, studentId: 'demo_student_003', displayName: 'Anonymous #2', xp: 890, level: 4, streak: 2, isAnonymous: true }
];

export const MOCK_BADGES: Badge[] = [
    // MVP: 10 core badges (2 per category)

    // MASTERY (2)
    {
        id: 'neural_navigator',
        name: 'Neural Network Navigator',
        description: 'Master the fundamentals of neural networks',
        category: 'mastery',
        tier: 'silver',
        iconUrl: '🧠',
        unlockCriteria: {
            type: 'compound',
            conditions: [
                { metric: 'nodesMastered', domain: 'machine_learning', threshold: 5 },
                { metric: 'quizScore', nodeId: 'neural_networks_intro', threshold: 80 }
            ],
            requireAll: true
        },
        xpReward: 200,
        isSecret: false
    },
    {
        id: 'data_explorer',
        name: 'Data Explorer',
        description: 'Understand how AI systems use data',
        category: 'mastery',
        tier: 'bronze',
        iconUrl: '📊',
        unlockCriteria: {
            type: 'threshold',
            conditions: [
                { metric: 'nodesMastered', domain: 'data_fundamentals', threshold: 3 }
            ],
            requireAll: true
        },
        xpReward: 100,
        isSecret: false
    },

    // ENGAGEMENT (2)
    {
        id: 'streak_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        category: 'engagement',
        tier: 'silver',
        iconUrl: '🔥',
        unlockCriteria: {
            type: 'streak',
            conditions: [
                { metric: 'streak', threshold: 7 }
            ],
            requireAll: true
        },
        xpReward: 150,
        isSecret: false
    },
    {
        id: 'first_quest',
        name: 'Quest Beginner',
        description: 'Complete your first learning quest',
        category: 'engagement',
        tier: 'bronze',
        iconUrl: '⚔️',
        unlockCriteria: {
            type: 'threshold',
            conditions: [
                { metric: 'questsCompleted', threshold: 1 }
            ],
            requireAll: true
        },
        xpReward: 100,
        isSecret: false
    },

    // EXPLORATION (2)
    {
        id: 'curious_mind',
        name: 'Curious Mind',
        description: 'Explore optional resources in 5 different topics',
        category: 'exploration',
        tier: 'bronze',
        iconUrl: '🔍',
        unlockCriteria: {
            type: 'threshold',
            conditions: [
                { metric: 'optionalResourcesViewed', threshold: 5 }
            ],
            requireAll: true
        },
        xpReward: 75,
        isSecret: false
    },
    {
        id: 'path_pioneer',
        name: 'Path Pioneer',
        description: 'Try an alternative learning path',
        category: 'exploration',
        tier: 'silver',
        iconUrl: '🛤️',
        unlockCriteria: {
            type: 'event',
            conditions: [
                { event: 'alternativePathSelected', count: 1 }
            ],
            requireAll: true
        },
        xpReward: 125,
        isSecret: false
    },

    // ETHICS (2)
    {
        id: 'ethics_starter',
        name: 'Ethics Explorer',
        description: 'Complete your first ethics module',
        category: 'ethics',
        tier: 'bronze',
        iconUrl: '⚖️',
        unlockCriteria: {
            type: 'threshold',
            conditions: [
                { metric: 'nodesMastered', domain: 'ethics_bias_society', threshold: 2 }
            ],
            requireAll: true
        },
        xpReward: 100,
        isSecret: false
    },
    {
        id: 'bias_detective',
        name: 'Bias Detective',
        description: 'Identify and analyze bias in AI systems',
        category: 'ethics',
        tier: 'gold',
        iconUrl: '🕵️',
        unlockCriteria: {
            type: 'compound',
            conditions: [
                { metric: 'nodesMastered', domain: 'ethics_bias_society', threshold: 8 },
                { metric: 'problemSolvingScore', task: 'bias_detection', threshold: 85 },
                { metric: 'reflectionsSubmitted', topic: 'fairness', threshold: 3 }
            ],
            requireAll: true
        },
        xpReward: 350,
        isSecret: false
    },

    // COLLABORATION (2)
    {
        id: 'team_player',
        name: 'Team Player',
        description: 'Participate in a collaborative activity',
        category: 'collaboration',
        tier: 'bronze',
        iconUrl: '🤝',
        unlockCriteria: {
            type: 'event',
            conditions: [
                { event: 'collaborativeActivityCompleted', count: 1 }
            ],
            requireAll: true
        },
        xpReward: 75,
        isSecret: false
    },
    {
        id: 'knowledge_sharer',
        name: 'Knowledge Sharer',
        description: 'Help peers understand difficult concepts',
        category: 'collaboration',
        tier: 'silver',
        iconUrl: '🗣️',
        unlockCriteria: {
            type: 'threshold',
            conditions: [
                { metric: 'peerHelpVerified', threshold: 3 }
            ],
            requireAll: true
        },
        xpReward: 200,
        isSecret: false
    }
];

export const MOCK_ASSESSMENTS: Assessment[] = [
    {
        assessmentId: 'a1',
        studentId: 'demo_student_001',
        type: 'quiz',
        score: 85,
        submittedAt: '2025-12-05T10:00:00Z'
    },
    {
        assessmentId: 'a2',
        studentId: 'demo_student_001',
        type: 'reflection',
        score: 90,
        submittedAt: '2025-12-06T14:30:00Z'
    }
];
