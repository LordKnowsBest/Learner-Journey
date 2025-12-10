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
    // ============================================
    // JOURNEY MILESTONES - Aligned with Session Progress
    // ============================================

    // First Steps (Bronze)
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete the diagnostic assessment and begin your learning journey',
        category: 'engagement',
        tier: 'bronze',
        iconUrl: '👣',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'diagnostic_completed' }],
            requireAll: true
        },
        xpReward: 50,
        isSecret: false
    },
    {
        id: 'problem_solver',
        name: 'Problem Solver',
        description: 'Complete your first ethical problem investigation',
        category: 'mastery',
        tier: 'bronze',
        iconUrl: '🔧',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'problemsCompleted', threshold: 1 }],
            requireAll: true
        },
        xpReward: 100,
        isSecret: false
    },
    {
        id: 'problem_pro',
        name: 'Problem Pro',
        description: 'Complete 3 ethical problem investigations',
        category: 'mastery',
        tier: 'silver',
        iconUrl: '🏆',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'problemsCompleted', threshold: 3 }],
            requireAll: true
        },
        xpReward: 200,
        isSecret: false
    },
    {
        id: 'ethics_champion',
        name: 'Ethics Champion',
        description: 'Complete 5 ethical problem investigations',
        category: 'mastery',
        tier: 'gold',
        iconUrl: '🌟',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'problemsCompleted', threshold: 5 }],
            requireAll: true
        },
        xpReward: 350,
        isSecret: false
    },

    // ============================================
    // CONCEPT DISCOVERY - Aligned with Discovered Concepts
    // ============================================

    {
        id: 'concept_curious',
        name: 'Concept Curious',
        description: 'Discover your first concept while investigating',
        category: 'exploration',
        tier: 'bronze',
        iconUrl: '💡',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'conceptsDiscovered', threshold: 1 }],
            requireAll: true
        },
        xpReward: 50,
        isSecret: false
    },
    {
        id: 'knowledge_seeker',
        name: 'Knowledge Seeker',
        description: 'Discover 5 different concepts',
        category: 'exploration',
        tier: 'bronze',
        iconUrl: '📚',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'conceptsDiscovered', threshold: 5 }],
            requireAll: true
        },
        xpReward: 100,
        isSecret: false
    },
    {
        id: 'concept_collector',
        name: 'Concept Collector',
        description: 'Discover 10 different concepts',
        category: 'exploration',
        tier: 'silver',
        iconUrl: '🗃️',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'conceptsDiscovered', threshold: 10 }],
            requireAll: true
        },
        xpReward: 175,
        isSecret: false
    },
    {
        id: 'knowledge_architect',
        name: 'Knowledge Architect',
        description: 'Discover 20 different concepts and build a comprehensive understanding',
        category: 'exploration',
        tier: 'gold',
        iconUrl: '🏛️',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'conceptsDiscovered', threshold: 20 }],
            requireAll: true
        },
        xpReward: 300,
        isSecret: false
    },

    // ============================================
    // MASTERY - Aligned with Concept Mastery Levels
    // ============================================

    {
        id: 'apprentice',
        name: 'Apprentice',
        description: 'Reach 50% mastery on any concept',
        category: 'mastery',
        tier: 'bronze',
        iconUrl: '📖',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'maxMasteryLevel', threshold: 50 }],
            requireAll: true
        },
        xpReward: 75,
        isSecret: false
    },
    {
        id: 'journeyman',
        name: 'Journeyman',
        description: 'Reach 75% mastery on any concept',
        category: 'mastery',
        tier: 'silver',
        iconUrl: '🎓',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'maxMasteryLevel', threshold: 75 }],
            requireAll: true
        },
        xpReward: 150,
        isSecret: false
    },
    {
        id: 'master',
        name: 'Master',
        description: 'Achieve 100% mastery on any concept',
        category: 'mastery',
        tier: 'gold',
        iconUrl: '👑',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'maxMasteryLevel', threshold: 100 }],
            requireAll: true
        },
        xpReward: 250,
        isSecret: false
    },
    {
        id: 'polymath',
        name: 'Polymath',
        description: 'Achieve 75%+ mastery on 5 different concepts',
        category: 'mastery',
        tier: 'gold',
        iconUrl: '🌐',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'conceptsWithHighMastery', threshold: 5 }],
            requireAll: true
        },
        xpReward: 400,
        isSecret: false
    },

    // ============================================
    // REFLECTION - Aligned with Reflection Submissions
    // ============================================

    {
        id: 'thoughtful_learner',
        name: 'Thoughtful Learner',
        description: 'Submit your first reflection',
        category: 'ethics',
        tier: 'bronze',
        iconUrl: '🤔',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'reflectionsSubmitted', threshold: 1 }],
            requireAll: true
        },
        xpReward: 75,
        isSecret: false
    },
    {
        id: 'deep_thinker',
        name: 'Deep Thinker',
        description: 'Submit 3 reflections demonstrating critical thinking',
        category: 'ethics',
        tier: 'silver',
        iconUrl: '🧘',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'reflectionsSubmitted', threshold: 3 }],
            requireAll: true
        },
        xpReward: 150,
        isSecret: false
    },
    {
        id: 'philosopher',
        name: 'Philosopher',
        description: 'Submit 5 reflections showing deep ethical reasoning',
        category: 'ethics',
        tier: 'gold',
        iconUrl: '🦉',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'reflectionsSubmitted', threshold: 5 }],
            requireAll: true
        },
        xpReward: 300,
        isSecret: false
    },

    // ============================================
    // IMPROVEMENT - Aligned with Pre/Post Test Scores
    // ============================================

    {
        id: 'growth_mindset',
        name: 'Growth Mindset',
        description: 'Improve your score from diagnostic to post-test',
        category: 'engagement',
        tier: 'bronze',
        iconUrl: '📈',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'scoreImprovement', threshold: 1 }],
            requireAll: true
        },
        xpReward: 100,
        isSecret: false
    },
    {
        id: 'rapid_learner',
        name: 'Rapid Learner',
        description: 'Improve your score by 20+ points',
        category: 'engagement',
        tier: 'silver',
        iconUrl: '🚀',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'scoreImprovement', threshold: 20 }],
            requireAll: true
        },
        xpReward: 200,
        isSecret: false
    },
    {
        id: 'transformation',
        name: 'Transformation',
        description: 'Improve your score by 40+ points',
        category: 'engagement',
        tier: 'gold',
        iconUrl: '🦋',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'scoreImprovement', threshold: 40 }],
            requireAll: true
        },
        xpReward: 350,
        isSecret: false
    },

    // ============================================
    // ENGAGEMENT - Learning Time & Streaks
    // ============================================

    {
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Spend 30 minutes learning',
        category: 'engagement',
        tier: 'bronze',
        iconUrl: '⏱️',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'learningTimeMinutes', threshold: 30 }],
            requireAll: true
        },
        xpReward: 50,
        isSecret: false
    },
    {
        id: 'committed_scholar',
        name: 'Committed Scholar',
        description: 'Spend 2 hours learning',
        category: 'engagement',
        tier: 'silver',
        iconUrl: '📅',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'learningTimeMinutes', threshold: 120 }],
            requireAll: true
        },
        xpReward: 150,
        isSecret: false
    },
    {
        id: 'streak_starter',
        name: 'Streak Starter',
        description: 'Maintain a 3-day learning streak',
        category: 'engagement',
        tier: 'bronze',
        iconUrl: '🔥',
        unlockCriteria: {
            type: 'streak',
            conditions: [{ metric: 'streak', threshold: 3 }],
            requireAll: true
        },
        xpReward: 75,
        isSecret: false
    },
    {
        id: 'streak_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        category: 'engagement',
        tier: 'silver',
        iconUrl: '⚡',
        unlockCriteria: {
            type: 'streak',
            conditions: [{ metric: 'streak', threshold: 7 }],
            requireAll: true
        },
        xpReward: 150,
        isSecret: false
    },
    {
        id: 'streak_legend',
        name: 'Streak Legend',
        description: 'Maintain a 14-day learning streak',
        category: 'engagement',
        tier: 'gold',
        iconUrl: '💫',
        unlockCriteria: {
            type: 'streak',
            conditions: [{ metric: 'streak', threshold: 14 }],
            requireAll: true
        },
        xpReward: 300,
        isSecret: false
    },

    // ============================================
    // ETHICS DOMAIN SPECIFIC
    // ============================================

    {
        id: 'bias_aware',
        name: 'Bias Aware',
        description: 'Complete a problem about AI bias',
        category: 'ethics',
        tier: 'bronze',
        iconUrl: '⚖️',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'bias_problem_completed' }],
            requireAll: true
        },
        xpReward: 100,
        isSecret: false
    },
    {
        id: 'privacy_guardian',
        name: 'Privacy Guardian',
        description: 'Complete a problem about data privacy',
        category: 'ethics',
        tier: 'bronze',
        iconUrl: '🔒',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'privacy_problem_completed' }],
            requireAll: true
        },
        xpReward: 100,
        isSecret: false
    },
    {
        id: 'transparency_advocate',
        name: 'Transparency Advocate',
        description: 'Complete a problem about AI transparency',
        category: 'ethics',
        tier: 'bronze',
        iconUrl: '🔍',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'transparency_problem_completed' }],
            requireAll: true
        },
        xpReward: 100,
        isSecret: false
    },
    {
        id: 'bias_detective',
        name: 'Bias Detective',
        description: 'Master bias detection across multiple scenarios',
        category: 'ethics',
        tier: 'gold',
        iconUrl: '🕵️',
        unlockCriteria: {
            type: 'compound',
            conditions: [
                { metric: 'conceptsDiscovered', domain: 'bias', threshold: 5 },
                { metric: 'problemsCompleted', domain: 'bias', threshold: 2 }
            ],
            requireAll: true
        },
        xpReward: 350,
        isSecret: false
    },

    // ============================================
    // SECRET BADGES - Hidden until unlocked
    // ============================================

    {
        id: 'perfect_score',
        name: 'Perfectionist',
        description: 'Score 100% on the post-test',
        category: 'mastery',
        tier: 'gold',
        iconUrl: '💯',
        unlockCriteria: {
            type: 'threshold',
            conditions: [{ metric: 'postTestScore', threshold: 100 }],
            requireAll: true
        },
        xpReward: 500,
        isSecret: true
    },
    {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a problem in under 10 minutes',
        category: 'engagement',
        tier: 'silver',
        iconUrl: '⚡',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'problem_completed_fast' }],
            requireAll: true
        },
        xpReward: 150,
        isSecret: true
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Study between midnight and 5 AM',
        category: 'engagement',
        tier: 'bronze',
        iconUrl: '🦉',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'late_night_study' }],
            requireAll: true
        },
        xpReward: 50,
        isSecret: true
    },
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Study between 5 AM and 7 AM',
        category: 'engagement',
        tier: 'bronze',
        iconUrl: '🐦',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'early_morning_study' }],
            requireAll: true
        },
        xpReward: 50,
        isSecret: true
    },
    {
        id: 'comeback_kid',
        name: 'Comeback Kid',
        description: 'Return after a week away and continue learning',
        category: 'engagement',
        tier: 'silver',
        iconUrl: '🔄',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'returned_after_break' }],
            requireAll: true
        },
        xpReward: 100,
        isSecret: true
    },

    // ============================================
    // COLLABORATION (Future Feature Prep)
    // ============================================

    {
        id: 'team_player',
        name: 'Team Player',
        description: 'Participate in a collaborative activity',
        category: 'collaboration',
        tier: 'bronze',
        iconUrl: '🤝',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'collaborativeActivityCompleted' }],
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
            conditions: [{ metric: 'peerHelpVerified', threshold: 3 }],
            requireAll: true
        },
        xpReward: 200,
        isSecret: false
    },

    // ============================================
    // JOURNEY COMPLETION
    // ============================================

    {
        id: 'journey_complete',
        name: 'Journey Complete',
        description: 'Complete the entire learning journey from diagnostic to post-test',
        category: 'mastery',
        tier: 'gold',
        iconUrl: '🎖️',
        unlockCriteria: {
            type: 'event',
            conditions: [{ event: 'journey_completed' }],
            requireAll: true
        },
        xpReward: 500,
        isSecret: false
    },
    {
        id: 'ethics_scholar',
        name: 'Ethics Scholar',
        description: 'Complete the journey with 80%+ on post-test and 3+ reflections',
        category: 'ethics',
        tier: 'gold',
        iconUrl: '🏅',
        unlockCriteria: {
            type: 'compound',
            conditions: [
                { metric: 'postTestScore', threshold: 80 },
                { metric: 'reflectionsSubmitted', threshold: 3 }
            ],
            requireAll: true
        },
        xpReward: 600,
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
