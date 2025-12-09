import { Quest } from '../types';

export const MVP_QUEST: Quest = {
    id: 'bias_mystery',
    title: 'The Mystery of Biased Algorithms',
    description: 'Investigate how bias creeps into AI systems and design solutions',
    type: 'main',
    chapters: [
        {
            id: 'ch1_discovery',
            title: 'Chapter 1: The Discovery',
            narrative: `You arrive at school to find students buzzing about the new AI book recommendation 
                  system. But something seems off—several students notice the AI keeps suggesting 
                  the same types of books over and over. Your mission: Find out why.`,
            objectives: [
                { type: 'complete_node', target: 'data_bias_intro', label: 'Learn about data bias' },
                { type: 'complete_node', target: 'types_of_bias', label: 'Explore types of AI bias' }
            ],
            xpReward: 100
        },
        {
            id: 'ch2_investigation',
            title: 'Chapter 2: The Investigation',
            narrative: `Armed with your new knowledge about bias, it's time to dig deeper. 
                  Interview the AI system (through quizzes) and reflect on what you've learned.`,
            objectives: [
                { type: 'pass_quiz', target: 'bias_types_quiz', threshold: 80, label: 'Pass the Bias Detection Quiz (80%+)' },
                { type: 'submit_reflection', target: 'bias_personal_impact', label: 'Write a reflection on bias impact' }
            ],
            xpReward: 150
        },
        {
            id: 'ch3_solution',
            title: 'Chapter 3: Finding Fair Solutions',
            narrative: `You've identified the problem. Now it's time to become part of the solution. 
                  Design a tool to detect bias and prove your mastery of fairness concepts.`,
            objectives: [
                { type: 'solve_problem', target: 'bias_detection_tool', label: 'Design a bias detection approach' },
                { type: 'pass_quiz', target: 'fairness_solutions_quiz', threshold: 85, label: 'Master Fairness Solutions Quiz (85%+)' }
            ],
            xpReward: 200
        }
    ],
    rewards: {
        xp: 500,
        badge: 'bias_detective',
        certificateId: 'bias_warrior'
    },
    prerequisites: []  // MVP: No prerequisites required
};
